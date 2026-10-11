/* eslint-disable @next/next/no-img-element */

export function Crest({ src, name, size = 40 }: { src: string | null; name: string; size?: number }) {
  if (!src) {
    return (
      <div
        className="grid place-items-center rounded-full bg-deep border border-line text-muted font-bold"
        style={{ width: size, height: size, fontSize: size * 0.35 }}
      >
        {name.slice(0, 2)}
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={name}
      width={size}
      height={size}
      loading="lazy"
      className="object-contain drop-shadow"
      style={{ width: size, height: size }}
    />
  );
}
