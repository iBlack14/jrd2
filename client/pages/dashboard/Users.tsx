import { useEffect, useMemo, useState } from "react";
import { useAuth, Role } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function UsersPage() {
  const { user, createUser, listUsers } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [display, setDisplay] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("cliente");
  const [submitting, setSubmitting] = useState(false);
  const [data, setData] = useState<ReturnType<typeof listUsers>>([]);

  useEffect(() => {
    if (user?.role !== "admin") navigate("/dashboard", { replace: true });
  }, [user, navigate]);

  useEffect(() => {
    setData(listUsers());
  }, [listUsers]);

  const valid = useMemo(() => username.trim().length >= 3 && display.trim().length >= 2 && password.length >= 6, [username, display, password]);

  const onCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid) return;
    setSubmitting(true);
    const res = await createUser({ username: username.trim(), password, display: display.trim(), role });
    setSubmitting(false);
    if (res.ok) {
      toast.success("Usuario creado");
      setUsername("");
      setDisplay("");
      setPassword("");
      setRole("cliente");
      setData(listUsers());
    } else {
      toast.error(res.error || "No se pudo crear");
    }
  };

  return (
    <main className="container max-w-6xl py-8">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Crear usuario</CardTitle>
            <CardDescription>Alta rápida para clientes o usuarios jurídicos.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onCreate} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="username">Usuario</Label>
                <Input id="username" placeholder="dni/ruc o alias" value={username} onChange={(e) => setUsername(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="display">Nombre a mostrar</Label>
                <Input id="display" placeholder="Nombre completo o razón social" value={display} onChange={(e) => setDisplay(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label>Rol</Label>
                <Select value={role} onValueChange={(v) => setRole(v as Role)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un rol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cliente">Cliente</SelectItem>
                    <SelectItem value="juridica">Jurídica</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" disabled={!valid || submitting}>{submitting ? "Creando..." : "Crear"}</Button>
            </form>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Usuarios creados</CardTitle>
            <CardDescription>Solo muestra usuarios creados por admin o registro.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Rol</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground">Sin usuarios aún.</TableCell>
                  </TableRow>
                ) : (
                  data.map((u) => (
                    <TableRow key={u.username}>
                      <TableCell className="font-mono">{u.username}</TableCell>
                      <TableCell>{u.display}</TableCell>
                      <TableCell className="capitalize">{u.role}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
