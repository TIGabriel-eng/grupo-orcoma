export default function AutoCorrigirImagem({
  src,
  alt,
}: {
  src: string;
  alt: string;
}) {
  return (
    <img
      src={src}
      alt={alt}
      draggable={false}
      className="absolute inset-0 w-full h-full object-cover"
    />
  );
}
