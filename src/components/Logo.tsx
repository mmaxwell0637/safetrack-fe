 {/*
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
  } <img
      src={src}
      alt={alt}
      width={size}
      height={size}
      className={`${rounded ? "rounded-xl" : ""} object-contain ${className}`}
      style={{ width: size, height: size }}
    />
    
    

    
  );
}
  */}

      //Lets try mines - u can always delete mines and use yours above
export default function Logo({ size = 28, className = "" }: { size?: number; className?: string }) {
  return (
    <div
      className={className}
      style={{
        width: size,
        height: size,
        background: 'linear-gradient(135deg, #2563EB 0%, #1E40AF 100%)',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontWeight: 700,
        fontSize: size * 0.5,
      }}
    >
      ST
    </div>
  );
}