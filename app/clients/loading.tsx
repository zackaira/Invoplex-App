import { Skeleton } from "@/components/ui/skeleton";

export default function ClientsLoading() {
  return (
    <div className="group document-list clients">
      <div>
        {/* Toolbar Section */}
        <div className="flex justify-between items-center gap-4 p-6">
          {/* Search Input */}
          <div className="flex flex-1 items-center gap-2">
            <Skeleton className="h-10 w-full max-w-sm" />
          </div>

          {/* View Options */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-10 w-32" />
          </div>
        </div>

        {/* Data Table */}
        <div>
          {/* Table Header */}
          <div className="border-b">
            <div className="grid grid-cols-[auto_1fr_280px_220px_140px_auto] gap-4 p-4">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-8" />
            </div>
          </div>

          {/* Table Rows */}
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="grid grid-cols-[auto_1fr_280px_220px_140px_auto] gap-4 p-4 border-b last:border-b-0"
            >
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-full max-w-xs" />
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-8" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
