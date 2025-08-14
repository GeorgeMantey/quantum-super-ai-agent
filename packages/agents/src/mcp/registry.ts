import type { ToolSpec } from "@qsa/shared/types";

export type MCPTool = ToolSpec & { slug: string; version: string };

const tools: Record<string, MCPTool> = {};

export const registerTool = (tool: MCPTool) => {
  tools[tool.slug] = tool;
};

export const listTools = (): MCPTool[] => Object.values(tools);

export const getTool = (slug: string): MCPTool | undefined => tools[slug];
