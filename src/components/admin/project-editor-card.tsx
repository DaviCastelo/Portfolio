"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  GitBranch,
  Loader2,
  Save,
  Trash2,
  Upload,
} from "lucide-react";
import { toast } from "sonner";
import { TechStackPicker } from "@/components/admin/tech-stack-picker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type {
  PortfolioAdminRepoItem,
  PortfolioVisibility,
} from "@/types/portfolio-admin";

function encodeId(id: string): string {
  return encodeURIComponent(id);
}

export interface ProjectDraft {
  title: string;
  professionalDescription: string;
  thumbnail: string;
  stack: string[];
  demoUrl: string;
  featured: boolean;
  priority: number;
  visibility: PortfolioVisibility;
  architecture: string;
  challenges: string;
  solutions: string;
}

export function draftFromItem(item: PortfolioAdminRepoItem): ProjectDraft {
  return {
    title: item.title ?? item.name,
    professionalDescription: item.professionalDescription ?? "",
    thumbnail: item.thumbnail ?? "",
    stack: [...(item.stack ?? [])],
    demoUrl: item.demoUrl ?? "",
    featured: item.featured ?? false,
    priority: item.priority ?? 0,
    visibility: item.visibility,
    architecture: item.architecture ?? "",
    challenges: item.challenges ?? "",
    solutions: item.solutions ?? "",
  };
}

interface ProjectEditorCardProps {
  item: PortfolioAdminRepoItem;
  onSaved: (item: PortfolioAdminRepoItem) => void;
  onDeleted?: (id: string) => void;
}

