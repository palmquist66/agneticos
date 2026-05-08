import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function MedDetailLoading() {
  return (
    <div className="mx-auto max-w-lg px-4 py-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/meds"
          className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-5 rounded" />
          <Skeleton className="h-5 w-32" />
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {/* Details card */}
        <Card>
          <CardHeader>
            <Skeleton className="h-4 w-16" />
          </CardHeader>
          <CardContent className="space-y-3">
            {["Dosage", "Frequency", "Times"].map((label) => (
              <div key={label} className="flex justify-between">
                <span className="text-sm text-muted-foreground">{label}</span>
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Adherence card */}
        <Card>
          <CardHeader>
            <CardTitle>Adherence</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Rate bar */}
            <div>
              <div className="mb-1 flex justify-between text-sm">
                <span className="text-muted-foreground">Adherence rate</span>
                <Skeleton className="h-4 w-10" />
              </div>
              <Skeleton className="h-2 w-full rounded-full" />
            </div>

            {/* 3-col counts */}
            <div className="grid grid-cols-3 gap-2 text-center">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-lg bg-muted p-2">
                  <Skeleton className="mx-auto h-6 w-8" />
                  <Skeleton className="mx-auto mt-1 h-3 w-10" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent history */}
        <Card>
          <CardHeader>
            <CardTitle>Recent History</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-3 text-sm">
                <Skeleton className="h-3.5 w-3.5 rounded-full" />
                <Skeleton className="h-3.5 w-16 flex-1" />
                <Skeleton className="h-3 w-24" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
