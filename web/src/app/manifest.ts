import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "AdmiAmigo 360",
    short_name: "AdmiAmigo",
    description:
      "App residencial para administración, residentes, pagos, reservas y comunicación comunitaria.",
    start_url: "/login",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#0a0612",
    theme_color: "#0a0612",
    lang: "es-CO",
    categories: ["finance", "business", "productivity"],
    icons: [
      {
        src: "/icon?size=192",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icon?size=512",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
