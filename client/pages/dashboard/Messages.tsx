import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

const MSG_KEY = "lexflow_messages";

type SubmissionMessage = {
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

type ResponseMessage = {
  id: string;
  type: "response";
  toUser: string;
  toDisplay?: string;
  body: string;
  inReplyTo: string; // submission id
  formName: string;
  createdAt: string;
};

type Message = SubmissionMessage | ResponseMessage;

function getMessages(): Message[] {
  try { const raw = localStorage.getItem(MSG_KEY); return raw ? JSON.parse(raw) : []; } catch { return []; }
}

function setMessages(list: Message[]) { localStorage.setItem(MSG_KEY, JSON.stringify(list)); }

export default function MessagesPage() {
  const { user } = useAuth();
  const [data, setData] = useState<Message[]>([]);
  const [selected, setSelected] = useState<Message | null>(null);
  const [open, setOpen] = useState(false);
  const [reply, setReply] = useState("");

  useEffect(() => {
    setData(getMessages());
  }, []);

  const list = useMemo(() => {
    if (user?.role === "juridica") return data.filter((m) => m.type === "submission");
    if (user?.role === "cliente") return data.filter((m) => (m.type === "submission" && m.from === user.username) || (m.type === "response" && m.toUser === user.username));
    return [];
  }, [data, user]);

  const openDetail = (m: Message) => { setSelected(m); setOpen(true); };

  const sendReply = () => {
    if (!selected || selected.type !== "submission") return;
    if (!reply.trim()) return;
    const res: ResponseMessage = {
      id: Math.random().toString(36).slice(2,9),
      type: "response",
      toUser: selected.from,
      toDisplay: selected.fromDisplay,
      body: reply.trim(),
      inReplyTo: selected.id,
      formName: selected.formName,
      createdAt: new Date().toISOString(),
    };
    const next = [res, ...getMessages()];
    setMessages(next);
    setData(next);
    setReply("");
    setOpen(false);
  };

  return (
    <main className="container max-w-6xl py-8">
      <div className={"grid gap-6 " + (user?.role === "juridica" ? "" : "lg:grid-cols-2") }>
        <Card>
          <CardHeader>
            <CardTitle>Mensajes</CardTitle>
            <CardDescription>{user?.role === "juridica" ? "Solicitudes recibidas" : "Solicitudes y casilla electrónica"}</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>{user?.role === "juridica" ? "De" : "Tipo"}</TableHead>
                  <TableHead>Asunto</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {list.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground">Sin mensajes.</TableCell>
                  </TableRow>
                ) : (
                  list.map((m) => (
                    <TableRow key={m.id}>
                      <TableCell>{new Date(m.createdAt).toLocaleString()}</TableCell>
                      <TableCell>
                        {user?.role === "juridica"
                          ? (m as SubmissionMessage).fromDisplay + " (" + (m as SubmissionMessage).from + ")"
                          : m.type === "submission" ? "Enviado" : "Casilla electrónica"}
                      </TableCell>
                      <TableCell>{m.formName || (m.type === "response" ? "Respuesta" : "Mensaje")}</TableCell>
                      <TableCell className="text-right"><Button size="sm" onClick={() => openDetail(m)}>Ver</Button></TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        {user?.role !== "juridica" && (
          <Card>
            <CardHeader>
              <CardTitle>Detalle</CardTitle>
              <CardDescription>{selected ? (selected.formName || (selected.type === "response" ? "Respuesta" : "")) : "Selecciona un mensaje"}</CardDescription>
            </CardHeader>
            <CardContent>
              {selected ? (
                <div className="grid gap-3">
                  <div className="text-sm text-muted-foreground">Fecha: {new Date(selected.createdAt).toLocaleString()}</div>
                  {selected.type === "submission" ? (
                    <div className="grid gap-2">
                      {Object.entries(selected.payload).map(([k, v]) => (
                        <div key={k} className="grid gap-1">
                          <div className="text-sm font-medium">{k}</div>
                          <div className="rounded-md border bg-card p-2 text-sm">{String(v ?? "")}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-md border bg-card p-3 text-sm whitespace-pre-wrap">{selected.body}</div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No hay detalle para mostrar.</p>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selected?.type === "submission" ? selected.formName : "Casilla electrónica"}</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="grid gap-4">
              <div className="text-sm text-muted-foreground">Fecha: {new Date(selected.createdAt).toLocaleString()}</div>
              {selected.type === "submission" ? (
                <div className="grid gap-2">
                  {Object.entries(selected.payload).map(([k, v]) => (
                    <div key={k} className="grid gap-1">
                      <div className="text-sm font-medium">{k}</div>
                      <div className="rounded-md border bg-card p-2 text-sm">{String(v ?? "")}</div>
                    </div>
                  ))}
                  {user?.role === "juridica" && (
                    <>
                      <div className="pt-2 text-sm font-medium">Responder por casilla electrónica</div>
                      <Textarea value={reply} onChange={(e) => setReply(e.target.value)} placeholder="Escribe tu respuesta..." />
                      <div className="flex justify-end gap-2">
                        <Button variant="secondary" onClick={() => setOpen(false)}>Cerrar</Button>
                        <Button onClick={sendReply} disabled={!reply.trim()}>Enviar</Button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="rounded-md border bg-card p-3 text-sm whitespace-pre-wrap">{selected.body}</div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
}
