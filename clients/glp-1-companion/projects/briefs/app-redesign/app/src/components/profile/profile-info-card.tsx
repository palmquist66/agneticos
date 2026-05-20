"use client";

import { useActionState, useState, useEffect } from "react";
import { toast } from "sonner";
import { Pencil, X, Check } from "lucide-react";
import { updateUserInfo } from "@/app/(app)/profile/actions";
import { Card, CardHeader, CardTitle, CardContent, CardAction } from "@/components/ui/card";

interface ProfileInfoCardProps {
  name: string | null;
  glp1Med: string | null;
  glp1Dosage: string | null;
  otherMeds: string[];
}

const GLP1_MEDICATIONS = [
  "Ozempic",
  "Wegovy",
  "Mounjaro",
  "Zepbound",
  "Saxenda",
  "Victoza",
  "Trulicity",
  "Rybelsus",
];

const COMMON_DOSAGES: Record<string, string[]> = {
  Ozempic: ["0.25mg", "0.5mg", "1mg", "2mg"],
  Wegovy: ["0.25mg", "0.5mg", "1mg", "1.7mg", "2.4mg"],
  Mounjaro: ["2.5mg", "5mg", "7.5mg", "10mg", "12.5mg", "15mg"],
  Zepbound: ["2.5mg", "5mg", "7.5mg", "10mg", "12.5mg", "15mg"],
  Saxenda: ["0.6mg", "1.2mg", "1.8mg", "2.4mg", "3mg"],
  Victoza: ["0.6mg", "1.2mg", "1.8mg"],
  Trulicity: ["0.75mg", "1.5mg", "3mg", "4.5mg"],
  Rybelsus: ["3mg", "7mg", "14mg"],
};

export function ProfileInfoCard({ name, glp1Med, glp1Dosage, otherMeds }: ProfileInfoCardProps) {
  const [editing, setEditing] = useState(false);
  const [localName, setLocalName] = useState(name || "");
  const [localMed, setLocalMed] = useState(glp1Med || "");
  const [localDosage, setLocalDosage] = useState(glp1Dosage || "");
  const [localOtherMeds, setLocalOtherMeds] = useState(otherMeds.join(", "));

  const [state, action, pending] = useActionState(updateUserInfo, { success: false });

  useEffect(() => {
    if (state.success) {
      toast.success("Profile updated");
      setEditing(false);
    } else if (state.error) {
      toast.error(state.error);
    }
  }, [state]);

  const dosages = COMMON_DOSAGES[localMed] || [];

  if (!editing) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Info</CardTitle>
          <CardAction>
            <button
              onClick={() => setEditing(true)}
              className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <Pencil className="h-4 w-4" />
            </button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Name</dt>
              <dd>{name || "Not set"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">GLP-1 Medication</dt>
              <dd>{glp1Med || "Not set"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Current Dosage</dt>
              <dd>{glp1Dosage || "Not set"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Other Medications</dt>
              <dd className="text-right">{otherMeds.length > 0 ? otherMeds.join(", ") : "None"}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Info</CardTitle>
        <CardAction>
          <button
            onClick={() => {
              setEditing(false);
              setLocalName(name || "");
              setLocalMed(glp1Med || "");
              setLocalDosage(glp1Dosage || "");
              setLocalOtherMeds(otherMeds.join(", "));
            }}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <form action={action} className="space-y-3">
          <input type="hidden" name="name" value={localName} />
          <input type="hidden" name="glp1Med" value={localMed} />
          <input type="hidden" name="glp1Dosage" value={localDosage} />
          <input type="hidden" name="otherMeds" value={localOtherMeds} />

          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Name</label>
            <input
              type="text"
              value={localName}
              onChange={(e) => setLocalName(e.target.value)}
              className="w-full rounded-lg border bg-card px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
              placeholder="Your name"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">GLP-1 Medication</label>
            <select
              value={localMed}
              onChange={(e) => {
                setLocalMed(e.target.value);
                setLocalDosage("");
              }}
              className="w-full rounded-lg border bg-card px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="">Select medication...</option>
              {GLP1_MEDICATIONS.map((med) => (
                <option key={med} value={med}>{med}</option>
              ))}
            </select>
          </div>

          {localMed && (
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Current Dosage</label>
              <select
                value={localDosage}
                onChange={(e) => setLocalDosage(e.target.value)}
                className="w-full rounded-lg border bg-card px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="">Select dosage...</option>
                {dosages.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">
              Other Medications (comma-separated)
            </label>
            <input
              type="text"
              value={localOtherMeds}
              onChange={(e) => setLocalOtherMeds(e.target.value)}
              className="w-full rounded-lg border bg-card px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
              placeholder="e.g. Metformin 500mg, Vitamin D"
            />
          </div>

          <button
            type="submit"
            disabled={pending}
            className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            <Check className="h-4 w-4" />
            {pending ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </CardContent>
    </Card>
  );
}
