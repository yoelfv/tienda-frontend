export default function SafeImage({ src, alt, fallback = "/placeholder.jpg" }) {
  const [error, setError] = useState(false);
  
  return (
    <img 
      src={error ? fallback : src}
      alt={alt}
      onError={() => setError(true)}
    />
  );
}