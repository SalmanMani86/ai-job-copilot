export function PageHeader({ title, description }: { title: string; description: string }) {
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-zinc-50">{title}</h1>
      <p className="mt-2 text-sm text-zinc-400">{description}</p>
    </div>
  );
}
