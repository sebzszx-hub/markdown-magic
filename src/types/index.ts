/**
 * Máquina de estados de la aplicación.
 * Usamos un discriminated union para que TypeScript nos obligue
 * a manejar cada caso y solo nos deje acceder a los datos disponibles.
 */
export type AppState =
  | { status: "idle" }
  | { status: "file-selected"; file: File }
  | { status: "processing"; file: File }
  | { status: "success"; file: File; markdown: string }
  | { status: "error"; file: File | null; message: string };

/**
 * Respuesta del endpoint /api/convert.
 */
export interface ConversionResponse {
  success: boolean;
  markdown?: string;
  error?: string;
}
