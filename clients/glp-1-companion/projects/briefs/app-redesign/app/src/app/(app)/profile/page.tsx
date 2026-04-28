import { UserButton } from "@clerk/nextjs";

export default function ProfilePage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-6">
      <h1 className="text-lg font-semibold">Profile</h1>

      <div className="mt-6 space-y-4">
        {/* Your Info */}
        <div className="rounded-xl border p-4">
          <h2 className="text-sm font-medium">Your Info</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Name, GLP-1 medication, dosage, and other meds.
          </p>
        </div>

        {/* Health Targets */}
        <div className="rounded-xl border p-4">
          <h2 className="text-sm font-medium">Health Targets</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Glucose range, weight goal, protein target.
          </p>
        </div>

        {/* Connected Data Sources */}
        <div className="rounded-xl border p-4">
          <h2 className="text-sm font-medium">Connected Data Sources</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Connect Dexcom, Google Fit, or Apple Health to auto-import your
            data.
          </p>
        </div>

        {/* Doctor Export */}
        <div className="rounded-xl border p-4">
          <h2 className="text-sm font-medium">Doctor Export</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Generate a PDF report to share with your healthcare provider.
          </p>
        </div>

        {/* Account */}
        <div className="rounded-xl border p-4">
          <h2 className="text-sm font-medium">Account</h2>
          <div className="mt-2">
            <UserButton />
          </div>
        </div>
      </div>
    </div>
  );
}
