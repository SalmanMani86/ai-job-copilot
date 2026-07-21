-- Run this in the Supabase SQL editor (Project -> SQL Editor -> New query)

create extension if not exists vector;

create table if not exists documents (
    id bigint generated always as identity primary key,
    source_type text not null check (source_type in ('resume', 'github_readme', 'portfolio')),
    title text not null,
    raw_text text not null,
    created_at timestamptz not null default now()
);

create table if not exists chunks (
    id bigint generated always as identity primary key,
    document_id bigint not null references documents(id) on delete cascade,
    content text not null,
    chunk_index int not null,
    embedding vector(768),
    created_at timestamptz not null default now()
);

create index if not exists chunks_embedding_idx
    on chunks using ivfflat (embedding vector_cosine_ops)
    with (lists = 100);

create table if not exists job_analyses (
    id bigint generated always as identity primary key,
    job_description text not null,
    match_score numeric,
    matched_skills jsonb,
    gaps jsonb,
    cover_letter text,
    created_at timestamptz not null default now()
);

-- Run this too (RPC used by vector_store.search_similar_chunks):
create or replace function match_chunks(
    query_embedding vector(768),
    match_count int default 10
)
returns table (
    id bigint,
    document_id bigint,
    content text,
    chunk_index int,
    similarity float
)
language sql stable
as $$
    select
        chunks.id,
        chunks.document_id,
        chunks.content,
        chunks.chunk_index,
        1 - (chunks.embedding <=> query_embedding) as similarity
    from chunks
    order by chunks.embedding <=> query_embedding
    limit match_count;
$$;
