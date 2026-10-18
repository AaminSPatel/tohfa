import Rating from "@/components/ui/Rating";

export default function ReviewSection({ product, reviews }) {
  return (
    <section aria-labelledby="reviews-heading" className="border-t border-line py-14 sm:py-20">
      <div className="container-page grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <h2 id="reviews-heading" className="text-display-md">What people say</h2>
          {product.reviewCount > 0 && (
            <div className="mt-4">
              <p className="font-display text-5xl">{product.rating.toFixed(1)}</p>
              <Rating value={product.rating} showValue={false} size={18} className="mt-2" />
              <p className="mt-2 text-sm text-muted">Based on {product.reviewCount} reviews</p>
            </div>
          )}
        </div>
        <div className="lg:col-span-8">
          {reviews.length ? (
            <ul className="divide-y divide-line">
              {reviews.map((r) => (
                <li key={r.id} className="py-6 first:pt-0">
                  <Rating value={r.rating} showValue={false} />
                  <p className="mt-3 max-w-prose text-lead text-ink">{r.text}</p>
                  <p className="mt-3 text-sm text-muted">{r.name}, {r.city}{r.occasion ? `. ${r.occasion}` : ""}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-ink-soft">No written reviews yet. Bought this? Tell us how it went on WhatsApp and we'll add it here.</p>
          )}
        </div>
      </div>
    </section>
  );
}
