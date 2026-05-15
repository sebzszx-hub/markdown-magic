"use client";

import { useState } from "react";
import { Download, CheckCircle2, RotateCcw, Eye, EyeOff, Copy, Check } from "lucide-react";
import { downloadMarkdown } from "@/lib/utils";
import { toast } from "sonner";

interface DownloadButtonProps {
  markdown: string;
  filename: string;
  onReset: () => void;
}

export function DownloadButton({
  markdown,
  filename,
  onReset,
}: DownloadButtonProps) {
  const [showPreview, setShowPreview] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleDownload = () => {
    downloadMarkdown(markdown, filename);
    toast.success("¡Descarga iniciada!", {
      description: "Disfruta tu nuevo Markdown ✨",
    });
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
      toast.success("Markdown copiado al portapapeles");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("No pude copiar al portapapeles");
    }
  };

  return (
    <div className="glass-card rounded-3xl p-8 animate-scale-in flex flex-col items-center text-center">
      <div className="mb-4 rounded-full bg-emerald-100 p-3">
        <CheckCircle2 className="h-10 w-10 text-emerald-600" strokeWidth={1.5} />
      </div>

      <h3 className="text-xl font-semibold text-ink-900 mb-1">
        ¡Listo! Tu Markdown está preparado ✨
      </h3>
      <p className="text-sm text-ink-500 mb-6">
        Descárgalo, cópialo o revisa una vista previa.
      </p>

      {/* Botones principales */}
      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto mb-3">
        <button
          onClick={handleDownload}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-indigo-warm text-white font-medium hover:bg-indigo-600 active:scale-[0.98] transition-all shadow-soft hover:shadow-soft-lg"
        >
          <Download className="h-5 w-5" />
          Descargar .md
        </button>

        <button
          onClick={handleCopy}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-white text-ink-700 font-medium border border-indigo-100 hover:bg-indigo-50 active:scale-[0.98] transition-all"
        >
          {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
          {copied ? "¡Copiado!" : "Copiar texto"}
        </button>

        <button
          onClick={onReset}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-white text-ink-700 font-medium border border-indigo-100 hover:bg-indigo-50 active:scale-[0.98] transition-all"
        >
          <RotateCcw className="h-4 w-4" />
          Otro
        </button>
      </div>

      {/* Toggle preview */}
      <button
        onClick={() => setShowPreview((s) => !s)}
        className="inline-flex items-center gap-2 text-sm text-ink-500 hover:text-indigo-warm transition-colors mt-2"
      >
        {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        {showPreview ? "Ocultar vista previa" : "Ver vista previa"}
      </button>

      {/* Preview del Markdown */}
      {showPreview && (
        <div className="mt-4 w-full animate-fade-in">
          <pre className="text-left text-xs bg-white/80 border border-indigo-100 rounded-2xl p-4 max-h-80 overflow-auto whitespace-pre-wrap font-mono text-ink-700">
            {markdown}
          </pre>
        </div>
      )}
    </div>
  );
}
