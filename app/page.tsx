import { Notebook } from "@/components/notebook";

export default function Home() {
  return (
    <main className="min-h-screen bg-b from-background to-muted">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">Notebook</h1>
        <Notebook />
      </div>
    </main>
  );
}
