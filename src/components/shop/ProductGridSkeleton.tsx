const DEFAULT_SKELETON_CARDS = 6;

export default function ProductGridSkeleton() {
  return (
    <div className="products-grid">
      {Array.from({ length: DEFAULT_SKELETON_CARDS }).map((_, index) => (
        <div className="card skeleton-card" key={index}>
          <div className="skeleton skeleton-image" />

          <div className="card-body">
            <div className="skeleton skeleton-title" />

            <div className="skeleton skeleton-price" />

            <div className="skeleton skeleton-line" />
            <div className="skeleton skeleton-line short" />

            <div className="skeleton skeleton-stock" />

            <div className="skeleton skeleton-button" />
          </div>
        </div>
      ))}
    </div>
  );
}
