import { createClient } from '@supabase/supabase-js';
import type { MemoryAdapter } from '@qsa/shared/types';

async function embed(text: string): Promise<number[]> {
  const res = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      input: text.slice(0, 8000),
      model: process.env.EMBED_MODEL || 'text-embedding-3-small'
    })
  });
  const j = await res.json();
  return j.data?.[0]?.embedding || [];
}

export const supabaseMemory = (): MemoryAdapter => {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE || process.env.SUPABASE_ANON_KEY!
  );

  return {
    async upsert(key, value) {
      const text = typeof value === 'string' ? value : JSON.stringify(value);
      const e = await embed(text);
      await supabase.from('memory_kv').upsert({ k: key, v: value, embedding: e });
    },
    async get(key) {
      const { data } = await supabase.from('memory_kv').select('v').eq('k', key).maybeSingle();
      return data?.v ?? null;
    },
    async search(query, topK = 8) {
      const e = await embed(String(query));
      const { data } = await supabase.rpc('match_memories', { query_embedding: e, match_count: topK });
      return data || [];
    }
  };
};
