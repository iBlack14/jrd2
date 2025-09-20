import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";

const FORMS_KEY = "lexflow_formbuilder_forms";
const MSG_KEY = "lexflow_messages";

type FieldType = "text" | "number" | "date" | "email" | "tel" | "select" | "checkbox";

type Field = {
  id: string;
  type: FieldType;
  label: string;
  required: boolean;
  placeholder?: string;
  options?: string[];
};

type SavedForm = { id: string; name: string; fields: Field[] };

type Message = {
  id: string;
  type: "submission";
  from: string;
  fromDisplay: string;
  to: "juridica";
  formId: string;
  formName: string;
  payload: Record<string, unknown>;
  createdAt: string;
};

function uid() { return Math.random().toString(36).slice(2, 9); }

function getForms(): SavedForm[] {
  try { const raw = localStorage.getItem(FORMS_KEY); return raw ? JSON.parse(raw) : []; } catch { return []; }
}

function getMessages(): Message[] {
  try { const raw = localStorage.getItem(MSG_KEY); return raw ? JSON.parse(raw) : []; } catch { return []; }
}

function setMessages(list: Message[]) { localStorage.setItem(MSG_KEY, JSON.stringify(list)); }

export default function RequestsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [forms, setForms] = useState<SavedForm[]>([]);
  const [selected, setSelected] = useState<SavedForm | null>(null);
  const [values, setValues] = useState<Record<string, any>>({});
  const [sending, setSending] = useState(false);

  useEffect(() => { if (user?.role !== "cliente") navigate("/dashboard", { replace: true }); }, [user, navigate]);
  useEffect(() => { setForms(getForms()); }, []);

  useEffect(() => {
    if (selected) {
      const init: Record<string, any> = {};
      selected.fields.forEach((f) => { init[f.id] = f.type === "checkbox" ? false : ""; });
      setValues(init);
    }
  }, [selected?.id]);

  const canSend = useMemo(() => selected && selected.fields.every((f) => !f.required || (f.type === "checkbox" ? !!values[f.id] : String(values[f.id] ?? "").toString().trim().length > 0)), [selected, values]);

  const onSend = async () => {
    if (!selected || !user) return;
    if (!canSend) return;
    setSending(true);
    const payload: Record<string, unknown> = {};
    selected.fields.forEach((f) => { payload[f.label] = values[f.id]; });
    const msg: Message = {
      id: uid(),
      type: "submission",
      from: user.username,
      fromDisplay: user.display,
      to: "juridica",
      formId: selected.id,
      formName: selected.name,
      payload,
      createdAt: new Date().toISOString(),
    };
    const list = [msg, ...getMessages()];
    setMessages(list);
    setSending(false);
    toast.success("Solicitud enviada al juez");
    navigate("/dashboard/mensajes");
  };

  return (
    <main className="container max-w-6xl py-8">
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Solicitud</CardTitle>
            <CardDescription>Selecciona un formulario creado por tu juez y complétalo.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Formulario</TableHead>
                  <TableHead>Campos</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {forms.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground">No hay formularios disponibles aún.</TableCell>
                  </TableRow>
                ) : (
                  forms.map((f) => (
                    <TableRow key={f.id}>
                      <TableCell>{f.name}</TableCell>
                      <TableCell>{f.fields.length}</TableCell>
                      <TableCell className="text-right"><Button size="sm" onClick={() => setSelected(f)}>Rellenar</Button></TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Rellenar</CardTitle>
            <CardDescription>{selected ? selected.name : "Selecciona un formulario"}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {!selected && <p className="text-sm text-muted-foreground">Elige un formulario de la lista.</p>}
              {selected && selected.fields.map((f) => (
                <div className="grid gap-2" key={f.id}>
                  <Label>{f.label}{f.required ? " *" : ""}</Label>
                  {f.type === "text" || f.type === "email" || f.type === "tel" || f.type === "number" || f.type === "date" ? (
                    <Input type={f.type === "text" ? "text" : f.type} placeholder={f.placeholder} value={values[f.id] ?? ""} onChange={(e) => setValues({ ...values, [f.id]: e.target.value })} />
                  ) : f.type === "select" ? (
                    <Select value={values[f.id] ?? ""} onValueChange={(v) => setValues({ ...values, [f.id]: v })}>
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
                      <Checkbox checked={!!values[f.id]} onCheckedChange={(v) => setValues({ ...values, [f.id]: !!v })} />
                      <span className="text-sm text-muted-foreground">{f.placeholder || "Acepto"}</span>
                    </div>
                  )}
                </div>
              ))}
              <div className="pt-2"><Button type="button" onClick={onSend} disabled={!canSend || sending}>{sending ? "Enviando..." : "Enviar al juez"}</Button></div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
