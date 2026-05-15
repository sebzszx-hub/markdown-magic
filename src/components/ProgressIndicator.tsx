"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { PROCESSING_MESSAGES } from "@/lib/constants";

/**
 * Indicador de progreso con mensajes rotativos.
 * El mensaje cambia cada 1.8 segundos para dar sensación de avance real.
 */
export function ProgressIndicator() {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % PROCESSING_MESSAGES.length);
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-card rounded-3xl p-8 animate-fade-in flex flex-col items-center text-center">
      <div className="relative mb-4">
        <div className="absolute inset-0 rounded-full bg-indigo-warm/20 animate-pulse-soft" />
        <Loader2 className="h-12 w-12 text-indigo-warm animate-spin relative" />
      </div>

      <p
        key={messageIndex}
        className="text-lg font-medium text-ink-900 animate-fade-in"
      >
        {PROCESSING_MESSAGES[messageIndex]}
      </p>

      <p className="text-sm text-ink-500 mt-2">
        Esto suele tomar entre 2 y 10 segundos
      </p>
    </div>
  );
}
