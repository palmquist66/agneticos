import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardHeader, CardContent } from "@/components/ui/card"

export default function TodayLoading() {
  return (
    <div className="mx-auto max-w-lg px-4 py-6">
      <h1 className="text-lg font-semibold">Today</h1>

      <div className="mt-6 space-y-4">
        {/* GLP-1 status card */}
        <Card>
          <CardHeader>
            <Skeleton className="h-4 w-32" />
          </CardHeader>
          <CardContent className="space-y-3">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-2 w-full rounded-full" />
          </CardContent>
        </Card>

        {/* Medication check-in */}
        <Card>
          <CardHeader>
            <Skeleton className="h-4 w-40" />
          </CardHeader>
          <CardContent className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3.5 w-28" />
                  <Skeleton className="h-3 w-20" />
                </div>
                <Skeleton className="h-8 w-16 rounded-lg" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Today's numbers — 3-col grid */}
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-xl bg-card p-3 text-center ring-1 ring-foreground/10"
            >
              <Skeleton className="mx-auto h-3 w-12" />
              <Skeleton className="mx-auto mt-2 h-6 w-10" />
              <Skeleton className="mx-auto mt-1 h-3 w-8" />
            </div>
          ))}
        </div>

        {/* Pattern spotlight */}
        <Card>
          <CardContent className="flex items-start gap-3 pt-4">
            <Skeleton className="h-8 w-8 shrink-0 rounded-lg" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-3 w-full" />
            </div>
          </CardContent>
        </Card>

        {/* Recent activity */}
        <Card>
          <CardHeader>
            <Skeleton className="h-4 w-32" />
          </CardHeader>
          <CardContent className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-6 w-6 rounded-full" />
                <div className="flex-1 space-y-1">
                  <Skeleton className="h-3.5 w-40" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
