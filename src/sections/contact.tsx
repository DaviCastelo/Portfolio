"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, Mail, Send, User } from "lucide-react";
import { BrandIcon } from "@/components/brand/brand-icon";
import { SectionHeader } from "@/components/layout/section-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SocialLinks } from "@/components/layout/social-links";
import { contact } from "@/data/site";
import { WHATSAPP_URL, externalLinkProps } from "@/lib/links";

const MAX_MESSAGE = 5000;

const schema = z.object({
  name: z.string().trim().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().trim().email("E-mail inválido"),
  company: z.string().optional(),
  message: z
    .string()
    .trim()
    .min(10, "Mensagem deve ter pelo menos 10 caracteres")
    .max(MAX_MESSAGE, `Mensagem deve ter no máximo ${MAX_MESSAGE} caracteres`),
  website: z.string().max(0).optional(),
});

type FormData = z.infer<typeof schema>;

export function ContactSection() {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { website: "" },
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = (await res.json()) as {
        error?: string;
        details?: { fieldErrors?: Record<string, string[]> };
      };
      if (!res.ok) {
        const fieldMsg = json.details?.fieldErrors
          ? Object.values(json.details.fieldErrors).flat()[0]
          : undefined;
        throw new Error(fieldMsg ?? json.error ?? "Erro ao enviar");
      }
      toast.success("Mensagem enviada! Retornaremos em breve.");
      reset();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Falha no envio");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contato" className="section-padding">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <div className="mb-6 flex items-center gap-3">
              <BrandIcon variant="iconSquircleBlue" size="sm" animate="none" />
              <SectionHeader
                index={contact.index}
                label={contact.label}
                title={contact.title}
                highlightWord={contact.highlightWord}
                description={contact.description}
                className="mb-0"
              />
            </div>
            <a
              href={`mailto:${contact.email}`}
              className="mt-4 inline-flex items-center gap-2 text-sm text-primary hover:underline"
            >
              <Mail className="h-4 w-4" />
              {contact.email}
            </a>
            <div className="mt-6 space-y-3">
              <p className="text-sm font-medium">Siga a Kairos</p>
              <SocialLinks />
              <a
                href={WHATSAPP_URL}
                {...externalLinkProps}
                className="inline-flex text-sm text-muted-foreground hover:text-primary"
              >
                WhatsApp
              </a>
            </div>
          </div>
          <form
            method="post"
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              void handleSubmit(onSubmit)(e);
            }}
            className="glass space-y-5 rounded-xl p-6 md:p-8"
          >
            <input
              type="text"
              tabIndex={-1}
              autoComplete="off"
              className="hidden"
              aria-hidden
              {...register("website")}
            />
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="name" className="pl-10" {...register("name")} />
              </div>
              {errors.name && (
                <p className="text-xs text-red-400">{errors.name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="email" type="email" className="pl-10" {...register("email")} />
              </div>
              {errors.email && (
                <p className="text-xs text-red-400">{errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Empresa (opcional)</Label>
              <Input id="company" {...register("company")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Mensagem</Label>
              <Textarea
                id="message"
                rows={5}
                maxLength={MAX_MESSAGE}
                {...register("message")}
              />
              <p className="text-xs text-muted-foreground">
                Máximo {MAX_MESSAGE} caracteres
              </p>
              {errors.message && (
                <p className="text-xs text-red-400">{errors.message.message}</p>
              )}
            </div>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              Enviar mensagem
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
