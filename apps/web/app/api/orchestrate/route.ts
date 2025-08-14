import { NextRequest, NextResponse } from 'next/server';
import { orchestrate } from '@qsa/agents/orchestrator';

export async function POST(req: NextRequest) {
  const { goal, models } = await req.json();
  const out = await orchestrate({ goal, models });
  return NextResponse.json({ plan: out.plan, steps: out.steps, final: out.final });
}
