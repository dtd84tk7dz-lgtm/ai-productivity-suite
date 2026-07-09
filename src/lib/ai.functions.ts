import { createServerFn } from "@tanstack/react-start";
import { generateText } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "./ai-gateway.server";

const MODEL = "openai/gpt-5.5";

function getGateway() {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) throw new Error("Missing LOVABLE_API_KEY");
  return createLovableAiGatewayProvider(key);
}

async function runPrompt(system: string, prompt: string, temperature = 0.7) {
  const gateway = getGateway();
  try {
    const { text } = await generateText({
      model: gateway(MODEL),
      system,
      prompt,
      temperature,
    });
    return { text };
  } catch (e) {
    const err = e as Error & { statusCode?: number };
    const status = err.statusCode ?? 500;
    if (status === 429)
      throw new Error("Rate limit reached. Please wait a moment and try again.");
    if (status === 402)
      throw new Error("AI credits exhausted. Please add credits in your workspace.");
    throw new Error(err.message || "AI request failed");
  }
}

const EmailInput = z.object({
  recipient: z.string().optional().default(""),
  subject: z.string().optional().default(""),
  purpose: z.string().optional().default(""),
  context: z.string().optional().default(""),
  keyPoints: z.string().optional().default(""),
  instructions: z.string().optional().default(""),
  tone: z.enum(["Formal", "Friendly", "Persuasive"]).default("Formal"),
  length: z.enum(["Short", "Medium", "Long"]).default("Medium"),
});

export const generateEmail = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => EmailInput.parse(d))
  .handler(async ({ data }) => {
    const system = `You are an expert professional email writer. Write clear, well-structured emails with subject-appropriate greetings and sign-offs. Never include placeholder brackets like [Your Name] — leave signatures generic or omit.`;
    const prompt = `Write a ${data.tone.toLowerCase()} email (${data.length.toLowerCase()} length).
Recipient: ${data.recipient || "(unspecified)"}
Subject: ${data.subject || "(derive one)"}
Purpose: ${data.purpose}
Context: ${data.context}
Key points: ${data.keyPoints}
Additional instructions: ${data.instructions}

Return the full email including subject line at the top as "Subject: ...".`;
    return runPrompt(system, prompt);
  });

const TransformInput = z.object({
  text: z.string().min(1),
  action: z.enum(["Rewrite", "Improve", "Expand", "Shorten", "Correct Grammar"]),
});

export const transformText = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => TransformInput.parse(d))
  .handler(async ({ data }) => {
    const map: Record<string, string> = {
      Rewrite: "Rewrite the following text in a fresh, professional way while preserving intent.",
      Improve: "Improve clarity, tone, and professionalism of the following text.",
      Expand: "Expand the following text with more detail, examples, and structure.",
      Shorten: "Shorten the following text to its essential message while staying professional.",
      "Correct Grammar": "Correct grammar, spelling, and punctuation. Preserve meaning and voice.",
    };
    return runPrompt(
      "You are a precise professional editor.",
      `${map[data.action]}\n\n---\n${data.text}\n---\n\nReturn only the revised text.`,
    );
  });

const ResearchInput = z.object({
  input: z.string().min(1),
  mode: z.enum([
    "Summary",
    "Key Insights",
    "Recommendations",
    "Action Items",
    "Executive Summary",
    "Important Facts",
    "Key Statistics",
  ]),
});

export const researchAssist = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => ResearchInput.parse(d))
  .handler(async ({ data }) => {
    const system = `You are an expert research analyst. Produce well-structured markdown output. Be accurate and concise. If the input is a topic (not pasted text), draw on general knowledge and clearly note assumptions.`;
    const modePrompts: Record<string, string> = {
      Summary: "Write a clear multi-paragraph summary.",
      "Key Insights": "Extract 5-8 key insights as a bulleted list.",
      Recommendations: "Provide 5-7 actionable recommendations as a numbered list.",
      "Action Items": "List concrete action items with owners/timelines suggested.",
      "Executive Summary": "Write a 3-4 paragraph executive summary suitable for leadership.",
      "Important Facts": "List the most important facts as bullet points.",
      "Key Statistics": "List key statistics with context. Note if figures are illustrative.",
    };
    return runPrompt(
      system,
      `${modePrompts[data.mode]}\n\nSubject / text:\n${data.input}`,
    );
  });

const DocInput = z.object({
  type: z.string(),
  topic: z.string().min(1),
  audience: z.string().optional().default(""),
  tone: z.string().default("Professional"),
  length: z.enum(["Short", "Medium", "Long", "Detailed"]).default("Medium"),
  context: z.string().optional().default(""),
  instructions: z.string().optional().default(""),
});

export const generateDocument = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => DocInput.parse(d))
  .handler(async ({ data }) => {
    const system = `You are an expert workplace writer producing polished business documents in markdown. Use headings, sections, and lists appropriately for the document type.`;
    const prompt = `Create a ${data.length.toLowerCase()} ${data.type}.
Topic: ${data.topic}
Audience: ${data.audience || "General professional audience"}
Tone: ${data.tone}
Context: ${data.context}
Additional instructions: ${data.instructions}

Return the finished document in markdown.`;
    return runPrompt(system, prompt);
  });