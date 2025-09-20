import { FileText, Users, Calendar, ShieldCheck, Briefcase, MessageSquare } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();
  if (user?.role === "cliente") return <ClienteDashboard name={user.display} />;
  return <JuezDashboard name={user?.display || "Usuario"} />;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="container max-w-6xl py-10">
      <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
      <div className="mt-4 grid gap-6 md:grid-cols-2">
        {children}
      </div>
    </section>
  );
}

function Card({ title, description, icon }: { title: string; description: string; icon: React.ReactNode }) {
  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm transition hover:shadow-md">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          {icon}
        </span>
        <div>
          <h3 className="text-base font-semibold leading-none tracking-tight">{title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </div>
  );
}

function Header({ greeting }: { greeting: string }) {
  return (
    <div className="container max-w-6xl py-8">
      <div className="rounded-xl border bg-background p-6">
        <p className="text-sm text-muted-foreground">{greeting}</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight">Dashboard</h1>
      </div>
    </div>
  );
}

function JuezDashboard({ name }: { name: string }) {
  return (
    <main>
      <Header greeting={`Bienvenido, ${name}. Rol: Jurídica (Juez)`} />
      <Section title="Gestión del estudio">
        <Card title="Casos" description="Crea, asigna y controla expedientes y actuaciones." icon={<FileText className="h-5 w-5" />} />
        <Card title="Clientes" description="Personas y empresas con historial y documentación." icon={<Users className="h-5 w-5" />} />
        <Card title="Audiencias" description="Calendario de audiencias, plazos y recordatorios." icon={<Calendar className="h-5 w-5" />} />
        <Card title="Cumplimiento" description="Permisos, roles y trazabilidad completa." icon={<ShieldCheck className="h-5 w-5" />} />
      </Section>
    </main>
  );
}

function ClienteDashboard({ name }: { name: string }) {
  return (
    <main>
      <Header greeting={`Hola, ${name}. Rol: Cliente`} />
      <Section title="Mi escritorio">
        <Card title="Mis casos" description="Estado actual, próximas fechas y responsables." icon={<Briefcase className="h-5 w-5" />} />
        <Card title="Documentos" description="Sube y descarga documentación compartida." icon={<FileText className="h-5 w-5" />} />
        <Card title="Mensajes" description="Comunícate con tu equipo legal." icon={<MessageSquare className="h-5 w-5" />} />
        <Card title="Calendario" description="Audiencias y recordatorios personales." icon={<Calendar className="h-5 w-5" />} />
      </Section>
    </main>
  );
}
