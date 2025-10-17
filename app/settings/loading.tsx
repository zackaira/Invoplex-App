import { Skeleton } from "@/components/ui/skeleton";

export function SettingsLoading() {
  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Two Column Layout */}
      <div className="flex flex-col gap-6 md:flex-row">
        {/* Settings Cards - Left Side */}
        <div className="flex-1 space-y-8 max-w-[820px] order-2 md:order-1">
          {/* Business Profile Section */}
          <div className="rounded-lg border bg-card p-6 space-y-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-6 w-6 rounded" />
              <Skeleton className="h-6 w-48" />
            </div>
            <Skeleton className="h-4 w-full max-w-md" />
            <div className="space-y-4 pt-4">
              <Skeleton className="h-10 w-full" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
              <Skeleton className="h-10 w-full" />
            </div>
          </div>

          {/* Financial Settings Section */}
          <div className="rounded-lg border bg-card p-6 space-y-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-6 w-6 rounded" />
              <Skeleton className="h-6 w-40" />
            </div>
            <Skeleton className="h-4 w-full max-w-md" />
            <div className="space-y-4 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          </div>

          {/* Brand Settings Section */}
          <div className="rounded-lg border bg-card p-6 space-y-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-6 w-6 rounded" />
              <Skeleton className="h-6 w-44" />
            </div>
            <Skeleton className="h-4 w-full max-w-md" />
            <div className="space-y-4 pt-4">
              <Skeleton className="h-32 w-32 rounded" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>

          {/* Quote Settings Section */}
          <div className="rounded-lg border bg-card p-6 space-y-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-6 w-6 rounded" />
              <Skeleton className="h-6 w-36" />
            </div>
            <Skeleton className="h-4 w-full max-w-md" />
            <div className="space-y-4 pt-4">
              <Skeleton className="h-10 w-full" />
            </div>
          </div>

          {/* Invoice Settings Section */}
          <div className="rounded-lg border bg-card p-6 space-y-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-6 w-6 rounded" />
              <Skeleton className="h-6 w-40" />
            </div>
            <Skeleton className="h-4 w-full max-w-md" />
            <div className="space-y-4 pt-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>

          {/* Template Selection Section */}
          <div className="rounded-lg border bg-card p-6 space-y-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-6 w-6 rounded" />
              <Skeleton className="h-6 w-44" />
            </div>
            <Skeleton className="h-4 w-full max-w-md" />
            <div className="space-y-4 pt-4">
              <Skeleton className="h-48 w-full" />
            </div>
          </div>
        </div>

        {/* Navigation Sidebar - Right Side */}
        <div className="w-64 shrink-0 order-1 md:order-2">
          <div className="sticky top-8 space-y-2">
            <Skeleton className="h-5 w-32 mb-4" />
            <div className="space-y-2">
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-9 w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsLoading;
