import Image from "next/image";

export function Logo({
  className = "h-10 w-10",
  priority = false,
}: {
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src="/brand/logo-emblema.png"
      alt="América Nativa"
      width={96}
      height={96}
      className={`${className} object-contain`}
      priority={priority}
    />
  );
}
