"use client";

import { useState } from "react";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
import { TechStackPicker } from "@/components/admin/tech-stack-picker";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { PortfolioAdminRepoItem } from "@/types/portfolio-admin";

type NewProjectDialogProps = Readonly<{
  onCreated: (item: PortfolioAdminRepoItem) => void;
}>;

export function NewProjectDialog({ onCreated }: NewProjectDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [slug, setSlug] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [stack, setStack] = useState<string[]>([]);
  const [demoUrl, setDemoUrl] = useState("");

  async function handleCreate() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/portfolio/manual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          title,
          professionalDescription: description || undefined,
          stack,
          demoUrl: demoUrl || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erro ao criar.");
      onCreated(data.item);
      setOpen(false);
      setSlug("");
      setTitle("");
      setDescription("");
      setStack([]);
      setDemoUrl("");
      toast.success("Projeto manual criado.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao criar.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="h-4 w-4" />
          Novo projeto
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Novo projeto manual</DialogTitle>
        </DialogHeader>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            void handleCreate();
          }}
        >
          <div>
            <label
              htmlFor="new-project-slug"
              className="mb-1 block text-xs font-medium"
            >
              Slug (URL)
            </label>
            <Input
              id="new-project-slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="meu-app-cliente"
              required
            />
          </div>
          <div>
            <label
              htmlFor="new-project-title"
              className="mb-1 block text-xs font-medium"
            >
              Título
            </label>
            <Input
              id="new-project-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label
              htmlFor="new-project-description"
              className="mb-1 block text-xs font-medium"
            >
              Descrição
            </label>
            <Textarea
              id="new-project-description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div>
            <label
              htmlFor="new-project-stack"
              className="mb-1 block text-xs font-medium"
            >
              Stack
            </label>
            <TechStackPicker
              id="new-project-stack"
              value={stack}
              onChange={setStack}
            />
          </div>
          <div>
            <label
              htmlFor="new-project-demo-url"
              className="mb-1 block text-xs font-medium"
            >
              Demo URL
            </label>
            <Input
              id="new-project-demo-url"
              value={demoUrl}
              onChange={(e) => setDemoUrl(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Criar projeto"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
