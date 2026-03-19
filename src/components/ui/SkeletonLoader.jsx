export function SkeletonLoader({ className = "", shape = "rect" }) {
  const shapes = {
    rect: "rounded-xl",
    circle: "rounded-full",
    text: "rounded h-4 w-full",
  };

  return (
    <div
      className={`animate-pulse bg-zinc-800 ${shapes[shape]} ${className}`}
    />
  );
}

export function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <SkeletonLoader shape="circle" className="w-20 h-20" />
        <div className="space-y-2 flex-1">
          <SkeletonLoader className="h-6 w-1/3" />
          <SkeletonLoader className="h-4 w-1/4" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SkeletonLoader className="h-24 w-full" />
        <SkeletonLoader className="h-24 w-full" />
      </div>
      <SkeletonLoader className="h-40 w-full" />
    </div>
  );
}
