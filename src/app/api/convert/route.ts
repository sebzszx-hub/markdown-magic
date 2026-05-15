import { NextResponse } from "next/server";
import { resolveConverter } from "@/lib/converters";
import { MAX_FILE_SIZE } from "@/lib/constants";
import type { ConversionResponse } from "@/types";

// Forzamos runtime Node.js (no Edge) porque pdf-parse y mammoth necesitan APIs de Node
export const runtime = "nodejs";

// Margen generoso para PDFs grandes
export const maxDuration = 60;

/**
 * POST /api/convert
 *
 * Recibe un archivo en multipart/form-data bajo el campo "file" y
 * devuelve el Markdown resultante en JSON.
 *
 * Diseño: este handler es deliberadamente delgado. Toda la lógica de
 * conversión vive en /lib/converters/* (Strategy Pattern). Aquí solo:
 *   1. Validamos la entrada.
 *   2. Resolvemos el conversor adecuado.
 *   3. Delegamos.
 *   4. Devolvemos la respuesta o un error legible.
 */
export async function POST(
  request: Request
): Promise<NextResponse<ConversionResponse>> {
  try {
    // 1. Extraemos el FormData
    const formData = await request.formData();
    const file = formData.get("file");

    // 2. Validaciones básicas
    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        {
          success: false,
          error: "No recibí ningún archivo. ¿Lo seleccionaste correctamente?",
        },
        { status: 400 }
      );
    }

    if (file.size === 0) {
      return NextResponse.json(
        { success: false, error: "El archivo está vacío." },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          error: `El archivo es demasiado grande (${(file.size / 1024 / 1024).toFixed(1)} MB). Máximo: 25 MB.`,
        },
        { status: 413 }
      );
    }

    // 3. Resolución del conversor (Strategy Pattern)
    const converter = resolveConverter(file.type, file.name);
    if (!converter) {
      return NextResponse.json(
        {
          success: false,
          error: `Formato no soportado: ${file.type || file.name.split(".").pop()}. Aceptamos PDF, DOCX, JSON, TXT y HTML.`,
        },
        { status: 415 }
      );
    }

    // 4. Conversión propiamente dicha
    const buffer = Buffer.from(await file.arrayBuffer());
    const markdown = await converter.convert(buffer, file.name);

    if (!markdown.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: "No pude extraer contenido del archivo. ¿Está vacío?",
        },
        { status: 422 }
      );
    }

    return NextResponse.json({
      success: true,
      markdown,
    });
  } catch (error) {
    // Errores controlados (lanzados por los conversores con mensaje legible)
    if (error instanceof Error) {
      console.error("[api/convert] Error:", error.message);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    // Errores inesperados
    console.error("[api/convert] Unknown error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Algo salió mal. Inténtalo de nuevo en un momento.",
      },
      { status: 500 }
    );
  }
}
