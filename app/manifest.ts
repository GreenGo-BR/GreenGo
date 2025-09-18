import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "GreenGo - Reciclagem de Latinhas",
    short_name: "GreenGo",
    description:
      "Conectando pessoas que desejam vender latinhas de alumínio com a equipe de coleta",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#10b981",
    icons: [
      {
        src: "images/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "images/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
