"use client";

import { useCallback } from "react";
import { useDropzone, type FileRejection } from "react-dropzone";
import { UploadCloud, FileText, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  ACCEPTED_FILE_TYPES,
  MAX_FILE_SIZE,
  SUPPORTED_FORMATS,
} from "@/lib/constants";

interface DropZoneProps {
  onFileAccepted: (file: File) => void;
  disabled?: boolean;
}

export function DropZone({ onFileAccepted, disabled }: DropZoneProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      if (rejectedFiles.length > 0) {
        const reason = rejectedFiles[0].errors[0];
        if (reason.code === "file-too-large") {
          toast.error("Archivo demasiado grande", {
            description: "El máximo es 25 MB. ¿Quizás puedes dividirlo?",
          });
        } else if (reason.code === "file-invalid-type") {
          toast.error("Formato no soportado", {
            description: `Por ahora aceptamos: ${SUPPORTED_FORMATS.join(", ")}`,
          });
        } else {
          toast.error("Ups, algo salió mal con el archivo");
        }
        return;
      }
      if (acceptedFiles[0]) {
        onFileAccepted(acceptedFiles[0]);
      }
    },
    [onFileAccepted]
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop,
      accept: ACCEPTED_FILE_TYPES,
      maxSize: MAX_FILE_SIZE,
      multiple: false,
      disabled,
    });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "relative w-full cursor-pointer rounded-4xl border-2 border-dashed",
        "bg-white/50 backdrop-blur-sm transition-all duration-300",
        "px-8 py-16 sm:py-20",
        "flex flex-col items-center justify-center text-center",
        "border-indigo-200 hover:border-indigo-warm hover:bg-white/70",
        isDragActive &&
          !isDragReject &&
          "border-indigo-warm bg-indigo-50/70 scale-[1.01] shadow-soft-lg",
        isDragReject && "border-coral-500 bg-coral-400/10",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      <input {...getInputProps()} />

      {/* Icono central */}
      <div
        className={cn(
          "mb-6 rounded-full p-5 transition-all duration-300",
          "bg-gradient-to-br from-indigo-100 to-coral-400/20",
          isDragActive && "animate-soft-bounce"
        )}
      >
        {isDragActive ? (
          <Sparkles className="h-12 w-12 text-indigo-warm" strokeWidth={1.5} />
        ) : (
          <UploadCloud
            className="h-12 w-12 text-indigo-warm"
            strokeWidth={1.5}
          />
        )}
      </div>

      <h3 className="text-2xl font-semibold text-ink-900 mb-2">
        {isDragActive
          ? "¡Suéltalo aquí, yo me encargo! 🎉"
          : "Arrastra tu archivo aquí"}
      </h3>

      <p className="text-ink-500 text-base mb-6 max-w-md">
        {isDragActive
          ? "Estoy listo para transformarlo en Markdown."
          : "O haz clic para seleccionar uno desde tu dispositivo."}
      </p>

      {/* Tags de formatos */}
      <div className="flex flex-wrap gap-2 justify-center">
        {SUPPORTED_FORMATS.map((format) => (
          <span
            key={format}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/80 border border-indigo-100 text-xs font-medium text-ink-700"
          >
            <FileText className="h-3 w-3" />
            {format}
          </span>
        ))}
      </div>

      <p className="mt-6 text-xs text-ink-500">
        Tamaño máximo: 25 MB · Tu archivo nunca se guarda 🔒
      </p>
    </div>
  );
}