export function ProjectEditorCard({
  item,
  onSaved,
  onDeleted,
}: ProjectEditorCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [draft, setDraft] = useState<ProjectDraft>(() => draftFromItem(item));
  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [restoreDescription, setRestoreDescription] = useState(false);
  const [restoreStack, setRestoreStack] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const isGithub = item.source === "github";

  async function handleUpload(file: File) {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("projectId", item.id);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erro no upload.");
      setDraft((d) => ({ ...d, thumbnail: data.url }));
      toast.success("Capa enviada.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro no upload.");
    } finally {
      setUploading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/portfolio/${encodeId(item.id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: draft.title,
          professionalDescription: draft.professionalDescription || undefined,
          thumbnail: draft.thumbnail || undefined,
          stack: draft.stack,
          demoUrl: draft.demoUrl || undefined,
          featured: draft.featured,
          priority: draft.priority,
          visibility: draft.visibility,
          architecture: draft.architecture || undefined,
          challenges: draft.challenges || undefined,
          solutions: draft.solutions || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erro ao salvar.");
      onSaved(data.item);
      toast.success("Projeto salvo.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro ao salvar.");
    } finally {
      setSaving(false);
    }
  }

  async function handleSync() {
    if (!isGithub) return;
    setSyncing(true);
    try {
      const res = await fetch(
        `/api/admin/portfolio/${encodeId(item.id)}/sync-github`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            restoreDescription,
            restoreStack,
          }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erro ao sincronizar.");
      const updated = data.item as PortfolioAdminRepoItem;
      setDraft(draftFromItem(updated));
      onSaved(updated);
      toast.success("Sincronizado com o GitHub.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro ao sincronizar.");
    } finally {
      setSyncing(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Remover este projeto do portfólio?")) return;
    try {
      const res = await fetch(`/api/admin/portfolio/${encodeId(item.id)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erro ao remover.");
      onDeleted?.(item.id);
      toast.success(
        item.source === "manual" ? "Projeto removido." : "Projeto ocultado."
      );
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro ao remover.");
    }
  }

  return (
    <li className="rounded-lg border border-border bg-muted/20">
      <button
        type="button"
        className="flex w-full items-center gap-3 px-4 py-3 text-left"
        onClick={() => setExpanded((v) => !v)}
      >
        <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-md bg-muted">
          {draft.thumbnail ? (
            <Image
              src={draft.thumbnail}
              alt=""
              fill
              className="object-cover"
              sizes="64px"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-[10px] text-muted-foreground">
              Sem capa
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium">{draft.title || item.name}</p>
          <p className="truncate text-xs text-muted-foreground">
            {item.repoFullName}
            {item.source === "manual" ? " · manual" : ""}
            {item.lastSyncedAt
              ? ` · sync ${new Date(item.lastSyncedAt).toLocaleDateString("pt-BR")}`
              : ""}
          </p>
        </div>
        <span className="shrink-0 text-xs text-muted-foreground">
          {draft.visibility === "hidden"
            ? "Oculto"
            : draft.visibility === "in_progress"
              ? "Em andamento"
              : "Finalizado"}
        </span>
        {expanded ? (
          <ChevronUp className="h-4 w-4 shrink-0" />
        ) : (
          <ChevronDown className="h-4 w-4 shrink-0" />
        )}
      </button>

      {expanded && (
        <div className="space-y-4 border-t border-border px-4 py-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium">Título</label>
              <Input
                value={draft.title}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, title: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium">
                Visibilidade
              </label>
              <select
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm"
                value={draft.visibility}
                onChange={(e) =>
                  setDraft((d) => ({
                    ...d,
                    visibility: e.target.value as PortfolioVisibility,
                  }))
                }
              >
                <option value="finished">Finalizado</option>
                <option value="in_progress">Em andamento</option>
                <option value="hidden">Oculto</option>
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium">
              Descrição comercial (Markdown)
            </label>
            <p className="mb-2 text-xs text-muted-foreground">
              Use Markdown: listas com <code className="text-[10px]">1.</code> ou{" "}
              <code className="text-[10px]">-</code>, títulos com{" "}
              <code className="text-[10px]">##</code>, negrito com{" "}
              <code className="text-[10px]">**texto**</code>. Quebras de linha
              entre blocos são respeitadas.
            </p>
            <Textarea
              rows={8}
              value={draft.professionalDescription}
              onChange={(e) =>
                setDraft((d) => ({
                  ...d,
                  professionalDescription: e.target.value,
                }))
              }
            />
          </div>

          <div>
            <label
              htmlFor={`stack-${item.id}`}
              className="mb-1 block text-xs font-medium"
            >
              Stack
            </label>
            <TechStackPicker
              id={`stack-${item.id}`}
              value={draft.stack}
              onChange={(stack) => setDraft((d) => ({ ...d, stack }))}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium">Demo URL</label>
              <Input
                value={draft.demoUrl}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, demoUrl: e.target.value }))
                }
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium">
                URL da capa
              </label>
              <Input
                value={draft.thumbnail}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, thumbnail: e.target.value }))
                }
                placeholder="https://...blob.vercel-storage.com/..."
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void handleUpload(file);
                e.target.value = "";
              }}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={uploading}
              onClick={() => fileRef.current?.click()}
            >
              {uploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Upload className="h-4 w-4" />
              )}
              Enviar capa
            </Button>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={draft.featured}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, featured: e.target.checked }))
                }
              />
              Destaque
            </label>
            <div className="flex items-center gap-2 text-sm">
              <span>Prioridade</span>
              <Input
                type="number"
                className="h-8 w-20"
                value={draft.priority}
                onChange={(e) =>
                  setDraft((d) => ({
                    ...d,
                    priority: Number(e.target.value) || 0,
                  }))
                }
              />
            </div>
          </div>

          {isGithub && (
            <div className="rounded-lg border border-dashed border-border p-3">
              <p className="mb-2 text-xs font-medium text-muted-foreground">
                Sincronizar com GitHub (estrelas, linguagens, README)
              </p>
              <div className="mb-2 flex flex-wrap gap-4 text-sm">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={restoreDescription}
                    onChange={(e) => setRestoreDescription(e.target.checked)}
                  />
                  Restaurar descrição do GitHub
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={restoreStack}
                    onChange={(e) => setRestoreStack(e.target.checked)}
                  />
                  Restaurar stack das linguagens
                </label>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={syncing}
                onClick={() => void handleSync()}
              >
                {syncing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <GitBranch className="h-4 w-4" />
                )}
                Sincronizar com GitHub
              </Button>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            <Button size="sm" disabled={saving} onClick={() => void handleSave()}>
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Salvar projeto
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => void handleDelete()}
            >
              <Trash2 className="h-4 w-4" />
              {item.source === "manual" ? "Excluir" : "Ocultar"}
            </Button>
          </div>
        </div>
      )}
    </li>
  );
}
