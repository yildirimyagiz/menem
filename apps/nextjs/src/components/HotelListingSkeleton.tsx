import { Skeleton } from "@acme/ui/skeleton";

const HotelPropertySkeleton = () => {
  return (
    <div className="container">
      <div className="mb-8">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="mt-4 h-4 w-1/4" />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="aspect-w-4 aspect-h-3 w-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HotelPropertySkeleton;
