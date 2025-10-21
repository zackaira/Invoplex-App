import { Skeleton } from "@/components/ui/skeleton";

export default function InvoicesLoading() {
  return (
    <div className="group document-list invoices">
      <div>
        {/* Toolbar Section */}
        <div className="flex justify-between items-center gap-4 p-6">
          {/* Search Input */}
          <div className="flex flex-1 items-center gap-2">
            <Skeleton className="h-10 w-full max-w-sm" />
            <Skeleton className="h-10 w-28" />
          </div>

          {/* Status Filter and View Options */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-10 w-32" />
          </div>
        </div>

        {/* Data Table */}
        <div>
          {/* Table Header */}
          <div className="border-b">
            <div className="grid grid-cols-[auto_1fr_auto_auto_auto_auto] gap-4 p-4">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>

          {/* Table Rows */}
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="grid grid-cols-[auto_1fr_auto_auto_auto_auto] gap-4 p-4 border-b last:border-b-0"
            >
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-full max-w-xs" />
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-8 w-8" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
