import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

function isValidDNI(v: string) {
  return /^\d{8}$/.test(v);
}

function rucCheckDigit(ruc10: string) {
  const weights = [5,4,3,2,7,6,5,4,3,2];
  const digits = ruc10.split("").map((d) => parseInt(d, 10));
  const sum = digits.reduce((acc, d, i) => acc + d * weights[i], 0);
  const mod = sum % 11;
  const res = 11 - mod;
  if (res === 10) return 0;
  if (res === 11) return 1;
  return res;
}

function isValidRUC(v: string) {
  if (!/^\d{11}$/.test(v)) return false;
  const prefixes = ["10", "15", "17", "20"];
  if (!prefixes.includes(v.slice(0,2))) return false;
  const check = rucCheckDigit(v.slice(0,10));
  return check === parseInt(v[10], 10);
}

const baseSchema = z.object({
  tipo: z.enum(["dni", "ruc"]),
  nombre: z.string().min(2, "Ingresa tu nombre o razón social"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
  confirm: z.string(),
});

const schema = z.discriminatedUnion("tipo", [
  baseSchema.extend({ tipo: z.literal("dni"), documento: z.string().refine(isValidDNI, "DNI inválido (8 dígitos)") }),
  baseSchema.extend({ tipo: z.literal("ruc"), documento: z.string().refine(isValidRUC, "RUC inválido (11 dígitos con dígito verificador)") }),
]).superRefine((data, ctx) => {
  if (data.password !== data.confirm) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["confirm"], message: "Las contraseñas no coinciden" });
  }
});

type FormValues = z.infer<typeof schema>;

export default function Register() {
  const { register: doRegister } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, watch, control, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { tipo: "dni" },
  });

  const tipo = watch("tipo");

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true);
    const username = values.documento.trim();
    const res = await doRegister({ username, password: values.password, display: values.nombre.trim() });
    setSubmitting(false);
    if (res.ok) {
      toast.success("Registro completado. ¡Bienvenido!");
      navigate("/dashboard", { replace: true });
    } else {
      toast.error(res.error || "No se pudo registrar");
    }
  };

  return (
    <main className="container max-w-lg py-16">
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>Crear cuenta (Cliente)</CardTitle>
          <CardDescription>Regístrate usando tu documento de identidad.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
            <div className="grid gap-2">
              <Label>Tipo de documento</Label>
              <Controller
                name="tipo"
                control={control}
                render={({ field }) => (
                  <RadioGroup className="grid grid-cols-2 gap-3" value={field.value} onValueChange={field.onChange}>
                    <label className="flex cursor-pointer items-center gap-2 rounded-md border p-2" htmlFor="tipo-dni">
                      <RadioGroupItem value="dni" id="tipo-dni" />
                      <span>DNI</span>
                    </label>
                    <label className="flex cursor-pointer items-center gap-2 rounded-md border p-2" htmlFor="tipo-ruc">
                      <RadioGroupItem value="ruc" id="tipo-ruc" />
                      <span>RUC</span>
                    </label>
                  </RadioGroup>
                )}
              />
              {errors.tipo && <p className="text-sm text-destructive">{errors.tipo.message as string}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="documento">{tipo === "ruc" ? "RUC" : "DNI"}</Label>
              <Input id="documento" placeholder={tipo === "ruc" ? "11 dígitos" : "8 dígitos"} maxLength={tipo === "ruc" ? 11 : 8} {...register("documento")} />
              {errors.documento && <p className="text-sm text-destructive">{errors.documento.message}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="nombre">Nombre o razón social</Label>
              <Input id="nombre" placeholder="Tu nombre" {...register("nombre")} />
              {errors.nombre && <p className="text-sm text-destructive">{errors.nombre.message}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input id="password" type="password" {...register("password")} />
              {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirm">Confirmar contraseña</Label>
              <Input id="confirm" type="password" {...register("confirm")} />
              {errors.confirm && <p className="text-sm text-destructive">{errors.confirm.message}</p>}
            </div>
            <Button type="submit" disabled={submitting}>{submitting ? "Creando..." : "Crear cuenta"}</Button>
            <p className="text-xs text-muted-foreground">¿Ya tienes cuenta? <Link to="/login" className="text-primary underline-offset-2 hover:underline">Inicia sesión</Link></p>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
