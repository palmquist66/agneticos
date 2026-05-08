import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export default function ProfileLoading() {
  return (
    <div className="mx-auto max-w-lg px-4 py-6">
      <h1 className="text-lg font-semibold">Profile</h1>

      <div className="mt-6 space-y-4">
        {/* Profile info card */}
        <Card>
          <CardHeader>
            <Skeleton className="h-4 w-20" />
          </CardHeader>
          <CardContent className="space-y-2.5">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Name</span>
              <Skeleton className="h-4 w-28" />
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">GLP-1</span>
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Dosage</span>
              <Skeleton className="h-4 w-16" />
            </div>
          </CardContent>
        </Card>

        {/* Health targets card */}
        <Card>
          <CardHeader>
            <Skeleton className="h-4 w-28" />
          </CardHeader>
          <CardContent className="space-y-2.5">
            {["Goal weight", "Protein target", "Glucose min", "Glucose max"].map(
              (label) => (
                <div key={label} className="flex justify-between">
                  <span className="text-sm text-muted-foreground">{label}</span>
                  <Skeleton className="h-4 w-16" />
                </div>
              )
            )}
          </CardContent>
        </Card>

        {/* Notification toggle */}
        <Card>
          <CardContent className="flex items-center justify-between pt-4">
            <div className="space-y-1">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-3 w-48" />
            </div>
            <Skeleton className="h-6 w-11 rounded-full" />
          </CardContent>
        </Card>

        {/* Data sources card */}
        <Card>
          <CardHeader>
            <Skeleton className="h-4 w-28" />
          </CardHeader>
          <CardContent className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-lg" />
                <div className="flex-1 space-y-1">
                  <Skeleton className="h-3.5 w-20" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Doctor export card */}
        <Card>
          <CardHeader>
            <CardTitle>Doctor Export</CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className="mb-3 h-3 w-full" />
            <Skeleton className="h-9 w-40 rounded-lg" />
          </CardContent>
        </Card>

        {/* Theme toggle */}
        <Card>
          <CardContent className="flex items-center justify-between pt-4">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-8 w-24 rounded-lg" />
          </CardContent>
        </Card>

        {/* Account card */}
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-8 rounded-full" />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
