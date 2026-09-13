import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "kathmaxxing",
    short_name: "kathmaxxing",
    description:
      "Study notes that show their working: number bases, algebra and calculus, with a calculator for each.",
    id: "/",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait-primary",
    background_color: "#eef1f5",
    theme_color: "#eef1f5",
    categories: ["education", "utilities", "productivity"],
    // These become the long-press menu on an installed app's icon.
    shortcuts: [
      { name: "Computer Science", url: "/computer-science" },
      { name: "Algebra", url: "/algebra" },
      { name: "Calculus", url: "/calculus" },
      { name: "Graphing calculator", url: "/calculus/graphing-calculator" },
    ],
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
