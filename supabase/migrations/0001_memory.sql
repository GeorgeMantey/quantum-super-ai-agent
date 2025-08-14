create table if not exists memory_kv (
  id bigserial primary key,
  k text unique not null,
  v jsonb not null,
  embedding vector(1536)
);

create index if not exists memory_kv_k_idx on memory_kv (k);
create index if not exists memory_kv_embedding_idx on memory_kv using ivfflat (embedding vector_cosine_ops);
