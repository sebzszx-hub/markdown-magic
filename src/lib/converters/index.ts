import { pdfConverter } from "./pdf.converter";
import { docxConverter } from "./docx.converter";
import { jsonConverter } from "./json.converter";
import { txtConverter } from "./txt.converter";
import { htmlConverter } from "./html.converter";
import type { Converter } from "./types";

/**
 * Registro de conversores.
 *
 * ¿Cómo agregar un nuevo formato?
 *   1. Crear src/lib/converters/<formato>.converter.ts implementando Converter.
 *   2. Importarlo aquí.
 *   3. Agregarlo a este mapa con su MIME type y/o extensión.
 *
 * El endpoint /api/convert busca primero por MIME type; si no encuentra,
 * cae al lookup por extensión (porque algunos navegadores reportan MIME
 * type vacío o genérico para ciertos archivos).
 */

// Mapa por MIME type — la fuente primaria de resolución
const byMimeType: Record<string, Converter> = {
  "application/pdf": pdfConverter,
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    docxConverter,
  "application/json": jsonConverter,
  "text/plain": txtConverter,
  "text/html": htmlConverter,
  "text/markdown": txtConverter, // .md también se trata como texto plano
};

// Mapa por extensión — fallback cuando el MIME type no es confiable
const byExtension: Record<string, Converter> = {
  pdf: pdfConverter,
  docx: docxConverter,
  json: jsonConverter,
  txt: txtConverter,
  html: htmlConverter,
  htm: htmlConverter,
  md: txtConverter,
};

/**
 * Resuelve el conversor adecuado para un archivo dado.
 * Devuelve null si el formato no está soportado.
 */
export function resolveConverter(
  mimeType: string,
  filename: string
): Converter | null {
  // 1. Intento por MIME type
  if (byMimeType[mimeType]) {
    return byMimeType[mimeType];
  }

  // 2. Fallback por extensión
  const extension = filename.split(".").pop()?.toLowerCase() || "";
  if (byExtension[extension]) {
    return byExtension[extension];
  }

  return null;
}
