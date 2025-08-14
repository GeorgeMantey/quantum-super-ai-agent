import { registerTool } from "../registry";
import type { MCPTool } from "../registry";

const tavilyKey = process.env.TAVILY_API_KEY;

const webSearch: MCPTool = {
  slug: "web-search",
  version: "0.2.0",
  name: "Web Search",
  description: "Search the web using Tavily and return summarized results",
  async invoke({ q, max_results = 5 }) {
    if (!q || typeof q !== "string") throw new Error("q is required");
    if (!tavilyKey) return [{ title: "Search disabled", url: "", snippet: "Missing TAVILY_API_KEY" }];
    const r = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${tavilyKey}` },
      body: JSON.stringify({ query: q, max_results, include_answer: true })
    } as any);
    const j = await r.json();
    const items = (j.results || []).map((it: any) => ({ title: it.title, url: it.url, snippet: it.content?.slice(0, 250) }));
    return items;
  }
};

registerTool(webSearch);
