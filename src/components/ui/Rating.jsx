import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

export default function Rating({ value = 0, count, size = 14, showValue = true, className = "" }) {
  const stars = Array.from({ length: 5 }, (_, i) => {
    const diff = value - i;
    if (diff >= 0.75) return <FaStar key={i} />;
    if (diff >= 0.25) return <FaStarHalfAlt key={i} />;
    return <FaRegStar key={i} />;
  });
  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <span className="flex text-marigold" style={{ fontSize: size }} role="img" aria-label={`Rated ${value} out of 5`}>{stars}</span>
      {showValue && (
        <span className="text-sm text-ink-soft">
          {value ? value.toFixed(1) : null}
          {count > 0 && <span className="text-muted"> ({count})</span>}
        </span>
      )}
    </div>
  );
}
