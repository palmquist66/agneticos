import { auth } from "@clerk/nextjs/server";
import Anthropic from "@anthropic-ai/sdk";

const SYSTEM_PROMPT = `You are a nutrition analyst. Given a food description or image, estimate the nutritional content.

Respond with ONLY valid JSON in this exact format:
{
  "name": "short food name",
  "calories": number,
  "protein": number,
  "carbs": number,
  "fat": number,
  "confidence": "high" | "medium" | "low",
  "totalServings": number | null
}

Rules:
- calories is total kcal
- protein, carbs, fat are in grams
- For recipe mode, estimate total recipe nutrition and totalServings
- For meal mode, estimate single serving and set totalServings to null
- If you can't identify the food, set confidence to "low" and make your best guess
- Always return valid numbers, never null for nutrition values`;

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { image, text, mode } = body as {
    image?: string;
    text?: string;
    mode: "meal" | "recipe";
  };

  if (!image && !text) {
    return Response.json(
      { error: "Provide an image or text description" },
      { status: 400 }
    );
  }

  const userPrompt =
    mode === "recipe"
      ? `Analyze this recipe and estimate TOTAL nutrition for the entire recipe. Also estimate how many servings this makes.\n\n${text || "See image."}`
      : `Analyze this meal and estimate nutrition for a single serving.\n\n${text || "See image."}`;

  const content: Anthropic.Messages.ContentBlockParam[] = [];

  if (image) {
    // Expect base64 data URI like "data:image/jpeg;base64,..."
    const match = image.match(/^data:(image\/\w+);base64,(.+)$/);
    if (match) {
      content.push({
        type: "image",
        source: {
          type: "base64",
          media_type: match[1] as
            | "image/jpeg"
            | "image/png"
            | "image/gif"
            | "image/webp",
          data: match[2],
        },
      });
    }
  }

  content.push({ type: "text", text: userPrompt });

  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      console.error("ANTHROPIC_API_KEY is not set in environment");
      return Response.json(
        { error: "AI service not configured" },
        { status: 500 }
      );
    }
    const anthropic = new Anthropic({ apiKey });

    const response = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 512,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content }],
    });

    const textBlock = response.content.find((b) => b.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      return Response.json(
        { error: "No response from AI" },
        { status: 500 }
      );
    }

    // Extract JSON from the response (handle markdown code blocks)
    let jsonStr = textBlock.text.trim();
    const jsonMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonStr = jsonMatch[1].trim();
    }

    const result = JSON.parse(jsonStr);

    return Response.json(result);
  } catch (error) {
    console.error("AI food analysis error:", error);
    return Response.json(
      { error: "Failed to analyze food" },
      { status: 500 }
    );
  }
}
