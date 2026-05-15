"use client";

import { useState } from "react";
import { Sparkles, Lock, Zap, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { DropZone } from "@/components/DropZone";
import { FilePreview } from "@/components/FilePreview";
import { ProgressIndicator } from "@/components/ProgressIndicator";
import { DownloadButton } from "@/components/DownloadButton";
import type { AppState, ConversionResponse } from "@/types";

export default function HomePage() {
  // Estado único de la app (discriminated union)
  const [state, setState] = useState<AppState>({ status: "idle" });

  // Cuando el usuario suelta un archivo válido en el DropZone
  const handleFileAccepted = (file: File) => {
    setState({ status: "file-selected", file });
  };

  // Reseteo a estado inicial
  const handleReset = () => {
    setState({ status: "idle" });
  };

  /**
   * Envía el archivo al endpoint /api/convert y procesa la respuesta.
   *
   * Flujo:
   *  1. Cambiamos a estado "processing" (esto activa el spinner).
   *  2. Empaquetamos el archivo como FormData (formato estándar para uploads).
   *  3. POST a /api/convert.
   *  4. Si todo bien → estado "success" con el markdown.
   *  5. Si hay error → estado "error" + toast amigable.
   */
  const handleConvert = async () => {
    if (state.status !== "file-selected") return;

    const file = state.file;
    setState({ status: "processing", file });

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/convert", {
        method: "POST",
        body: formData,
      });

      const data: ConversionResponse = await response.json();

      if (!response.ok || !data.success || !data.markdown) {
        throw new Error(data.error || "Conversión fallida");
      }

      setState({ status: "success", file, markdown: data.markdown });
      toast.success("¡Tu Markdown está listo!", {
        description: "Puedes descargarlo o copiarlo al portapapeles.",
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Error inesperado durante la conversión";

      setState({ status: "error", file, message });
      toast.error("No pudimos convertir el archivo", {
        description: message,
      });
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center px-4 py-12 sm:py-20">
      {/* Header */}
      <header className="max-w-2xl text-center mb-12 animate-fade-in">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm border border-indigo-100 text-sm text-ink-700 mb-6">
          <Sparkles className="h-4 w-4 text-coral-500" />
          <span>Convierte cualquier archivo a Markdown</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-bold text-ink-900 mb-4 tracking-tight">
          Markdown<span className="text-indigo-warm">Magic</span>
        </h1>

        <p className="text-lg text-ink-500 leading-relaxed">
          La forma más amigable de transformar tus documentos en Markdown limpio.
          Sin registro, sin esperas eternas, sin estrés.
        </p>
      </header>

      {/* Container principal — máquina de estados */}
      <div className="w-full max-w-2xl space-y-6">
        {/* IDLE */}
        {state.status === "idle" && (
          <DropZone onFileAccepted={handleFileAccepted} />
        )}

        {/* FILE-SELECTED */}
        {state.status === "file-selected" && (
          <>
            <FilePreview file={state.file} onRemove={handleReset} />
            <button
              onClick={handleConvert}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-warm to-coral-500 text-white font-semibold text-lg shadow-soft hover:shadow-soft-lg active:scale-[0.99] transition-all"
            >
              ✨ Convertir a Markdown
            </button>
          </>
        )}

        {/* PROCESSING */}
        {state.status === "processing" && (
          <>
            <FilePreview file={state.file} onRemove={handleReset} disabled />
            <ProgressIndicator />
          </>
        )}

        {/* SUCCESS */}
        {state.status === "success" && (
          <DownloadButton
            markdown={state.markdown}
            filename={state.file.name}
            onReset={handleReset}
          />
        )}

        {/* ERROR */}
        {state.status === "error" && (
          <div className="glass-card rounded-3xl p-8 animate-scale-in flex flex-col items-center text-center">
            <div className="mb-4 rounded-full bg-coral-400/15 p-3">
              <AlertCircle className="h-10 w-10 text-coral-600" strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-semibold text-ink-900 mb-1">
              Ups, algo no salió bien
            </h3>
            <p className="text-sm text-ink-500 mb-6 max-w-md">
              {state.message}
            </p>
            <button
              onClick={handleReset}
              className="px-6 py-3 rounded-2xl bg-indigo-warm text-white font-medium hover:bg-indigo-600 active:scale-[0.98] transition-all shadow-soft"
            >
              Intentar con otro archivo
            </button>
          </div>
        )}
      </div>

      {/* Features section */}
      <section className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl w-full">
        <FeatureCard
          icon={<Lock className="h-5 w-5" />}
          title="100% privado"
          description="Tu archivo se procesa al vuelo y nunca se almacena."
        />
        <FeatureCard
          icon={<Zap className="h-5 w-5" />}
          title="Rápido"
          description="Conversión típica en menos de 10 segundos."
        />
        <FeatureCard
          icon={<Sparkles className="h-5 w-5" />}
          title="Sin registro"
          description="Sin cuentas, sin tarjetas, sin fricción."
        />
      </section>

      <footer className="mt-20 text-center text-sm text-ink-500">
        Hecho con cariño · {new Date().getFullYear()}
      </footer>
    </main>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="glass-card rounded-2xl p-5 text-left">
      <div className="inline-flex p-2 rounded-xl bg-indigo-50 text-indigo-warm mb-3">
        {icon}
      </div>
      <h4 className="font-semibold text-ink-900 mb-1">{title}</h4>
      <p className="text-sm text-ink-500">{description}</p>
    </div>
  );
}
