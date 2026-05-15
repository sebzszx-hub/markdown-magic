import TurndownService from "turndown";
import type { Converter } from "./types";

/**
 * Conversor de HTML → Markdown.
 *
 * Estrategia: usamos turndown, que es el estándar de facto para HTML→MD.
 * Antes de convertir, limpiamos elementos que no aportan al contenido
 * (scripts, estilos, comentarios) para que el resultado sea más limpio.
 */

const turndown = new TurndownService({
  headingStyle: "atx",
  bulletListMarker: "-",
  codeBlockStyle: "fenced",
  emDelimiter: "_",
  strongDelimiter: "**",
  linkStyle: "inlined",
});

// Eliminamos scripts y estilos: no son contenido
turndown.remove(["script", "style", "noscript"]);

export const htmlConverter: Converter = {
  name: "html",

  async convert(buffer: Buffer, filename: string): Promise<string> {
    const html = buffer.toString("utf-8");

    if (!html.trim()) {
      throw new Error("El archivo HTML está vacío.");
    }

    // Si es un HTML completo, intentamos extraer solo el <body>
    const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    const content = bodyMatch ? bodyMatch[1] : html;

    // Intentamos extraer el <title> para usarlo como H1
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const title =
      titleMatch?.[1].trim() ||
      filename.replace(/\.[^.]+$/, "").replace(/[_-]+/g, " ");

    const markdown = turndown.turndown(content);

    return [
      `# ${title}`,
      "",
      "> Convertido automáticamente desde HTML",
      "",
      markdown,
    ]
      .join("\n\n")
      .replace(/\n{3,}/g, "\n\n");
  },
};
