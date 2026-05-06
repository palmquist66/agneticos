"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import type { ActivityEntry } from "@/lib/today-queries";
import { ActivityItem } from "./activity-item";
import { EntryEditSheet } from "./entry-edit-sheet";

export function RecentActivity({ entries }: { entries: ActivityEntry[] }) {
  const [editingEntry, setEditingEntry] = useState<ActivityEntry | null>(null);

  if (entries.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center py-6 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
              <Plus className="h-5 w-5 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground">
              Nothing logged yet today.
              <br />
              Tap <strong>+</strong> to log your first entry.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="-mx-2">
          {entries.map((entry) => (
            <ActivityItem
              key={`${entry.type}-${entry.id}`}
              entry={entry}
              onTap={setEditingEntry}
            />
          ))}
        </CardContent>
      </Card>

      <EntryEditSheet
        entry={editingEntry}
        onClose={() => setEditingEntry(null)}
      />
    </>
  );
}
