import Link from "next/link";
import { Logo } from "./Logo";
import { siteConfig } from "@/lib/site-config";
import { linkWhatsappGeral } from "@/lib/whatsapp";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-dourado/30 bg-vinho text-creme">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <Logo className="h-9 w-9" />
            <span className="font-display text-lg">América Nativa</span>
          </div>
          <p className="mt-3 text-sm text-creme/70">{siteConfig.tagline}</p>
        </div>

        <div>
          <h4 className="font-display text-sm uppercase tracking-wide text-dourado">
            Institucional
          </h4>
          <ul className="mt-3 space-y-2 text-sm text-creme/80">
            <li><Link href="/quem-somos" className="hover:text-dourado">Quem Somos</Link></li>
            <li><Link href="/franquia" className="hover:text-dourado">Franquia</Link></li>
            <li><Link href="/distribuicao/horneados-unicos" className="hover:text-dourado">Horneados Únicos</Link></li>
            <li><Link href="/contato" className="hover:text-dourado">Contato</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-sm uppercase tracking-wide text-dourado">
            Catálogo
          </h4>
          <ul className="mt-3 space-y-2 text-sm text-creme/80">
            <li><Link href="/produtos" className="hover:text-dourado">Todos os produtos</Link></li>
            <li><Link href="/produtos/bebidas" className="hover:text-dourado">Bebidas</Link></li>
            <li><Link href="/produtos/vestuario" className="hover:text-dourado">Vestuário</Link></li>
            <li><Link href="/produtos/meis-de-abelhas-nativas" className="hover:text-dourado">Méis de Abelhas Nativas</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-sm uppercase tracking-wide text-dourado">
            Contato
          </h4>
          <ul className="mt-3 space-y-2 text-sm text-creme/80">
            <li>
              <a href={linkWhatsappGeral()} target="_blank" rel="noopener noreferrer" className="hover:text-dourado">
                WhatsApp
              </a>
            </li>
            <li>
              <a href={`mailto:${siteConfig.email}`} className="hover:text-dourado">
                {siteConfig.email}
              </a>
            </li>
            <li>
              <a href={siteConfig.redesSociais.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-dourado">
                Instagram
              </a>
            </li>
            <li>
              <a href={siteConfig.redesSociais.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-dourado">
                Facebook
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-creme/10 px-4 py-4 text-center text-xs text-creme/60">
        © {new Date().getFullYear()} América Nativa LTDA — by AS Market. Todos os direitos reservados.
      </div>
    </footer>
  );
}
