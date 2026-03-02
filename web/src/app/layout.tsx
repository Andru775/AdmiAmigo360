import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Admi Amigo 360",
  description: "Plataforma inmersiva para administracion de propiedad horizontal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased">{children}</body>
    </html>
  );
}
