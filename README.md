# MarkdownMagic ✨

Herramienta universal y amigable para convertir cualquier archivo a Markdown limpio.

Soporta **PDF, DOCX, JSON, TXT y HTML** de forma nativa, con una arquitectura
diseñada para que añadir nuevos formatos sea trivial.

---

## 🚀 Cómo correrlo

```bash
# 1. Instala dependencias
npm install

# 2. Levanta el servidor de desarrollo
npm run dev

# 3. Abre http://localhost:3000
```

Para producción:

```bash
npm run build
npm run start
```

---

## 🧱 Stack

- **Next.js 14** (App Router) — Framework full-stack
- **TypeScript** — Tipos en todos lados
- **TailwindCSS** — Estilos utility-first
- **react-dropzone** — Drag & drop accesible
- **sonner** — Toasts elegantes
- **lucide-react** — Iconos
- **pdf-parse** — PDF → texto
- **mammoth** — DOCX → HTML
- **turndown** — HTML → Markdown

---

## 📁 Arquitectura

```
src/
├── app/
│   ├── layout.tsx           # Layout raíz (fuentes, toaster)
│   ├── page.tsx             # Página principal (máquina de estados)
│   ├── globals.css          # Estilos globales
│   └── api/convert/
│       └── route.ts         # POST /api/convert
│
├── components/              # Componentes React
│   ├── DropZone.tsx
│   ├── FilePreview.tsx
│   ├── ProgressIndicator.tsx
│   └── DownloadButton.tsx
│
├── lib/
│   ├── constants.ts
│   ├── utils.ts
│   └── converters/          # 🎯 Strategy Pattern
│       ├── types.ts         # Interfaz Converter
│       ├── pdf.converter.ts
│       ├── docx.converter.ts
│       ├── json.converter.ts
│       ├── txt.converter.ts
│       ├── html.converter.ts
│       └── index.ts         # Registry
│
└── types/
    └── index.ts             # Tipos compartidos
```

---

## ➕ Cómo agregar un formato nuevo

La arquitectura usa **Strategy Pattern**, así que es muy sencillo. Ejemplo:
agregar soporte para CSV.

1. **Crea el conversor** en `src/lib/converters/csv.converter.ts`:

```ts
import type { Converter } from "./types";

export const csvConverter: Converter = {
  name: "csv",
  async convert(buffer, filename) {
    const text = buffer.toString("utf-8");
    const rows = text.trim().split("\n").map((line) => line.split(","));
    const [header, ...data] = rows;

    const headerRow = `| ${header.join(" | ")} |`;
    const separator = `| ${header.map(() => "---").join(" | ")} |`;
    const body = data.map((r) => `| ${r.join(" | ")} |`).join("\n");

    return `# ${filename}\n\n${headerRow}\n${separator}\n${body}`;
  },
};
```

2. **Regístralo** en `src/lib/converters/index.ts`:

```ts
import { csvConverter } from "./csv.converter";

const byMimeType = {
  // ...
  "text/csv": csvConverter,
};

const byExtension = {
  // ...
  csv: csvConverter,
};
```

3. **Añade el MIME type** a `src/lib/constants.ts`:

```ts
export const ACCEPTED_FILE_TYPES = {
  // ...
  "text/csv": [".csv"],
};

export const SUPPORTED_FORMATS = ["PDF", "DOCX", "JSON", "TXT", "HTML", "CSV"];
```

¡Listo! Sin tocar componentes, página, ni endpoint.

---

## 🔒 Privacidad

Los archivos se procesan en memoria del servidor y **nunca se guardan en
disco**. La función serverless termina su ciclo de vida después de cada
request y el buffer se libera.

---

## 📦 Despliegue

Diseñado para Vercel. Un solo clic:

```bash
vercel
```

O conecta el repo de Git directamente desde el dashboard de Vercel.

---

Hecho con cariño 💜
# markdown-magic  
