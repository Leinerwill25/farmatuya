import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FarmaTuya - Tu Salud y Bienestar",
  description: "Tu farmacia retail de confianza para la compra online de medicamentos y productos de cuidado personal en Venezuela.",
};

export const viewport = {
  colorScheme: 'light',
  themeColor: '#0F3D93',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${inter.variable} h-full antialiased font-sans overflow-x-hidden`}
      style={{ colorScheme: 'light' }}
    >
      <body className="min-h-full flex flex-col overflow-x-hidden">
        {children}
        {/* Botón flotante de WhatsApp movido a la página principal */}
      </body>
    </html>
  );
}
