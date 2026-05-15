import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MarkdownMagic ✨ — Convierte cualquier archivo a Markdown",
  description:
    "Herramienta amigable y privada para convertir PDF, Word, JSON y más a Markdown. Sin registro, sin estrés.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={inter.variable}>
      <body>
        {children}
        {/* Toasts amigables estilo macOS */}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              borderRadius: "16px",
              border: "1px solid rgba(255,255,255,0.6)",
              background: "rgba(255,255,255,0.85)",
              backdropFilter: "blur(12px)",
            },
          }}
        />
      </body>
    </html>
  );
}
