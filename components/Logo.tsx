// Logo placeholder — substituir pelo SVG oficial (emblema circular dourado
// com veleiro, casco vinho, estrela e moldura douradas) assim que o cliente
// enviar o arquivo real. Mantém a paleta oficial (vinho/dourado) para não
// destoar visualmente até a troca.
export function Logo({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      role="img"
      aria-label="América Nativa"
    >
      <circle cx="32" cy="32" r="30" fill="#F7F3EE" stroke="#C8A24B" strokeWidth="3" />
      <circle cx="32" cy="32" r="25" fill="none" stroke="#C8A24B" strokeWidth="1" />
      <path
        d="M32 14 L34 30 L32 30 L30 30 Z"
        fill="#5B0F1E"
      />
      <path
        d="M32 18 L44 34 C 38 38, 26 38, 20 34 Z"
        fill="#5B0F1E"
      />
      <path d="M18 40 H46 L41 46 H23 Z" fill="#5B0F1E" />
      <path
        d="M32 8 L33.4 11 L36.6 11.3 L34.1 13.4 L34.9 16.6 L32 14.9 L29.1 16.6 L29.9 13.4 L27.4 11.3 L30.6 11 Z"
        fill="#C8A24B"
      />
    </svg>
  );
}
