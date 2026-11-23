export function Stars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-1 text-sm text-amber-500" aria-label={`Rated ${rating} out of 5`}>
      {'★★★★★'.slice(0, Math.round(rating))}
      <span className="text-slate-300">{'★★★★★'.slice(Math.round(rating))}</span>
      <span className="ml-1 text-xs text-slate-500">{rating.toFixed(1)}</span>
    </span>
  );
}
