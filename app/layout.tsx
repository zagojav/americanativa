import type { Metadata } from "next";
import { Playfair_Display, Instrument_Sans } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppFloatButton } from "@/components/WhatsAppFloatButton";
import { CartProvider } from "@/components/CartContext";
import { siteConfig } from "@/lib/site-config";
import { getCategoriasComContagem } from "@/lib/produtos";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    default: `${siteConfig.nomeMarca} · ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.nomeMarca}`,
  },
  description: siteConfig.descricaoCurta,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const categorias = await getCategoriasComContagem();

  return (
    <html
      lang="pt-BR"
      className={`${playfair.variable} ${instrumentSans.variable} h-full`}
    >
      <body className="flex min-h-full flex-col bg-creme font-sans antialiased">
        <CartProvider>
          <Header categorias={categorias} />
          <main className="flex-1">{children}</main>
          <Footer />
          <WhatsAppFloatButton />
        </CartProvider>
      </body>
    </html>
  );
}
