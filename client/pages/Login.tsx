import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { ShieldCheck, User } from "lucide-react";

export default function Login() {
  const { login, isAuthenticated } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation() as any;

  useEffect(() => {
    if (isAuthenticated) navigate("/dashboard", { replace: true });
  }, [isAuthenticated, navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await login(username.trim(), password);
    setLoading(false);
    if (res.ok) {
      toast.success("Ingreso exitoso");
      const to = location.state?.from?.pathname || "/dashboard";
      navigate(to, { replace: true });
    } else {
      toast.error(res.error || "Error de autenticación");
    }
  };

  return (
    <main className="container max-w-lg py-16">
      <Card className="overflow-hidden">
        <CardHeader>
          <div className="flex items-center gap-2 text-primary">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-primary/10"><ShieldCheck className="h-4 w-4" /></span>
            <span className="text-sm font-semibold">LexFlow CMS</span>
          </div>
          <CardTitle>Iniciar sesión</CardTitle>
          <CardDescription>Acceso para personas jurídicas (jueces) y clientes.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="username">Usuario</Label>
              <Input id="username" placeholder="juez o prueba" value={username} onChange={(e) => setUsername(e.target.value)} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input id="password" type="password" placeholder="juez1 o prueba" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <Button type="submit" disabled={loading} className="mt-2">{loading ? "Accediendo..." : "Ingresar"}</Button>
            <div className="text-xs text-muted-foreground">
              Usuarios demo:
              <ul className="mt-1 list-disc pl-4">
                <li>Admin: usuario <code>admin</code>, contraseña <code>admin1</code>.</li>
                <li>Jueces (personas jurídicas): usuario <code>juez</code>, contraseña <code>juez1</code>.</li>
                <li>Cliente: usuario <code>prueba</code>, contraseña <code>prueba</code>.</li>
              </ul>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
