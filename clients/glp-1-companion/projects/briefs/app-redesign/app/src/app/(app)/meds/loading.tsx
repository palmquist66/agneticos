import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardHeader, CardContent } from "@/components/ui/card"

export default function MedsLoading() {
  return (
    <div className="mx-auto max-w-lg px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">Medications</h1>
        <Skeleton className="h-9 w-9 rounded-lg" />
      </div>

      <div className="mt-6 space-y-4">
        {/* Medication cards */}
        {[1, 2].map((i) => (
          <Card key={i}>
            <CardContent className="flex items-center gap-3 pt-4">
              <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-3 w-20" />
              </div>
              <Skeleton className="h-6 w-16 rounded-full" />
            </CardContent>
          </Card>
        ))}

        {/* Titration timeline */}
        <Card>
          <CardHeader>
            <Skeleton className="h-4 w-36" />
          </CardHeader>
          <CardContent className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-4 w-4 rounded-full" />
                <div className="flex-1 space-y-1">
                  <Skeleton className="h-3.5 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Injection site grid */}
        <Card>
          <CardHeader>
            <Skeleton className="h-4 w-28" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="flex flex-col items-center gap-1.5">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <Skeleton className="h-3 w-14" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
