import type { Converter } from "./types";

/**
 * Conversor de TXT → Markdown.
 *
 * Estrategia: TXT ya es prácticamente Markdown. Solo:
 *  - Añadimos un H1 con el nombre del archivo.
 *  - Normalizamos los saltos de línea.
 *  - Convertimos líneas que parecen listas ("- ", "* ", "1. ") a Markdown
 *    (en realidad ya son válidas, pero limpiamos espacios extraños).
 */
export const txtConverter: Converter = {
  name: "txt",

  async convert(buffer: Buffer, filename: string): Promise<string> {
    const text = buffer.toString("utf-8");

    if (!text.trim()) {
      throw new Error("El archivo de texto está vacío.");
    }

    const title = filename.replace(/\.[^.]+$/, "").replace(/[_-]+/g, " ");

    // Normalizamos saltos de línea y limpiamos espacios excesivos
    const cleaned = text
      .replace(/\r\n/g, "\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim();

    return [
      `# ${title}`,
      "",
      "> Convertido automáticamente desde texto plano",
      "",
      cleaned,
    ].join("\n");
  },
};
