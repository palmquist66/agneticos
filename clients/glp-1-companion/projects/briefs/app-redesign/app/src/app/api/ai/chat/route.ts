import { auth } from "@clerk/nextjs/server";
import Anthropic from "@anthropic-ai/sdk";
import { getCurrentUser } from "@/lib/auth";
import { getAIContextData } from "@/lib/trends-queries";

function getAnthropicClient() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY is not set");
  return new Anthropic({ apiKey });
}

function buildSystemPrompt(context: Awaited<ReturnType<typeof getAIContextData>>): string {
  const { weights, glucoses, foods, meds, sideEffects, user } = context;

  const lines: string[] = [
    "You are a helpful health data assistant for someone on a GLP-1 medication journey. You have access to their recent health data (last 14 days).",
    "",
    "IMPORTANT: You are NOT a doctor. Always remind users to consult their healthcare provider for medical decisions. Keep responses concise and mobile-friendly (2-3 short paragraphs max).",
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
    lines.push("## Recent Weights");
    for (const w of weights.slice(0, 14)) {
      lines.push(`- ${w.loggedAt.toLocaleDateString()}: ${w.weight} lbs`);
    }
    lines.push("");
  }

  if (glucoses.length > 0) {
    lines.push("## Recent Glucose Readings");
    for (const g of glucoses.slice(0, 20)) {
      lines.push(`- ${g.loggedAt.toLocaleDateString()} ${g.loggedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}: ${g.value} mg/dL${g.context ? ` (${g.context.replace(/_/g, " ")})` : ""}`);
    }
    lines.push("");
  }

  if (foods.length > 0) {
    lines.push("## Recent Food Logs");
    for (const f of foods.slice(0, 20)) {
      const parts = [f.name];
      if (f.calories) parts.push(`${f.calories} cal`);
      if (f.protein) parts.push(`${f.protein}g protein`);
      lines.push(`- ${f.loggedAt.toLocaleDateString()}: ${parts.join(", ")}`);
    }
    lines.push("");
  }

  if (meds.length > 0) {
    lines.push("## Recent Medications");
    for (const m of meds.slice(0, 10)) {
      lines.push(`- ${m.loggedAt.toLocaleDateString()}: ${m.medName} ${m.dosage}`);
    }
    lines.push("");
  }

  if (sideEffects.length > 0) {
    lines.push("## Recent Side Effects");
    for (const s of sideEffects.slice(0, 10)) {
      lines.push(`- ${s.loggedAt.toLocaleDateString()}: ${s.symptom.replace(/_/g, " ")} (${s.severity})`);
    }
    lines.push("");
  }

  if (weights.length === 0 && glucoses.length === 0 && foods.length === 0) {
    lines.push("The user has no logged data in the last 14 days. Encourage them to start logging.");
  }

  return lines.join("\n");
}

export async function POST(request: Request) {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await getCurrentUser();
  const body = await request.json();
  const { messages } = body as {
    messages: { role: "user" | "assistant"; content: string }[];
  };

  if (!messages?.length) {
    return Response.json({ error: "Messages required" }, { status: 400 });
  }

  const context = await getAIContextData(user.id);
  const systemPrompt = buildSystemPrompt(context);

  const anthropic = getAnthropicClient();
  const stream = anthropic.messages.stream({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1024,
    system: systemPrompt,
    messages: messages.slice(-10), // Keep last 10 messages for context
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
        console.error("AI chat stream error:", error);
        const errData = JSON.stringify({ text: "\n\nSorry, an error occurred." });
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
