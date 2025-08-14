create or replace function match_memories(query_embedding vector(1536), match_count int)
returns table(k text, v jsonb, similarity float) as $$
  select k, v, 1 - (memory_kv.embedding <=> query_embedding) as similarity
  from memory_kv
  order by memory_kv.embedding <=> query_embedding
  limit match_count;
$$ language sql stable;
