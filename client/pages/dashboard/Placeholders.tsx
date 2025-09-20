export function Placeholder({ title }: { title: string }) {
  return (
    <main className="container max-w-6xl py-12">
      <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
      <p className="mt-2 text-muted-foreground">Contenido en construcción. Dime qué necesitas y lo agrego aquí.</p>
    </main>
  );
}
