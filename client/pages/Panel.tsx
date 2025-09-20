import { Button } from "@/components/ui/button";
import { FileText, Users, Calendar, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

import { useAuth } from "@/contexts/AuthContext";

export default function Panel() {
  const { user } = useAuth();
  return (
    <main className="container max-w-6xl py-12">
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-xs text-muted-foreground">
          Sesión activa: <span className="font-medium">{user?.display}</span> · {user?.role === "juridica" ? "Jurídica" : "Cliente"}
        </div>
        <h1 className="mt-3 text-3xl font-bold tracking-tight">Panel de Gestión</h1>
        <p className="mt-2 text-muted-foreground">
          Próximamente: el panel para abogados, jueces y clientes. Indícame por chat qué módulos deseas y los construiré aquí (casos, expedientes, audiencias, portal de clientes, etc.).
        </p>
        {user?.role === "cliente" ? (
          <p className="mt-2 text-sm text-muted-foreground">Vista de cliente: acceso a estado de casos, documentos compartidos y notificaciones.</p>
        ) : (
          <p className="mt-2 text-sm text-muted-foreground">Vista jurídica: gestión completa de casos, audiencias y permisos.</p>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card title="Casos" description="Crea, asigna y controla el avance de cada expediente." icon={<FileText className="h-5 w-5" />} />
        <Card title="Clientes" description="Personas naturales y empresas, historial y documentación." icon={<Users className="h-5 w-5" />} />
        <Card title="Calendario" description="Audiencias, plazos y recordatorios sincronizados." icon={<Calendar className="h-5 w-5" />} />
        <Card title="Cumplimiento" description="Control de acceso, permisos y trazabilidad de acciones." icon={<ShieldCheck className="h-5 w-5" />} />
      </div>

      <div className="mt-10 flex gap-3">
        <Button asChild>
          <Link to="/">Volver al inicio</Link>
        </Button>
        <Button variant="secondary" asChild>
          <a href="#contacto">Solicitar módulos</a>
        </Button>
      </div>
    </main>
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
