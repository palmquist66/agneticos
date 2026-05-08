import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardHeader, CardContent } from "@/components/ui/card"

export default function TrendsLoading() {
  return (
    <div className="mx-auto max-w-lg px-4 py-6">
      <h1 className="text-lg font-semibold">Trends</h1>

      <div className="mt-6 space-y-4">
        {/* Time range selector */}
        <div className="flex gap-2">
          {["7d", "30d", "90d", "6m", "1y"].map((label) => (
            <Skeleton key={label} className="h-8 w-12 rounded-full" />
          ))}
        </div>

        {/* Weight chart */}
        <Card>
          <CardHeader>
            <Skeleton className="h-4 w-24" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-48 w-full rounded-lg" />
          </CardContent>
        </Card>

        {/* Glucose chart */}
        <Card>
          <CardHeader>
            <Skeleton className="h-4 w-28" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-48 w-full rounded-lg" />
          </CardContent>
        </Card>

        {/* Pattern cards */}
        <Card>
          <CardHeader>
            <Skeleton className="h-4 w-20" />
          </CardHeader>
          <CardContent className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start gap-3">
                <Skeleton className="h-8 w-8 shrink-0 rounded-lg" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3.5 w-32" />
                  <Skeleton className="h-3 w-full" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* AI chat */}
        <Card>
          <CardHeader>
            <Skeleton className="h-4 w-36" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-10 w-full rounded-lg" />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
