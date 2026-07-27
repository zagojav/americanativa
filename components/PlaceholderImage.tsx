import { Logo } from "./Logo";

/**
 * Placeholder visual para fotos ainda não enviadas pelo cliente.
 * Deliberadamente não gera imagens fotorrealistas de produtos reais
 * (regra do projeto: nunca fabricar fotos de produtos de terceiros como
 * Horneados Únicos ou fornecedores de hortifruti).
 */
export function PlaceholderImage({
  label,
  className = "",
}: {
  label: string;
  className?: string;
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-2 bg-vinho/5 border border-dourado/30 text-vinho/70 ${className}`}
    >
      <Logo className="h-10 w-10 opacity-40" />
      <span className="text-xs uppercase tracking-wide text-center px-4">
        Foto pendente: {label}
      </span>
    </div>
  );
}
