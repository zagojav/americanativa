"use client";

import Link from "next/link";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

export type BannerSlide = {
  desktopSrc: string;
  mobileSrc: string;
  alt: string;
  href?: string;
};

export function BannerCarousel({ slides }: { slides: BannerSlide[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [ativo, setAtivo] = useState(0);
  const [pausado, setPausado] = useState(false);

  const irPara = useCallback((indice: number) => {
    const track = trackRef.current;
    const slide = track?.children[indice] as HTMLElement | undefined;
    slide?.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
  }, []);

  useEffect(() => {
    if (pausado || slides.length <= 1) return;
    const id = setInterval(() => {
      setAtivo((atual) => {
        const proximo = (atual + 1) % slides.length;
        irPara(proximo);
        return proximo;
      });
    }, 5000);
    return () => clearInterval(id);
  }, [pausado, slides.length, irPara]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let frame: number;
    function aoRolar() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (!track || track.clientWidth === 0) return;
        const indice = Math.round(track.scrollLeft / track.clientWidth);
        setAtivo((atual) => (atual === indice ? atual : indice));
      });
    }
    track.addEventListener("scroll", aoRolar, { passive: true });
    return () => {
      track.removeEventListener("scroll", aoRolar);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      className="group relative w-full overflow-hidden"
      onMouseEnter={() => setPausado(true)}
      onMouseLeave={() => setPausado(false)}
      onTouchStart={() => setPausado(true)}
      onTouchEnd={() => setPausado(false)}
    >
      <div
        ref={trackRef}
        className="flex w-full snap-x snap-mandatory overflow-x-auto scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {slides.map((slide, indice) => {
          const conteudo = (
            <>
              <Image
                src={slide.desktopSrc}
                alt={slide.alt}
                fill
                sizes="100vw"
                priority={indice === 0}
                className="hidden object-cover md:block"
              />
              <Image
                src={slide.mobileSrc}
                alt={slide.alt}
                fill
                sizes="100vw"
                priority={indice === 0}
                className="block object-cover md:hidden"
              />
            </>
          );
          return (
            <div
              key={slide.alt + indice}
              className="relative aspect-[1136/1385] w-full flex-none snap-start md:aspect-[1829/860]"
            >
              {slide.href ? (
                <Link href={slide.href} className="block h-full w-full">
                  {conteudo}
                </Link>
              ) : (
                <div className="h-full w-full">{conteudo}</div>
              )}
            </div>
          );
        })}
      </div>

      {slides.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Banner anterior"
            onClick={() => irPara((ativo - 1 + slides.length) % slides.length)}
            className="absolute left-2 top-1/2 hidden -translate-y-1/2 rounded-full bg-creme/80 px-3 py-2 text-lg text-vinho opacity-0 transition-opacity duration-300 group-hover:opacity-100 sm:flex"
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Próximo banner"
            onClick={() => irPara((ativo + 1) % slides.length)}
            className="absolute right-2 top-1/2 hidden -translate-y-1/2 rounded-full bg-creme/80 px-3 py-2 text-lg text-vinho opacity-0 transition-opacity duration-300 group-hover:opacity-100 sm:flex"
          >
            ›
          </button>

          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
            {slides.map((_, indice) => (
              <button
                key={indice}
                type="button"
                aria-label={`Ir para o banner ${indice + 1}`}
                onClick={() => irPara(indice)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  indice === ativo ? "w-6 bg-dourado" : "w-2 bg-creme/70"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
