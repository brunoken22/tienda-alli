export function EsqueletonProduct() {
  return (
    <div className="bg-card border rounded-xl overflow-hidden shadow-sm animate-pulse">
      <div className="aspect-square bg-muted" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-muted rounded w-3/4" />
        <div className="h-3 bg-muted rounded w-1/2" />
        <div className="flex items-center justify-between">
          <div className="h-5 bg-muted rounded w-1/3" />
          <div className="h-8 bg-muted rounded w-20" />
        </div>
      </div>
    </div>
  )
}
