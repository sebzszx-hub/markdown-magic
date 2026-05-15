// Declaración de tipos para pdf-parse
// La librería no incluye sus propios tipos, así que se los damos nosotros.

declare module "pdf-parse/lib/pdf-parse.js" {
    interface PDFParseResult {
        numpages: number;
        numrender: number;
        info: Record<string, unknown>;
        metadata: Record<string, unknown> | null;
        text: string;
        version: string;
    }

    function pdfParse(
        dataBuffer: Buffer,
        options?: Record<string, unknown>
    ): Promise<PDFParseResult>;

    export default pdfParse;
}

declare module "pdf-parse" {
    export * from "pdf-parse/lib/pdf-parse.js";
    export { default } from "pdf-parse/lib/pdf-parse.js";
}