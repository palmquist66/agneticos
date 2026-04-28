export default async function MedicationDetailPage(
  props: PageProps<"/meds/[id]">
) {
  const { id } = await props.params;

  return (
    <div className="mx-auto max-w-lg px-4 py-6">
      <h1 className="text-lg font-semibold">Medication Detail</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Detail view for medication {id}. Coming in Phase 5.
      </p>
    </div>
  );
}
