import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Home, BarChart2, Calendar, MessageSquare, FileText, Bell, Search, Clock, Users, Settings, UserCircle, LogOut } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useAuth } from "@/contexts/AuthContext";

const baseItems = [
  { to: "/dashboard", icon: Home, label: "Inicio", end: true },
  { to: "/dashboard/analitica", icon: BarChart2, label: "Analítica" },
  { to: "/dashboard/audiencias", icon: Calendar, label: "Audiencias" },
  { to: "/dashboard/mensajes", icon: MessageSquare, label: "Mensajes" },
  { to: "/dashboard/casos", icon: FileText, label: "Casos" },
  { to: "/dashboard/alertas", icon: Bell, label: "Alertas" },
  { to: "/dashboard/buscar", icon: Search, label: "Buscar" },
  { to: "/dashboard/tiempos", icon: Clock, label: "Tiempos" },
  { to: "/dashboard/clientes", icon: Users, label: "Clientes" },
];

export default function Sidebar() {
  const location = useLocation();
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const items = user?.role === "admin"
    ? [
        ...baseItems.slice(0, 1),
        { to: "/dashboard/usuarios", icon: Users, label: "Usuarios" },
        { to: "/dashboard/permisos", icon: ShieldCheck, label: "Permisos" },
        ...baseItems.slice(1),
      ]
    : baseItems;

  return (
    <aside className="sticky top-0 h-screen w-16 shrink-0 border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="flex h-full flex-col items-center justify-between py-4">
        <div className="flex flex-col items-center gap-3">
          <TooltipProvider>
            {items.map(({ to, icon: Icon, label, end }) => (
              <Tooltip key={to}>
                <TooltipTrigger asChild>
                  <NavLink
                    to={to}
                    end={end}
                    className={({ isActive }) =>
                      cn(
                        "inline-flex h-10 w-10 items-center justify-center rounded-md text-foreground/60 hover:bg-accent hover:text-foreground",
                        isActive && "bg-primary text-primary-foreground hover:bg-primary"
                      )
                    }
                  >
                    <Icon className="h-5 w-5" />
                  </NavLink>
                </TooltipTrigger>
                <TooltipContent side="right">{label}</TooltipContent>
              </Tooltip>
            ))}
          </TooltipProvider>
        </div>
        <div className="flex flex-col items-center gap-3">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <NavLink to="/dashboard/ajustes" className={({ isActive }) => cn("inline-flex h-10 w-10 items-center justify-center rounded-md text-foreground/60 hover:bg-accent hover:text-foreground", isActive && "bg-primary text-primary-foreground hover:bg-primary") }>
                  <Settings className="h-5 w-5" />
                </NavLink>
              </TooltipTrigger>
              <TooltipContent side="right">Ajustes</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <button onClick={handleLogout} className="inline-flex h-10 w-10 items-center justify-center rounded-md text-foreground/60 hover:bg-accent hover:text-foreground">
                  <LogOut className="h-5 w-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">Salir</TooltipContent>
            </Tooltip>
            <div className="mb-1 inline-flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border bg-muted text-muted-foreground">
              <UserCircle className="h-5 w-5" />
            </div>
          </TooltipProvider>
        </div>
      </div>
    </aside>
  );
}
