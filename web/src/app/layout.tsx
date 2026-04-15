import type { Metadata, Viewport } from "next";

import "./globals.css";

const appUrl =
  process.env.NEXT_PUBLIC_APP_URL?.trim() || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: "AdmiAmigo 360",
    template: "%s | AdmiAmigo 360",
  },
  description:
    "Aplicación mobile-first para gestión residencial, cartera, reservas y comunicación comunitaria de AdmiAmigo 360.",
  applicationName: "AdmiAmigo 360",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "AdmiAmigo 360",
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    url: appUrl,
    title: "AdmiAmigo 360",
    description:
      "App residencial mobile-first para administración, residentes, pagos, reservas y reportes.",
    siteName: "AdmiAmigo 360",
  },
  twitter: {
    card: "summary_large_image",
    title: "AdmiAmigo 360",
    description:
      "App residencial mobile-first para administración, residentes, pagos, reservas y reportes.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#fdfbf8",
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
