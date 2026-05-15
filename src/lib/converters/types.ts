/**
 * Contrato común que cumple cada conversor.
 *
 * Strategy Pattern: cada formato implementa esta interfaz y se registra
 * en converters/index.ts. Para agregar un formato nuevo:
 *   1. Crear src/lib/converters/xxx.converter.ts implementando Converter.
 *   2. Registrarlo en src/lib/converters/index.ts.
 *   3. Listo. Ni el frontend ni el endpoint necesitan cambios.
 */
export interface Converter {
  /** Identificador legible del conversor (para logs y errores). */
  name: string;

  /**
   * Recibe el buffer del archivo y devuelve una cadena Markdown limpia.
   * Debe lanzar un Error con mensaje legible si la conversión falla.
   */
  convert(buffer: Buffer, filename: string): Promise<string>;
}
