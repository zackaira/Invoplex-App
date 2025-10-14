import { Skeleton } from "@/components/ui/skeleton";

export default function QuotePageLoading() {
  return (
    <>
      <div className="bg-accent px-6 pt-12 pb-5">
        <div className="max-w-[960px] mx-auto flex justify-between items-center">
          <Skeleton className="h-10 w-28 bg-gray-200" />
          <Skeleton className="h-10 w-28 bg-gray-200" />
        </div>
      </div>

      <div className="bg-accent pb-12">
        <div className="bg-white border border-border p-8 mx-auto max-w-[960px] shadow-xl/30 rounded-xs">
          {/* Header Section */}
          <div className="border-b pb-6">
            {/* Logo and Title Row */}
            <div className="flex justify-between items-center mb-16">
              <Skeleton className="w-32 h-32 rounded-lg bg-gray-200" />
              <div className="text-right space-y-2">
                <Skeleton className="h-10 w-32 ml-auto bg-gray-200" />
                <Skeleton className="h-6 w-24 ml-auto bg-gray-200" />
                <Skeleton className="h-8 w-40 ml-auto mt-2 bg-gray-200" />
              </div>
            </div>

            {/* From and To Grid */}
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-2">
                <Skeleton className="h-4 w-12 bg-gray-200" />
                <Skeleton className="h-5 w-40 bg-gray-200" />
                <Skeleton className="h-4 w-32 bg-gray-200" />
                <Skeleton className="h-4 w-28 bg-gray-200" />
                <Skeleton className="h-4 w-36 bg-gray-200" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-16 bg-gray-200" />
                <Skeleton className="h-5 w-36 bg-gray-200" />
                <Skeleton className="h-4 w-32 bg-gray-200" />
                <Skeleton className="h-4 w-28 bg-gray-200" />
                <Skeleton className="h-4 w-36 bg-gray-200" />
              </div>
            </div>

            {/* Dates Section */}
            <div className="grid grid-cols-2 gap-8 mt-6">
              <div className="space-y-1">
                <Skeleton className="h-4 w-20 bg-gray-200" />
                <Skeleton className="h-5 w-28 bg-gray-200" />
              </div>
              <div className="space-y-1">
                <Skeleton className="h-4 w-20 bg-gray-200" />
                <Skeleton className="h-5 w-28 bg-gray-200" />
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="border border-gray-200 rounded-md my-8">
            {/* Table Header */}
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
              <div className="grid grid-cols-[1fr_5fr_1.4fr_1.5fr_auto] gap-4">
                <Skeleton className="h-4 w-8 bg-gray-200" />
                <Skeleton className="h-4 w-20 bg-gray-200" />
                <Skeleton className="h-4 w-16 bg-gray-200" />
                <Skeleton className="h-4 w-12 bg-gray-200" />
                <Skeleton className="h-4 w-12 bg-gray-200" />
              </div>
            </div>
            {/* Table Rows */}
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="px-4 py-3 bg-white border-b border-gray-200 last:border-b-0"
              >
                <div className="grid grid-cols-[1fr_5fr_1.4fr_1.5fr_auto] gap-4">
                  <Skeleton className="h-5 w-8 bg-gray-200" />
                  <Skeleton className="h-5 w-full bg-gray-200" />
                  <Skeleton className="h-5 w-16 bg-gray-200" />
                  <Skeleton className="h-5 w-20 bg-gray-200" />
                  <Skeleton className="h-5 w-20 bg-gray-200" />
                </div>
              </div>
            ))}
          </div>

          {/* Totals Section */}
          <div className="flex justify-between items-end mb-10">
            <Skeleton className="h-12 w-40 bg-gray-200" />
            <div className="w-full max-w-xs space-y-2">
              <div className="flex justify-between">
                <Skeleton className="h-5 w-16 bg-gray-200" />
                <Skeleton className="h-5 w-24 bg-gray-200" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-5 w-12 bg-gray-200" />
                <Skeleton className="h-5 w-20 bg-gray-200" />
              </div>
              <div className="h-px bg-gray-200 my-2" />
              <div className="flex justify-between">
                <Skeleton className="h-6 w-16 bg-gray-200" />
                <Skeleton className="h-6 w-28 bg-gray-200" />
              </div>
            </div>
          </div>

          {/* Notes Section */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-12 bg-gray-200" />
            <Skeleton className="h-16 w-full bg-gray-200" />
          </div>

          {/* Footer */}
          <div className="mt-10 pt-6 border-t">
            <Skeleton className="h-4 w-64 mx-auto bg-gray-200" />
          </div>
        </div>
      </div>
    </>
  );
}
