export default function AdminLoading() {
  return (
    <div role="status" aria-label="Loading" className="space-y-4">
      <div className="h-9 w-56 animate-pulse rounded bg-white" />
      <div className="h-64 animate-pulse rounded-lg bg-white" />
    </div>
  );
}
