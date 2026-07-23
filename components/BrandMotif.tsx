export function BrandMotif({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full text-dourado ${className}`}
      style={{ opacity: 0.05 }}
      viewBox="0 0 800 600"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <pattern
          id="america-nativa-linhas-diagonais"
          width="60"
          height="60"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(35)"
        >
          <line x1="0" y1="0" x2="0" y2="60" stroke="currentColor" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="800" height="600" fill="url(#america-nativa-linhas-diagonais)" />
      <g transform="translate(640 120)" stroke="currentColor" fill="none" strokeWidth="1.5">
        <circle r="70" />
        <circle r="45" />
        <path d="M0 -70 L8 -20 L0 0 L-8 -20 Z" fill="currentColor" stroke="none" />
        <path d="M0 70 L8 20 L0 0 L-8 20 Z" fill="currentColor" stroke="none" />
        <path d="M-70 0 L-20 -8 L0 0 L-20 8 Z" fill="currentColor" stroke="none" />
        <path d="M70 0 L20 -8 L0 0 L20 8 Z" fill="currentColor" stroke="none" />
        <path d="M-49 -49 L-14 -20 L0 0 L-20 -14 Z" fill="currentColor" stroke="none" opacity="0.7" />
        <path d="M49 49 L14 20 L0 0 L20 14 Z" fill="currentColor" stroke="none" opacity="0.7" />
        <path d="M-49 49 L-14 20 L0 0 L-20 14 Z" fill="currentColor" stroke="none" opacity="0.7" />
        <path d="M49 -49 L14 -20 L0 0 L20 -14 Z" fill="currentColor" stroke="none" opacity="0.7" />
      </g>
    </svg>
  );
}
