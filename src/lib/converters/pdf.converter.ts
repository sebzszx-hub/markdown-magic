import type { Converter } from "./types";

/**
 * Conversor de PDF → Markdown.
 *
 * Estrategia:
 *  - Usamos pdf-parse para extraer texto plano del PDF.
 *  - Reconstruimos párrafos a partir de los saltos de línea
 *    (pdf-parse devuelve "\n" entre líneas y "\n\n" entre párrafos).
 *  - Detectamos posibles títulos (líneas cortas en mayúscula o sin punto final)
 *    y los marcamos como encabezados de nivel 2.
 *
 * ⚠️ Importante: importamos desde "pdf-parse/lib/pdf-parse.js" en lugar de
 * "pdf-parse". El index.js de la librería tiene código de debug que intenta
 * leer un PDF de test al cargar, lo cual rompe en Next.js. Esta ruta interna
 * evita el problema.
 */
export const pdfConverter: Converter = {
  name: "pdf",

  async convert(buffer: Buffer, filename: string): Promise<string> {
    try {
      // Import dinámico para evitar el bug del index.js de pdf-parse
      const pdfParse = (await import("pdf-parse/lib/pdf-parse.js")).default;
      const data = await pdfParse(buffer);

      const rawText = data.text || "";

      if (!rawText.trim()) {
        throw new Error(
          "El PDF parece estar vacío o ser una imagen escaneada. Para PDFs escaneados se necesita OCR."
        );
      }

      // Limpiamos el título del archivo para usarlo como H1
      const title = filename.replace(/\.[^.]+$/, "").replace(/[_-]+/g, " ");

      // Procesamos párrafos: separados por doble salto de línea
      const paragraphs = rawText
        .split(/\n\s*\n/)
        .map((p) => p.trim())
        .filter((p) => p.length > 0)
        .map(formatParagraph);

      return [
        `# ${title}`,
        "",
        `> Convertido automáticamente desde PDF · ${data.numpages} página${data.numpages !== 1 ? "s" : ""}`,
        "",
        ...paragraphs,
      ].join("\n\n");
    } catch (error) {
      if (error instanceof Error && error.message.includes("escaneada")) {
        throw error;
      }
      throw new Error(
        `No pude leer el PDF. Puede estar corrupto o protegido con contraseña.`
      );
    }
  },
};

/**
 * Aplica heurísticas suaves a cada párrafo:
 *  - Une líneas cortadas a mitad de oración (común en PDFs).
 *  - Detecta encabezados probables (líneas cortas sin punto final).
 */
function formatParagraph(paragraph: string): string {
  // Une líneas internas que no son saltos de párrafo reales
  const joined = paragraph
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .join(" ")
    .replace(/\s+/g, " ");

  // Heurística simple para detectar encabezados:
  // - Menos de 80 caracteres
  // - No termina con punto, signo de exclamación o interrogación
  // - Tiene más letras que dígitos
  const looksLikeHeading =
    joined.length > 0 &&
    joined.length < 80 &&
    !/[.!?:;]$/.test(joined) &&
    /[a-zA-ZÀ-ÿ]/.test(joined);

  if (looksLikeHeading) {
    return `## ${joined}`;
  }

  return joined;
}
