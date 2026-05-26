"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Loader2, LogOut, Search } from "lucide-react";
import { toast } from "sonner";
import { NewProjectDialog } from "@/components/admin/new-project-dialog";
import { ProjectEditorCard } from "@/components/admin/project-editor-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { PortfolioAdminRepoItem } from "@/types/portfolio-admin";

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const [items, setItems] = useState<PortfolioAdminRepoItem[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [kvConfigured, setKvConfigured] = useState(true);

  const loadPortfolio = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/portfolio");
      if (res.status === 401) {
        setAuthenticated(false);
        return;
      }
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Erro ao carregar projetos.");
      }
      const data = (await res.json()) as {
        items: PortfolioAdminRepoItem[];
        kvConfigured: boolean;
      };
      setItems(data.items);
      setKvConfigured(data.kvConfigured);
      setAuthenticated(true);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro ao carregar.");
      setAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPortfolio();
  }, [loadPortfolio]);

  const filteredItems = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.repoFullName.toLowerCase().includes(q) ||
        (item.title?.toLowerCase().includes(q) ?? false)
    );
  }, [items, search]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginLoading(true);
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Senha incorreta.");
      }
      setPassword("");
      await loadPortfolio();
      toast.success("Login realizado.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro no login.");
    } finally {
      setLoginLoading(false);
    }
  }

  async function handleLogout() {
    await fetch("/api/admin/auth", { method: "DELETE" });
    setAuthenticated(false);
    setItems([]);
    toast.success("Sessão encerrada.");
  }

  function handleSaved(updated: PortfolioAdminRepoItem) {
    setItems((prev) => {
      const idx = prev.findIndex((i) => i.id === updated.id);
      if (idx < 0) return [...prev, updated];
      const next = [...prev];
      next[idx] = updated;
      return next;
    });
  }

  function handleDeleted(id: string) {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  if (authenticated === null || (authenticated && loading && !items.length)) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!authenticated) {
    return (
      <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-16">
        <h1 className="mb-2 text-2xl font-semibold">Painel Admin</h1>
        <p className="mb-8 text-sm text-muted-foreground">
          Edite projetos, capas, descrições e sincronize com o GitHub.
        </p>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-medium">
              Senha
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="ADMIN_PASSWORD"
              autoComplete="current-password"
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={loginLoading}>
            {loginLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Entrar"
            )}
          </Button>
        </form>
        <Link
          href="/"
          className="mt-8 text-center text-sm text-muted-foreground hover:text-primary"
        >
          Voltar ao site
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Painel Admin</h1>
          <p className="text-sm text-muted-foreground">
            {items.length} projetos · edições no Redis · capas no Vercel Blob
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <NewProjectDialog onCreated={handleSaved} />
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            Sair
          </Button>
        </div>
      </div>

      {!kvConfigured && (
        <div className="mb-6 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
          Redis não configurado. Defina <code className="text-xs">KV_REDIS_URL</code>{" "}
          para persistir edições em produção.
        </div>
      )}

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="pl-10"
          placeholder="Buscar projeto..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <ul className="space-y-3">
        {filteredItems.map((item) => (
          <ProjectEditorCard
            key={item.id}
            item={item}
            onSaved={handleSaved}
            onDeleted={handleDeleted}
          />
        ))}
      </ul>

      {filteredItems.length === 0 && (
        <p className="py-12 text-center text-sm text-muted-foreground">
          Nenhum projeto encontrado.
        </p>
      )}

      <div className="mt-8 flex justify-between text-sm text-muted-foreground">
        <Link href="/" className="hover:text-primary">
          Voltar ao site
        </Link>
        <span>{filteredItems.length} exibidos</span>
      </div>
    </main>
  );
}
