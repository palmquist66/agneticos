import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import type { Pattern } from "@/lib/types/trends";

type Props = {
  pattern?: Pattern | null;
};

export function PatternSpotlight({ pattern }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-[#4DB6AC]" />
          Pattern Spotlight
        </CardTitle>
      </CardHeader>
      <CardContent>
        {pattern ? (
          <div>
            <p className="text-sm font-medium">{pattern.title}</p>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {pattern.summary}
            </p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Keep logging &mdash; patterns appear after 7+ days of data.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
