"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Loader2, LogOut, Save, Search } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type {
  PortfolioAdminRepoItem,
  PortfolioVisibility,
} from "@/types/portfolio-admin";

type VisibilityMap = Record<string, PortfolioVisibility>;

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const [items, setItems] = useState<PortfolioAdminRepoItem[]>([]);
  const [visibility, setVisibility] = useState<VisibilityMap>({});
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
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
      const map: VisibilityMap = {};
      for (const item of data.items) {
        map[item.repoFullName] = item.visibility;
      }
      setVisibility(map);
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
        item.repoFullName.toLowerCase().includes(q)
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

  async function handleSave() {
    setSaving(true);
    try {
      const entries = items.map((item) => ({
        repoFullName: item.repoFullName,
        visibility: visibility[item.repoFullName] ?? item.visibility,
      }));
      const res = await fetch("/api/admin/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entries }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erro ao salvar.");
      toast.success(`${data.saved} projetos salvos no Redis.`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro ao salvar.");
    } finally {
      setSaving(false);
    }
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
          Gerencie a visibilidade e o status dos projetos do portfólio.
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
    <main className="mx-auto max-w-4xl px-6 py-10">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Painel Admin</h1>
          <p className="text-sm text-muted-foreground">
            {items.length} repositórios · alterações salvas no Redis
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            Sair
          </Button>
          <Button size="sm" onClick={handleSave} disabled={saving || !kvConfigured}>
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Salvar
          </Button>
        </div>
      </div>

      {!kvConfigured && (
        <div className="mb-6 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
          Redis não configurado. Conecte o Redis na Vercel e defina{" "}
          <code className="text-xs">KV_REDIS_URL</code> antes de salvar.
        </div>
      )}

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="pl-10"
          placeholder="Buscar repositório..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <ul className="space-y-2">
        {filteredItems.map((item) => (
          <li
            key={item.repoFullName}
            className="flex flex-col gap-3 rounded-lg border border-border bg-muted/20 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{item.name}</p>
              <p className="truncate text-xs text-muted-foreground">
                {item.repoFullName}
                {item.description ? ` · ${item.description}` : ""}
              </p>
            </div>
            <select
              className="h-10 shrink-0 rounded-lg border border-border bg-background px-3 text-sm"
              value={visibility[item.repoFullName] ?? item.visibility}
              onChange={(e) =>
                setVisibility((prev) => ({
                  ...prev,
                  [item.repoFullName]: e.target.value as PortfolioVisibility,
                }))
              }
            >
              <option value="finished">Finalizado</option>
              <option value="in_progress">Em andamento</option>
              <option value="hidden">Oculto</option>
            </select>
          </li>
        ))}
      </ul>

      {filteredItems.length === 0 && (
        <p className="py-12 text-center text-sm text-muted-foreground">
          Nenhum repositório encontrado.
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
