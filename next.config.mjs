/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Permite hasta 25 MB en server actions / route handlers (cubre nuestro límite de archivo)
    serverActions: {
      bodySizeLimit: "30mb",
    },
  },
  // pdf-parse referencia archivos de test al cargar; los excluimos del bundle del servidor
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push({ canvas: "commonjs canvas" });
    }
    return config;
  },
};

export default nextConfig;
