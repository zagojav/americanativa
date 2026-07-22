import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { siteConfig } from "@/lib/site-config";
import { linkWhatsappGeral } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Contato",
  description: "Fale com a América Nativa por WhatsApp, e-mail ou formulário.",
};

export default function ContatoPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="font-display text-4xl text-vinho">Contato</h1>
      <p className="mt-2 text-vinho/70">
        Fale com a gente — respondemos rápido pelo WhatsApp.
      </p>

      <a
        href={linkWhatsappGeral()}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 inline-flex items-center gap-2 rounded-md bg-vinho px-6 py-3 font-medium text-creme transition-colors hover:bg-dourado hover:text-vinho"
      >
        Falar no WhatsApp
      </a>

      <p className="mt-4 text-sm text-vinho/60">
        Ou envie um e-mail para{" "}
        <a href={`mailto:${siteConfig.email}`} className="underline underline-offset-4">
          {siteConfig.email}
        </a>
      </p>

      <div className="mt-12">
        <h2 className="font-display text-2xl text-vinho">Ou envie uma mensagem</h2>
        <div className="mt-6">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
