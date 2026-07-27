import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Fotos de produto enviadas pelo painel /admin/produtos ficam no
    // Cloudinary, sempre nesse host, independente do "cloud name" da conta.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

export default nextConfig;
