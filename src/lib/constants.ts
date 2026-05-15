// Tamaño máximo permitido (25 MB)
export const MAX_FILE_SIZE = 25 * 1024 * 1024;

// Tipos MIME aceptados → extensiones (consumido por react-dropzone)
export const ACCEPTED_FILE_TYPES = {
  "application/pdf": [".pdf"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
    ".docx",
  ],
  "application/json": [".json"],
  "text/plain": [".txt"],
  "text/html": [".html", ".htm"],
  "text/markdown": [".md"],
} as const;

// Extensiones legibles para mostrar como tags
export const SUPPORTED_FORMATS = ["PDF", "DOCX", "JSON", "TXT", "HTML"];

// Mensajes rotativos durante el procesamiento (el toque mágico)
export const PROCESSING_MESSAGES = [
  "✨ Despertando a los duendes conversores...",
  "🪄 Transformando bytes en magia...",
  "📝 Puliendo cada línea con cariño...",
  "🎨 Dándole forma a tu Markdown...",
  "⏳ Casi listo, dale unos segundos más...",
  "🌟 Añadiendo los toques finales...",
];
