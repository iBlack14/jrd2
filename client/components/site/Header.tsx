import { Link, NavLink, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Scale, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

export default function SiteHeader() {
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();
  if (location.pathname.startsWith("/dashboard")) return null;
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Scale className="h-5 w-5" />
          </span>
          <span className="text-xl tracking-tight">LexFlow CMS</span>
        </Link>
        <nav className="hidden gap-6 md:flex" />
        <div className="flex items-center gap-2">
          {!isAuthenticated ? (
            location.pathname !== "/login" ? (
              <Button asChild size="sm">
                <Link to="/login">Ingresar</Link>
              </Button>
            ) : null
          ) : (
            <div className="flex items-center gap-2">
              <span className="hidden rounded-full border px-3 py-1 text-xs text-muted-foreground sm:inline-flex">
                {user?.display} · {user?.role === "admin" ? "Admin" : user?.role === "juridica" ? "Jurídica" : "Cliente"}
              </span>
              <Button size="sm" variant="secondary" onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" /> Salir
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function NavItem({ to, label, currentPath }: { to: string; label: string; currentPath: string }) {
  const isActive = currentPath === to;
  return (
    <NavLink
      to={to}
      className={cn(
        "text-sm transition-colors hover:text-foreground/80",
        isActive ? "text-foreground" : "text-foreground/60",
      )}
    >
      {label}
    </NavLink>
  );
}
