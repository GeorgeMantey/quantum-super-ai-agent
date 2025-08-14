export type Provider = "openai" | "openrouter" | "anthropic" | "azure";

export type AgentName =
  | "planner"
  | "researcher"
  | "coder"
  | "reviewer"
  | "devops";

export interface AgentMessage {
  role: "system" | "user" | "assistant";
  content: string;
  meta?: Record<string, unknown>;
}

export interface ToolSpec {
  name: string;
  description: string;
  invoke: (args: Record<string, unknown>) => Promise<unknown>;
}

export interface AgentConfig {
  name: AgentName;
  systemPrompt: string;
  model?: string;
  provider?: Provider;
  tools?: ToolSpec[];
  memory?: MemoryAdapter;
}

export interface MemoryAdapter {
  upsert: (key: string, value: unknown) => Promise<void>;
  get: (key: string) => Promise<unknown | null>;
  search?: (query: string, topK?: number) => Promise<unknown[]>;
}
