import { FileText, Users, Calendar, ShieldCheck, Briefcase, MessageSquare, BarChart2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";

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
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">{icon}</span>
        <div>
          <h3 className="text-base font-semibold leading-none tracking-tight">{title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </div>
  );
}

export default function DashboardHome() {
  const { user } = useAuth();
  const juridica = (
    <Section title="Gestión del estudio">
      <Card title="Casos" description="Crea, asigna y controla expedientes y actuaciones." icon={<FileText className="h-5 w-5" />} />
      <Card title="Clientes" description="Personas y empresas con historial y documentación." icon={<Users className="h-5 w-5" />} />
      <Card title="Audiencias" description="Calendario de audiencias, plazos y recordatorios." icon={<Calendar className="h-5 w-5" />} />
      <Card title="Cumplimiento" description="Permisos, roles y trazabilidad completa." icon={<ShieldCheck className="h-5 w-5" />} />
    </Section>
  );

  const cliente = (
    <Section title="Mi escritorio">
      <Card title="Mis casos" description="Estado actual, próximas fechas y responsables." icon={<Briefcase className="h-5 w-5" />} />
      <Card title="Documentos" description="Sube y descarga documentación compartida." icon={<FileText className="h-5 w-5" />} />
      <Card title="Mensajes" description="Comunícate con tu equipo legal." icon={<MessageSquare className="h-5 w-5" />} />
      <Card title="Calendario" description="Audiencias y recordatorios personales." icon={<Calendar className="h-5 w-5" />} />
    </Section>
  );

  const adminData = [
    { mes: "Ene", casos: 24, clientes: 12, audiencias: 6 },
    { mes: "Feb", casos: 30, clientes: 18, audiencias: 8 },
    { mes: "Mar", casos: 28, clientes: 21, audiencias: 7 },
    { mes: "Abr", casos: 36, clientes: 25, audiencias: 9 },
    { mes: "May", casos: 42, clientes: 28, audiencias: 11 },
    { mes: "Jun", casos: 39, clientes: 31, audiencias: 10 },
  ];

  const admin = (
    <>
      <section className="container max-w-6xl py-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KPI title="Casos activos" value="128" />
          <KPI title="Clientes" value="342" />
          <KPI title="Audiencias este mes" value="18" />
          <KPI title="Tasa de cierre" value="64%" />
        </div>
      </section>
      <section className="container max-w-6xl pb-10">
        <div className="rounded-xl border bg-card p-4">
          <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
            <BarChart2 className="h-4 w-4" />
            Rendimiento del estudio (6 meses)
          </div>
          <ChartContainer
            config={{
              casos: { label: "Casos", color: "hsl(var(--primary))" },
              clientes: { label: "Clientes", color: "#7c3aed" },
              audiencias: { label: "Audiencias", color: "#059669" },
            }}
            className="w-full"
          >
            <AreaChart data={adminData} margin={{ left: 12, right: 12 }}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="mes" tickLine={false} axisLine={false} />
              <YAxis width={32} tickLine={false} axisLine={false} />
              <ChartTooltip cursor={{ strokeDasharray: "3 3" }} content={<ChartTooltipContent />} />
              <Area type="monotone" dataKey="casos" stroke="var(--color-casos)" fill="var(--color-casos)" fillOpacity={0.15} />
              <Area type="monotone" dataKey="clientes" stroke="var(--color-clientes)" fill="var(--color-clientes)" fillOpacity={0.12} />
              <Area type="monotone" dataKey="audiencias" stroke="var(--color-audiencias)" fill="var(--color-audiencias)" fillOpacity={0.12} />
            </AreaChart>
          </ChartContainer>
          <ChartLegendContent className="justify-start" />
        </div>
      </section>
      <Section title="Acciones rápidas">
        <Card title="Usuarios" description="Crear, invitar y gestionar permisos de acceso." icon={<Users className="h-5 w-5" />} />
        <Card title="Roles y permisos" description="Define políticas y auditoría de acciones." icon={<ShieldCheck className="h-5 w-5" />} />
        <Card title="Casos" description="Supervisa el pipeline de casos y SLA." icon={<FileText className="h-5 w-5" />} />
        <Card title="Reportes" description="Exporta métricas y estados a PDF/CSV." icon={<BarChart2 className="h-5 w-5" />} />
      </Section>
    </>
  );

  const roleLabel = user?.role === "admin" ? "Admin" : user?.role === "juridica" ? "Jurídica" : "Cliente";

  return (
    <main>
      <div className="container max-w-6xl py-8">
        <div className="rounded-xl border bg-background p-6">
          <p className="text-sm text-muted-foreground">Sesión activa: <span className="font-medium">{user?.display}</span> · {roleLabel}</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight">Dashboard</h1>
        </div>
      </div>
      {user?.role === "admin" ? admin : user?.role === "cliente" ? cliente : juridica}
    </main>
  );
}

function KPI({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm">
      <div className="text-sm text-muted-foreground">{title}</div>
      <div className="mt-1 text-2xl font-bold">{value}</div>
    </div>
  );
}
