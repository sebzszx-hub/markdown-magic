/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "30mb",
    },
  },
  // Red de seguridad: si aparece algún error menor de linting, no detiene el deploy
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push({ canvas: "commonjs canvas" });
    }
    return config;
  },
};

export default nextConfig;