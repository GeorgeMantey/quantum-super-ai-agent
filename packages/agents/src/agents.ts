import { chat } from "./providers";
import { sqliteMemory } from "@qsa/memory/sqlite";
import type { AgentConfig, AgentMessage } from "@qsa/shared/types";
import { listTools } from "./mcp/registry";

const mem = sqliteMemory("./.cache/agent.sqlite");

export const baseSystem = `You are part of the Quantum Super AI multi-agent team. Speak concisely. Use tools when helpful. If code is requested, return minimal, runnable snippets.`;

export const planner: AgentConfig = {
  name: "planner",
  systemPrompt: baseSystem + " You plan tasks, break down into steps, and route to other agents.",
  provider: (process.env.DEFAULT_PROVIDER as any) || "openai",
  tools: listTools(),
  memory: mem
};

export const researcher: AgentConfig = {
  name: "researcher",
  systemPrompt: baseSystem + " You search and synthesize info with citations.",
  provider: (process.env.DEFAULT_PROVIDER as any) || "openai",
  tools: listTools(),
  memory: mem
};

export const coder: AgentConfig = {
  name: "coder",
  systemPrompt: baseSystem + " You produce high-quality code and small diffs.",
  provider: (process.env.DEFAULT_PROVIDER as any) || "openai",
  tools: listTools(),
  memory: mem
};

export const reviewer: AgentConfig = {
  name: "reviewer",
  systemPrompt: baseSystem + " You review code, add tests, and suggest fixes.",
  provider: (process.env.DEFAULT_PROVIDER as any) || "openai",
  tools: listTools(),
  memory: mem
};

export const devops: AgentConfig = {
  name: "devops",
  systemPrompt: baseSystem + " You generate Docker, CI, and deployment steps.",
  provider: (process.env.DEFAULT_PROVIDER as any) || "openai",
  tools: listTools(),
  memory: mem
};

export const Agents = { planner, researcher, coder, reviewer, devops };

export async function runAgent(
  agent: AgentConfig,
  messages: AgentMessage[],
  model?: string
): Promise<string> {
  return chat(agent.provider || "openai", {
    model: model || agent.model,
    messages: [
      { role: "system", content: agent.systemPrompt },
      ...messages
    ]
  });
}
