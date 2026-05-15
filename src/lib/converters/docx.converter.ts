import mammoth from "mammoth";
import TurndownService from "turndown";
import type { Converter } from "./types";

/**
 * Conversor de DOCX → Markdown.
 *
 * Estrategia (la mejor para preservar estructura):
 *  1. mammoth convierte DOCX → HTML semántico (h1..h6, ul, ol, p, strong, em, table, etc).
 *  2. turndown convierte ese HTML → Markdown.
 *
 * Esta cadena es más robusta que el "convertToMarkdown" experimental de mammoth
 * porque turndown nos da control fino sobre las reglas de conversión.
 */

// Configuramos turndown una sola vez (instancia singleton)
const turndown = new TurndownService({
  headingStyle: "atx",        // # H1, ## H2, etc.
  bulletListMarker: "-",       // listas con guiones
  codeBlockStyle: "fenced",    // ``` en lugar de indentación
  emDelimiter: "_",            // _énfasis_
  strongDelimiter: "**",       // **negrita**
});

// Mejoramos el manejo de tablas (turndown las soporta como GFM)
turndown.addRule("strikethrough", {
  filter: ["del", "s"],
  replacement: (content) => `~~${content}~~`,
});

export const docxConverter: Converter = {
  name: "docx",

  async convert(buffer: Buffer, filename: string): Promise<string> {
    try {
      // Paso 1: DOCX → HTML con mapeo de estilos
      const { value: html, messages } = await mammoth.convertToHtml(
        { buffer },
        {
          // Mapeo de estilos: ayuda a mammoth a identificar encabezados
          styleMap: [
            "p[style-name='Title'] => h1:fresh",
            "p[style-name='Subtitle'] => h2:fresh",
            "p[style-name='Heading 1'] => h1:fresh",
            "p[style-name='Heading 2'] => h2:fresh",
            "p[style-name='Heading 3'] => h3:fresh",
            "p[style-name='Heading 4'] => h4:fresh",
          ],
        }
      );

      if (!html.trim()) {
        throw new Error("El documento parece estar vacío.");
      }

      // Paso 2: HTML → Markdown
      const markdown = turndown.turndown(html);

      // Título a partir del nombre de archivo
      const title = filename.replace(/\.[^.]+$/, "").replace(/[_-]+/g, " ");

      // Si mammoth emitió warnings, los anotamos sutilmente (útil en debugging)
      const warnings = messages
        .filter((m) => m.type === "warning")
        .slice(0, 3) // máximo 3 para no abrumar
        .map((m) => `<!-- ${m.message} -->`)
        .join("\n");

      return [
        `# ${title}`,
        "",
        "> Convertido automáticamente desde Word",
        "",
        warnings,
        markdown,
      ]
        .filter(Boolean)
        .join("\n\n")
        .replace(/\n{3,}/g, "\n\n"); // limpiamos espacios excesivos
    } catch (error) {
      if (error instanceof Error && error.message.includes("vacío")) {
        throw error;
      }
      throw new Error(
        "No pude leer el documento Word. Asegúrate de que sea un .docx válido (no .doc antiguo)."
      );
    }
  },
};
