import type { Converter } from "./types";

/**
 * Conversor de JSON → Markdown.
 *
 * Estrategia:
 *  - Parseamos el JSON y recorremos su estructura recursivamente.
 *  - Objetos a nivel raíz: cada clave se vuelve un encabezado (H2).
 *  - Objetos anidados: se renderizan como listas con sub-bullets.
 *  - Arrays de objetos homogéneos: se renderizan como TABLAS Markdown.
 *  - Arrays de primitivos: lista con guiones.
 *  - Primitivos: valor en línea.
 *
 * Esta heurística produce un Markdown legible para humanos a partir de
 * casi cualquier JSON razonable.
 */
export const jsonConverter: Converter = {
  name: "json",

  async convert(buffer: Buffer, filename: string): Promise<string> {
    let parsed: unknown;
    try {
      parsed = JSON.parse(buffer.toString("utf-8"));
    } catch {
      throw new Error(
        "El archivo no contiene JSON válido. Revisa la sintaxis (comillas, comas, llaves)."
      );
    }

    const title = filename.replace(/\.[^.]+$/, "").replace(/[_-]+/g, " ");

    const body = renderValue(parsed, 0);

    return [
      `# ${title}`,
      "",
      "> Convertido automáticamente desde JSON",
      "",
      body,
    ].join("\n\n");
  },
};

// --- Helpers internos -------------------------------------------------------

/**
 * Renderiza cualquier valor JSON al nivel de indentación indicado.
 * Para el nivel raíz (depth 0), los objetos se expanden con encabezados.
 */
function renderValue(value: unknown, depth: number): string {
  if (value === null) return "_null_";
  if (typeof value === "string") return escapeMd(value);
  if (typeof value === "number" || typeof value === "boolean")
    return `\`${value}\``;

  if (Array.isArray(value)) {
    return renderArray(value, depth);
  }

  if (typeof value === "object") {
    return renderObject(value as Record<string, unknown>, depth);
  }

  return String(value);
}

function renderObject(
  obj: Record<string, unknown>,
  depth: number
): string {
  const entries = Object.entries(obj);
  if (entries.length === 0) return "_(objeto vacío)_";

  // En el nivel raíz: cada clave se vuelve un H2
  if (depth === 0) {
    return entries
      .map(([key, val]) => {
        const heading = `## ${formatKey(key)}`;
        const content = renderValue(val, depth + 1);
        // Si el contenido es una sola línea inline, lo ponemos al lado;
        // si es estructurado (listas, tablas), debajo.
        return isInline(val)
          ? `${heading}\n\n${content}`
          : `${heading}\n\n${content}`;
      })
      .join("\n\n");
  }

  // En niveles internos: lista con sub-items
  return entries
    .map(([key, val]) => {
      const indent = "  ".repeat(depth - 1);
      if (isInline(val)) {
        return `${indent}- **${formatKey(key)}:** ${renderValue(val, depth + 1)}`;
      }
      return `${indent}- **${formatKey(key)}:**\n${renderValue(val, depth + 1)}`;
    })
    .join("\n");
}

function renderArray(arr: unknown[], depth: number): string {
  if (arr.length === 0) return "_(lista vacía)_";

  // Detectamos si es un array de objetos homogéneos → tabla
  if (isHomogeneousObjectArray(arr)) {
    return renderTable(arr as Record<string, unknown>[]);
  }

  // Array de primitivos o mixto → lista
  const indent = "  ".repeat(Math.max(0, depth - 1));
  return arr
    .map((item) => {
      if (isInline(item)) {
        return `${indent}- ${renderValue(item, depth + 1)}`;
      }
      return `${indent}- \n${renderValue(item, depth + 1)}`;
    })
    .join("\n");
}

/**
 * Renderiza un array de objetos homogéneos como tabla Markdown.
 */
function renderTable(rows: Record<string, unknown>[]): string {
  const columns = Array.from(
    new Set(rows.flatMap((row) => Object.keys(row)))
  );

  const header = `| ${columns.map(formatKey).join(" | ")} |`;
  const separator = `| ${columns.map(() => "---").join(" | ")} |`;
  const body = rows
    .map((row) => {
      const cells = columns.map((col) => {
        const value = row[col];
        if (value === undefined || value === null) return "";
        if (typeof value === "object") return "_(objeto)_";
        return String(value).replace(/\|/g, "\\|").replace(/\n/g, " ");
      });
      return `| ${cells.join(" | ")} |`;
    })
    .join("\n");

  return [header, separator, body].join("\n");
}

/** ¿El valor se puede mostrar en una sola línea? */
function isInline(value: unknown): boolean {
  if (value === null) return true;
  const t = typeof value;
  return t === "string" || t === "number" || t === "boolean";
}

/** ¿Array de objetos planos con estructuras compatibles para una tabla? */
function isHomogeneousObjectArray(arr: unknown[]): boolean {
  if (arr.length === 0) return false;
  return arr.every(
    (item) =>
      typeof item === "object" &&
      item !== null &&
      !Array.isArray(item) &&
      Object.values(item).every((v) => isInline(v))
  );
}

/** Formatea claves como "user_name" → "User name" */
function formatKey(key: string): string {
  return key
    .replace(/[_-]+/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/^./, (c) => c.toUpperCase());
}

/** Escapa caracteres especiales de Markdown en strings */
function escapeMd(str: string): string {
  return str.replace(/([\\`*_{}[\]()#+\-.!])/g, "\\$1");
}
