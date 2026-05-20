import { auth } from "@clerk/nextjs/server";
import Anthropic from "@anthropic-ai/sdk";
import { getCurrentUser } from "@/lib/auth";
import { getAIContextData } from "@/lib/trends-queries";

function getAnthropicClient() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY is not set");
  return new Anthropic({ apiKey });
}

function buildAnalysisPrompt(context: Awaited<ReturnType<typeof getAIContextData>>): string {
  const { weights, glucoses, foods, meds, sideEffects, user } = context;

  const lines: string[] = [
    "You are a health data analyst. Generate a comprehensive analysis of this user's GLP-1 medication journey based on their data.",
    "",
    "Structure your response with these sections:",
    "## Weight Trend",
    "## Glucose Management",
    "## Nutrition",
    "## Medication & Side Effects",
    "## Key Recommendations",
    "",
    "Keep each section to 2-3 sentences. Be specific — reference actual numbers from the data. If a section has no data, skip it.",
    "",
    "IMPORTANT: You are NOT a doctor. Frame recommendations as observations and suggestions to discuss with their healthcare provider.",
    "",
  ];

  if (user) {
    lines.push("## User Profile");
    if (user.glp1Med) lines.push(`- Medication: ${user.glp1Med} ${user.glp1Dosage || ""}`);
    if (user.goalWeight) lines.push(`- Goal weight: ${user.goalWeight} lbs`);
    if (user.proteinTarget) lines.push(`- Protein target: ${user.proteinTarget}g/day`);
    if (user.glucoseMin && user.glucoseMax) lines.push(`- Glucose target: ${user.glucoseMin}-${user.glucoseMax} mg/dL`);
    lines.push("");
  }

  if (weights.length > 0) {
    lines.push("## Weight Data (last 14 days)");
    for (const w of weights) {
      lines.push(`- ${w.loggedAt.toLocaleDateString()}: ${w.weight} lbs`);
    }
    lines.push("");
  }

  if (glucoses.length > 0) {
    lines.push("## Glucose Data (last 14 days)");
    for (const g of glucoses) {
      lines.push(`- ${g.loggedAt.toLocaleDateString()} ${g.loggedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}: ${g.value} mg/dL${g.context ? ` (${g.context.replace(/_/g, " ")})` : ""}`);
    }
    lines.push("");
  }

  if (foods.length > 0) {
    lines.push("## Food Logs (last 14 days)");
    for (const f of foods) {
      const parts = [f.name];
      if (f.calories) parts.push(`${f.calories} cal`);
      if (f.protein) parts.push(`${f.protein}g protein`);
      if (f.carbs) parts.push(`${f.carbs}g carbs`);
      if (f.fat) parts.push(`${f.fat}g fat`);
      lines.push(`- ${f.loggedAt.toLocaleDateString()}: ${parts.join(", ")}`);
    }
    lines.push("");
  }

  if (meds.length > 0) {
    lines.push("## Medication Logs (last 14 days)");
    for (const m of meds) {
      lines.push(`- ${m.loggedAt.toLocaleDateString()}: ${m.medName} ${m.dosage}`);
    }
    lines.push("");
  }

  if (sideEffects.length > 0) {
    lines.push("## Side Effects (last 14 days)");
    for (const s of sideEffects) {
      lines.push(`- ${s.loggedAt.toLocaleDateString()}: ${s.symptom.replace(/_/g, " ")} (${s.severity})`);
    }
    lines.push("");
  }

  if (weights.length === 0 && glucoses.length === 0 && foods.length === 0) {
    lines.push("The user has no logged data. Encourage them to start logging weight, food, and glucose readings.");
  }

  return lines.join("\n");
}

export async function POST() {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await getCurrentUser();
  const context = await getAIContextData(user.id);
  const prompt = buildAnalysisPrompt(context);

  const anthropic = getAnthropicClient();
  const stream = anthropic.messages.stream({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 2048,
    system: prompt,
    messages: [
      {
        role: "user",
        content: "Please analyze all my health data and give me a comprehensive report.",
      },
    ],
  });

  const readable = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();

      try {
        for await (const event of stream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            const data = JSON.stringify({ text: event.delta.text });
            controller.enqueue(encoder.encode(`data: ${data}\n\n`));
          }
        }
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      } catch (error) {
        console.error("Deep analysis stream error:", error);
        const errData = JSON.stringify({ text: "\n\nSorry, an error occurred during analysis." });
        controller.enqueue(encoder.encode(`data: ${errData}\n\n`));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
