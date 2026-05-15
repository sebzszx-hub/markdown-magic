"use client";

import { FileText, X } from "lucide-react";
import { formatBytes } from "@/lib/utils";

interface FilePreviewProps {
  file: File;
  onRemove: () => void;
  disabled?: boolean;
}

export function FilePreview({ file, onRemove, disabled }: FilePreviewProps) {
  const extension = file.name.split(".").pop()?.toUpperCase() || "FILE";

  return (
    <div className="glass-card rounded-3xl p-6 animate-scale-in flex items-center gap-4">
      {/* Icono con badge */}
      <div className="relative flex-shrink-0">
        <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-indigo-soft to-indigo-warm flex items-center justify-center shadow-soft">
          <FileText className="h-7 w-7 text-white" strokeWidth={1.5} />
        </div>
        <span className="absolute -bottom-1 -right-1 bg-coral-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md">
          {extension}
        </span>
      </div>

      {/* Info del archivo */}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-ink-900 truncate">{file.name}</p>
        <p className="text-sm text-ink-500">{formatBytes(file.size)}</p>
      </div>

      {/* Quitar */}
      <button
        type="button"
        onClick={onRemove}
        disabled={disabled}
        aria-label="Quitar archivo"
        className="p-2 rounded-full text-ink-500 hover:text-coral-600 hover:bg-coral-400/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  );
}
