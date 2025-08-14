import OpenAI from "openai";
import type { Provider } from "@qsa/shared/types";

export interface ChatArgs {
  messages: { role: "system" | "user" | "assistant"; content: string }[];
  model?: string;
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const chat = async (
  provider: Provider,
  { messages, model }: ChatArgs
): Promise<string> => {
  const fallbackModel = provider === "anthropic" ? "claude-3-5-sonnet" : "gpt-4o-mini";
  const chosenModel = model || process.env.DEFAULT_MODEL || fallbackModel;

  if (provider === "openai" || provider === "azure") {
    const res = await openai.chat.completions.create({ model: chosenModel, messages });
    return res.choices[0]?.message?.content ?? "";
  }

  if (provider === "openrouter") {
    const r = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`
      },
      body: JSON.stringify({ model: chosenModel, messages })
    });
    const j = await r.json();
    return j.choices?.[0]?.message?.content ?? "";
  }

  if (provider === "anthropic") {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY || "",
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({ model: chosenModel, messages })
    });
    const j = await r.json();
    // Anthropics response structure can vary; keep simple for demo
    return j.content?.[0]?.text ?? "";
  }

  throw new Error(`Unsupported provider: ${provider}`);
};
