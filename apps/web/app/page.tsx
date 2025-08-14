'use client';
import { useState } from 'react';

const agentNames = ['planner','researcher','coder','reviewer','devops'] as const;

type RunResponse = { plan: string; steps: string[]; final: string };

export default function Home() {
  const [goal, setGoal] = useState('Build a TODO app with auth');
  const [loading, setLoading] = useState(false);
  const [resp, setResp] = useState<RunResponse | null>(null);
  const [models, setModels] = useState<Record<string, string>>({});

  const run = async () => {
    setLoading(true);
    setResp(null);
    const r = await fetch('/api/orchestrate', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ goal, models }) });
    const j = await r.json();
    setResp(j);
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Quantum Super AI Agent</h1>
      <p className="text-slate-600">Multi‑agent planner → researcher → coder → reviewer pipeline with model switcher & MCP tools.</p>

      <div className="flex gap-2">
        <input className="flex-1 border rounded-xl px-4 py-3" value={goal} onChange={e=>setGoal(e.target.value)} />
        <button onClick={run} disabled={loading} className="px-4 py-3 rounded-xl bg-black text-white">{loading ? 'Running…' : 'Run'}</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
        {agentNames.map(a => (
          <input key={a} placeholder={`${a} model (optional)`} className="border rounded-xl px-3 py-2"
            onChange={e=>setModels(m=>({...m,[a]:e.target.value}))} />
        ))}
      </div>

      {resp && (
        <div className="space-y-3">
          <details open className="border rounded-xl p-4">
            <summary className="font-semibold">Plan</summary>
            <pre className="whitespace-pre-wrap text-sm">{resp.plan}</pre>
          </details>
          <details className="border rounded-xl p-4">
            <summary className="font-semibold">Steps</summary>
            <pre className="whitespace-pre-wrap text-sm">{JSON.stringify(resp.steps, null, 2)}</pre>
          </details>
          <div className="border rounded-xl p-4">
            <h2 className="font-semibold mb-2">Final</h2>
            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: resp.final.replace(/```([\s\S]*?)```/g, '<pre>$1</pre>') }} />
          </div>
        </div>
      )}
    </div>
  );
}
