'use client';
import { useEffect, useState } from 'react';

type Tool = { slug: string; name: string; description: string; version: string };

export default function Tools() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [enabled, setEnabled] = useState<Record<string, boolean>>({});

  useEffect(()=>{ (async()=>{ const r = await fetch('/api/tools'); const j = await r.json(); setTools(j.tools||[]); })(); },[]);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">MCP Marketplace</h1>
      <p className="text-slate-600">Toggle tools for agents. (This demo stores state client-side.)</p>
      <div className="grid gap-3">
        {tools.map(t => (
          <div key={t.slug} className="border rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold">{t.name}</div>
                <div className="text-sm text-slate-600">{t.description}</div>
              </div>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={!!enabled[t.slug]} onChange={e=>setEnabled(m=>({...m,[t.slug]:e.target.checked}))} />
                <span>{enabled[t.slug] ? 'Enabled' : 'Disabled'}</span>
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
