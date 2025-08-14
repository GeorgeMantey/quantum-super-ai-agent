import { NextResponse } from 'next/server';
import { listTools } from '@qsa/agents/mcp/registry';

export async function GET() {
  return NextResponse.json({ tools: listTools() });
}
