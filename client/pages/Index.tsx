import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Calendar, FileText, MessageSquare, Scale, ShieldCheck, Users } from "lucide-react";

export default function Index() {
  return (
    <main>
      <Hero />
      <Features />
      <Workflow />
      <CTA />
    </main>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-transparent to-transparent">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(29,78,216,0.15),transparent_60%)]" />
      <div className="container relative mx-auto grid max-w-6xl items-center gap-10 py-16 md:grid-cols-2 md:py-24">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-xs text-muted-foreground shadow-sm">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary"><Scale className="h-3 w-3" /></span>
            CMS jurídico para estudios y tribunales
          </div>
          <h1 className="mt-4 text-4xl font-extrabold leading-[1.1] tracking-tight md:text-5xl">
            Conecta personas jurídicas y clientes en un solo lugar
          </h1>
          <p className="mt-4 max-w-prose text-base text-muted-foreground md:text-lg">
            Plataforma moderna para gestionar casos, audiencias y documentos entre abogados y jueces, con portal de clientes para personas naturales y empresas.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to="/login">Soy Abogado/Juez</Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link to="/login">Soy Cliente</Link>
            </Button>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">Sin instalaciones. Seguro, rápido y preparado para producción.</p>
        </div>
        <div className="relative">
          <div className="mx-auto w-full max-w-md rounded-2xl border bg-card p-4 shadow-xl md:translate-y-2">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-green-500" />
                Online
              </div>
              <span className="text-xs text-muted-foreground">Demo de Panel</span>
            </div>
            <div className="grid gap-4 py-4 md:grid-cols-2">
              <DemoCard icon={<FileText className="h-4 w-4" />} title="Casos" value="132" accent="bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300" />
              <DemoCard icon={<Users className="h-4 w-4" />} title="Clientes" value="89" accent="bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-300" />
              <DemoCard icon={<Calendar className="h-4 w-4" />} title="Audiencias" value="12" accent="bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300" />
              <DemoCard icon={<ShieldCheck className="h-4 w-4" />} title="Cumplimiento" value="OK" accent="bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300" />
            </div>
            <div className="rounded-lg border bg-muted/30 p-3 text-sm text-muted-foreground">
              Todo el flujo central del estudio jurídico en una vista simple y segura.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function DemoCard({ icon, title, value, accent }: { icon: React.ReactNode; title: string; value: string; accent: string }) {
  return (
    <div className="rounded-xl border p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className={`inline-flex items-center justify-center rounded-md px-2 py-1 text-xs ${accent}`}>{icon}</span>
          {title}
        </div>
        <div className="text-lg font-semibold">{value}</div>
      </div>
    </div>
  );
}

function Features() {
  const items = [
    {
      icon: <FileText className="h-5 w-5" />,
      title: "Gestión de casos",
      desc: "Expedientes, etapas procesales y adjuntos con control de cambios.",
    },
    {
      icon: <Calendar className="h-5 w-5" />,
      title: "Audiencias y plazos",
      desc: "Calendario con recordatorios y alertas automáticas.",
    },
    {
      icon: <Users className="h-5 w-5" />,
      title: "Portal de clientes",
      desc: "Acceso seguro para personas y empresas con seguimiento en tiempo real.",
    },
    {
      icon: <MessageSquare className="h-5 w-5" />,
      title: "Comunicación",
      desc: "Mensajería interna y notas por caso con menciones.",
    },
    {
      icon: <ShieldCheck className="h-5 w-5" />,
      title: "Seguridad y permisos",
      desc: "Roles (abogados, jueces, asistentes, clientes) y auditoría.",
    },
    {
      icon: <Scale className="h-5 w-5" />,
      title: "Cumplimiento",
      desc: "Firmas, historial y respaldo cifrado.",
    },
  ];
  return (
    <section className="container mx-auto max-w-6xl py-16 md:py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Todo lo que tu estudio necesita</h2>
        <p className="mt-3 text-muted-foreground">Diseñado para conectar a personas jurídicas (abogados, jueces) y clientes (naturales o empresas).</p>
      </div>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((it, i) => (
          <div key={i} className="group rounded-2xl border bg-card p-6 shadow-sm transition hover:shadow-md">
            <div className="flex items-start gap-3">
              <span className="mt-1 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">{it.icon}</span>
              <div>
                <h3 className="text-base font-semibold leading-none tracking-tight">{it.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{it.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Workflow() {
  const steps = [
    {
      title: "Registro y roles",
      desc: "Abogados/Jueces y Clientes crean cuentas con verificación y permisos.",
    },
    {
      title: "Creación del caso",
      desc: "Se define materia, partes, documentos y responsables.",
    },
    {
      title: "Seguimiento",
      desc: "Audiencias, plazos y comunicaciones quedan centralizados.",
    },
    {
      title: "Portal del cliente",
      desc: "Notificaciones, estados y facturación transparente.",
    },
  ];
  return (
    <section className="bg-muted/20 py-16 md:py-24">
      <div className="container mx-auto max-w-5xl">
        <h2 className="text-center text-2xl font-bold md:text-3xl">Cómo funciona</h2>
        <ol className="mx-auto mt-10 grid gap-6 sm:grid-cols-2 md:max-w-4xl">
          {steps.map((s, i) => (
            <li key={i} className="rounded-xl border bg-card p-5">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                {i + 1}
              </span>
              <h3 className="mt-3 text-base font-semibold">{s.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section id="contacto" className="container mx-auto max-w-5xl py-16 md:py-24">
      <div className="rounded-2xl border bg-gradient-to-br from-primary/5 to-transparent p-8 text-center md:p-12">
        <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Listo para modernizar tu estudio jurídico</h2>
        <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">Empieza con el panel base y dime por chat qué módulos quieres. Construiremos tu CMS a medida, seguro y escalable.</p>
        <div className="mt-6 flex justify-center gap-3">
          <Button asChild size="lg">
            <Link to="/panel">Abrir Panel</Link>
          </Button>
          <Button asChild size="lg" variant="secondary">
            <a href="#">Solicitar demo guiada</a>
          </Button>
        </div>
      </div>
    </section>
  );
}
