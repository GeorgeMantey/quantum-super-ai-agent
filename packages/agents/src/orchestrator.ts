import type { AgentMessage } from "@qsa/shared/types";
import { Agents, runAgent } from "./agents";

export interface OrchestrateInput {
  goal: string;
  history?: AgentMessage[];
  models?: Record<string,string>;
}

export async function orchestrate({ goal, history = [], models = {} }: OrchestrateInput) {
  const plan = await runAgent(Agents.planner, [
    { role: "user", content: `Create a short step-by-step plan to achieve: ${goal}. Return JSON with steps[].` }
  ]);

  let steps: string[] = [];
  try {
    const j = JSON.parse(plan.match(/\{[\s\S]*\}/)?.[0] || "{\"steps\":[]}" );
    steps = j.steps || [];
  } catch {
    steps = plan.split(/\n|\r/).filter(Boolean);
  }

  const results: { step: string; output: string }[] = [];

  for (const step of steps) {
    const target = decide(step);
    const model = models[target.name];
    const out = await runAgent(target, [
      { role: "user", content: `Step: ${step}\nGoal: ${goal}` }
    ], model);
    results.push({ step, output: out });
  }

  const review = await runAgent(Agents.reviewer, [
    { role: "user", content: `Review the following results and produce a concise final answer with any code blocks.\n${JSON.stringify(results).slice(0, 4000)}` }
  ]);

  return { plan, steps, results, final: review };
}

function decide(step: string) {
  const s = step.toLowerCase();
  if (s.includes("research") || s.includes("search")) return Agents.researcher;
  if (s.includes("docker") || s.includes("deploy") || s.includes("ci")) return Agents.devops;
  if (s.includes("code") || s.includes("implement") || s.includes("build")) return Agents.coder;
  return Agents.researcher;
}
