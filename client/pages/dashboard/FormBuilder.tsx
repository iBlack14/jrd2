import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

type FieldType = "text" | "number" | "date" | "email" | "tel" | "select" | "checkbox";

type Field = {
  id: string;
  type: FieldType;
  label: string;
  required: boolean;
  placeholder?: string;
  options?: string[];
};

const STORAGE_KEY = "lexflow_formbuilder_forms";

type SavedForm = { id: string; name: string; fields: Field[] };

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

export default function FormBuilder() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [fields, setFields] = useState<Field[]>([]);
  const [name, setName] = useState("");

  const [newType, setNewType] = useState<FieldType>("text");
  const [newLabel, setNewLabel] = useState("");
  const [newPlaceholder, setNewPlaceholder] = useState("");
  const [newRequired, setNewRequired] = useState(false);
  const [newOptions, setNewOptions] = useState("");
  const [saved, setSaved] = useState<SavedForm[]>([]);

  useEffect(() => {
    if (user?.role !== "juridica") navigate("/dashboard", { replace: true });
  }, [user, navigate]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setSaved(JSON.parse(raw));
    } catch {}
  }, []);

  const canAdd = useMemo(() => newLabel.trim().length >= 2 && (newType !== "select" || newOptions.trim().length > 0), [newLabel, newType, newOptions]);
  const canSave = useMemo(() => name.trim().length >= 2 && fields.length > 0, [name, fields]);

  const addField = () => {
    if (!canAdd) return;
    const field: Field = {
      id: uid(),
      type: newType,
      label: newLabel.trim(),
      required: newRequired,
      placeholder: newPlaceholder.trim() || undefined,
      options: newType === "select" ? newOptions.split(",").map((s) => s.trim()).filter(Boolean) : undefined,
    };
    setFields((prev) => [...prev, field]);
    setNewLabel("");
    setNewPlaceholder("");
    setNewRequired(false);
    setNewOptions("");
  };

  const removeField = (id: string) => setFields((prev) => prev.filter((f) => f.id !== id));

  const saveForm = () => {
    if (!canSave) return;
    const next: SavedForm = { id: uid(), name: name.trim(), fields };
    const list = [next, ...saved];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    setSaved(list);
    toast.success("Formulario guardado");
    setName("");
  };

  const loadForm = (id: string) => {
    const f = saved.find((s) => s.id === id);
    if (!f) return;
    setName(f.name);
    setFields(f.fields);
  };

  return (
    <main className="container max-w-6xl py-8">
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Build Form</CardTitle>
            <CardDescription>Crea formularios fácilmente (solo rol Jurídica).</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label>Nombre del formulario</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej. Ficha de cliente" />
              </div>
              <div className="grid gap-2 rounded-lg border p-4">
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="grid gap-2">
                    <Label>Tipo de campo</Label>
                    <Select value={newType} onValueChange={(v) => setNewType(v as FieldType)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="text">Texto</SelectItem>
                        <SelectItem value="number">Número</SelectItem>
                        <SelectItem value="date">Fecha</SelectItem>
                        <SelectItem value="email">Casilla electrónica</SelectItem>
                        <SelectItem value="tel">Teléfono</SelectItem>
                        <SelectItem value="select">Selección</SelectItem>
                        <SelectItem value="checkbox">Checkbox</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label>Etiqueta</Label>
                    <Input value={newLabel} onChange={(e) => setNewLabel(e.target.value)} placeholder="Ej. Nombre" />
                  </div>
                  <div className="grid gap-2">
                    <Label>Placeholder</Label>
                    <Input value={newPlaceholder} onChange={(e) => setNewPlaceholder(e.target.value)} placeholder="Opcional" />
                  </div>
                  <div className="grid gap-2">
                    <Label className="flex items-center gap-2"><Checkbox checked={newRequired} onCheckedChange={(v) => setNewRequired(!!v)} /> Requerido</Label>
                  </div>
                  {newType === "select" && (
                    <div className="grid gap-2 md:col-span-2">
                      <Label>Opciones (separadas por coma)</Label>
                      <Input value={newOptions} onChange={(e) => setNewOptions(e.target.value)} placeholder="Ej. Oro, Plata, Bronce" />
                    </div>
                  )}
                </div>
                <div>
                  <Button onClick={addField} disabled={!canAdd}>Agregar campo</Button>
                </div>
              </div>

              <div className="grid gap-2">
                <Label>Campos</Label>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Etiqueta</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Requerido</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {fields.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center text-muted-foreground">Aún no hay campos.</TableCell>
                      </TableRow>
                    ) : (
                      fields.map((f) => (
                        <TableRow key={f.id}>
                          <TableCell>{f.label}</TableCell>
                          <TableCell className="capitalize">{f.type}</TableCell>
                          <TableCell>{f.required ? "Sí" : "No"}</TableCell>
                          <TableCell className="text-right"><Button variant="destructive" size="sm" onClick={() => removeField(f.id)}>Eliminar</Button></TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              <div className="flex gap-3">
                <Button onClick={saveForm} disabled={!canSave}>Guardar formulario</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Vista previa</CardTitle>
              <CardDescription>Así lo verán tus clientes/usuarios.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {fields.map((f) => (
                  <div className="grid gap-2" key={f.id}>
                    <Label>{f.label}{f.required ? " *" : ""}</Label>
                    {f.type === "text" || f.type === "email" || f.type === "tel" || f.type === "number" || f.type === "date" ? (
                      <Input type={f.type === "text" ? "text" : f.type} placeholder={f.placeholder} required={f.required} />
                    ) : f.type === "select" ? (
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder={f.placeholder || "Selecciona"} />
                        </SelectTrigger>
                        <SelectContent>
                          {(f.options || []).map((o) => (
                            <SelectItem key={o} value={o}>{o}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Checkbox />
                        <span className="text-sm text-muted-foreground">{f.placeholder || "Acepto"}</span>
                      </div>
                    )}
                  </div>
                ))}
                {fields.length === 0 && <p className="text-sm text-muted-foreground">Agrega campos para ver la vista previa.</p>}
                <div className="pt-2"><Button type="button" disabled>Enviar (demo)</Button></div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Formularios guardados</CardTitle>
              <CardDescription>Carga un formulario previo para editar.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Campos</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {saved.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center text-muted-foreground">Sin formularios guardados.</TableCell>
                    </TableRow>
                  ) : (
                    saved.map((s) => (
                      <TableRow key={s.id}>
                        <TableCell>{s.name}</TableCell>
                        <TableCell>{s.fields.length}</TableCell>
                        <TableCell className="text-right"><Button size="sm" onClick={() => loadForm(s.id)}>Cargar</Button></TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
