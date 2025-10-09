type Props = {
  size?: number;           // pixel size (height = width)
  rounded?: boolean;       // keep rounded chip look
  alt?: string;
  className?: string;
};

export default function Logo({ size = 28, rounded = true, alt = "SafeTrack", className = "" }: Props) {
  // Vite will bundle this asset automatically
  const src = new URL("../assets/st-logo.png", import.meta.url).href;

  return (
    <img
      src={src}
      alt={alt}
      width={size}
      height={size}
      className={`${rounded ? "rounded-xl" : ""} object-contain ${className}`}
      style={{ width: size, height: size }}
    />
  );
}