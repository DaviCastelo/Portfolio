"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Download, Loader2, LogOut, Search, X } from "lucide-react";
import { toast } from "sonner";
import { NewProjectDialog } from "@/components/admin/new-project-dialog";
import { ProjectEditorCard } from "@/components/admin/project-editor-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import type {
  PortfolioAdminRepoItem,
  PortfolioProjectSource,
  PortfolioVisibility,
} from "@/types/portfolio-admin";

const ADMIN_PAGE_SIZE = 12;

function normalizeSearch(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const [items, setItems] = useState<PortfolioAdminRepoItem[]>([]);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 300);
  const [visibilityFilter, setVisibilityFilter] = useState<
    PortfolioVisibility | "all"
  >("all");
  const [sourceFilter, setSourceFilter] = useState<
    PortfolioProjectSource | "all"
  >("all");
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
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
    const q = normalizeSearch(debouncedSearch.trim());
    return items.filter((item) => {
      if (visibilityFilter !== "all" && item.visibility !== visibilityFilter) {
        return false;
      }
      if (sourceFilter !== "all" && item.source !== sourceFilter) {
        return false;
      }
      if (!q) return true;
      return (
        normalizeSearch(item.name).includes(q) ||
        normalizeSearch(item.repoFullName).includes(q) ||
        (item.title ? normalizeSearch(item.title).includes(q) : false)
      );
    });
  }, [items, debouncedSearch, visibilityFilter, sourceFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / ADMIN_PAGE_SIZE));
  const currentPage = Math.min(page, totalPages - 1);
  const pageItems = filteredItems.slice(
    currentPage * ADMIN_PAGE_SIZE,
    currentPage * ADMIN_PAGE_SIZE + ADMIN_PAGE_SIZE
  );

  useEffect(() => {
    setPage(0);
  }, [debouncedSearch, visibilityFilter, sourceFilter]);

  async function handleLogin() {
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

  async function handleExport() {
    setExporting(true);
    try {
      const res = await fetch("/api/admin/portfolio/export");
      if (!res.ok) throw new Error("Falha ao exportar.");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `portfolio-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Backup exportado.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro ao exportar.");
    } finally {
      setExporting(false);
    }
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
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void handleLogin();
          }}
          className="space-y-4"
        >
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
            {filteredItems.length} de {items.length} projetos
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={exporting || !kvConfigured}
            onClick={() => void handleExport()}
          >
            {exporting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            Exportar JSON
          </Button>
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

      <div className="mb-4 space-y-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-10 pr-10"
            placeholder="Buscar projeto por nome..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:bg-muted"
              onClick={() => setSearch("")}
              aria-label="Limpar busca"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <select
            className="h-10 rounded-lg border border-border bg-background px-3 text-sm"
            value={visibilityFilter}
            onChange={(e) =>
              setVisibilityFilter(e.target.value as PortfolioVisibility | "all")
            }
          >
            <option value="all">Todas visibilidades</option>
            <option value="finished">Finalizado</option>
            <option value="in_progress">Em andamento</option>
            <option value="hidden">Oculto</option>
          </select>
          <select
            className="h-10 rounded-lg border border-border bg-background px-3 text-sm"
            value={sourceFilter}
            onChange={(e) =>
              setSourceFilter(e.target.value as PortfolioProjectSource | "all")
            }
          >
            <option value="all">Todas origens</option>
            <option value="github">GitHub</option>
            <option value="manual">Manual</option>
          </select>
        </div>
      </div>

      <ul className="space-y-3">
        {pageItems.map((item) => (
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

      {filteredItems.length > ADMIN_PAGE_SIZE && (
        <div className="mt-6 flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 0}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
          >
            Anterior
          </Button>
          <span className="text-sm text-muted-foreground">
            Página {currentPage + 1} de {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage >= totalPages - 1}
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
          >
            Próxima
          </Button>
        </div>
      )}

      <div className="mt-8 flex justify-between text-sm text-muted-foreground">
        <Link href="/" className="hover:text-primary">
          Voltar ao site
        </Link>
        <span>
          {pageItems.length} exibidos · {filteredItems.length} filtrados
        </span>
      </div>
    </main>
  );
}
