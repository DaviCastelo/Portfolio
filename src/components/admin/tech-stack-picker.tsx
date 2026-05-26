"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, Search, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  filterTechStackOptions,
  normalizeTechLabel,
  TECH_STACK_OPTIONS,
} from "@/data/tech-stack-options";
import { cn } from "@/lib/utils";

interface TechStackPickerProps {
  value: string[];
  onChange: (value: string[]) => void;
  id?: string;
  disabled?: boolean;
}

export function TechStackPicker({
  value,
  onChange,
  id: idProp,
  disabled = false,
}: TechStackPickerProps) {
  const autoId = useId();
  const id = idProp ?? autoId;
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(
    () => filterTechStackOptions(query, value),
    [query, value]
  );

  const trimmedQuery = query.trim();
  const canAddCustom =
    trimmedQuery.length > 0 &&
    !value.some((v) => v.toLowerCase() === trimmedQuery.toLowerCase()) &&
    !filtered.some((t) => t.toLowerCase() === trimmedQuery.toLowerCase());

  useEffect(() => {
    function onPointerDown(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  function addTech(raw: string) {
    const label = normalizeTechLabel(raw);
    if (!label) return;
    if (value.some((v) => v.toLowerCase() === label.toLowerCase())) return;
    onChange([...value, label]);
    setQuery("");
  }

  function removeTech(tech: string) {
    onChange(value.filter((v) => v !== tech));
  }

  return (
    <div ref={containerRef} className="relative space-y-2">
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {value.map((tech) => (
            <Badge
              key={tech}
              variant="secondary"
              className="gap-1 pr-1 font-normal"
            >
              {tech}
              <button
                type="button"
                disabled={disabled}
                onClick={() => removeTech(tech)}
                className="rounded-full p-0.5 hover:bg-background/80"
                aria-label={`Remover ${tech}`}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      <div className="relative">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <Input
          id={id}
          value={query}
          disabled={disabled}
          placeholder="Buscar tecnologia…"
          className="pl-10 pr-10"
          onFocus={() => setOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              if (filtered[0]) addTech(filtered[0]);
              else if (canAddCustom) addTech(trimmedQuery);
            }
            if (e.key === "Escape") setOpen(false);
          }}
          aria-expanded={open}
          aria-controls={`${id}-listbox`}
          aria-autocomplete="list"
          role="combobox"
        />
        <button
          type="button"
          disabled={disabled}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:bg-muted"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Fechar lista" : "Abrir lista"}
        >
          <ChevronDown
            className={cn("h-4 w-4 transition-transform", open && "rotate-180")}
          />
        </button>
      </div>

      {open && (
        <ul
          id={`${id}-listbox`}
          role="listbox"
          className="absolute z-50 mt-1 max-h-56 w-full overflow-y-auto rounded-lg border border-border bg-background py-1 shadow-lg"
        >
          {canAddCustom && (
            <li>
              <button
                type="button"
                role="option"
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-muted"
                onClick={() => addTech(trimmedQuery)}
              >
                <span className="text-muted-foreground">Adicionar:</span>
                <span className="font-medium">{trimmedQuery}</span>
              </button>
            </li>
          )}
          {filtered.length === 0 && !canAddCustom && (
            <li className="px-3 py-4 text-center text-sm text-muted-foreground">
              Nenhuma tecnologia encontrada
            </li>
          )}
          {filtered.map((tech) => (
            <li key={tech}>
              <button
                type="button"
                role="option"
                className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm hover:bg-muted"
                onClick={() => {
                  addTech(tech);
                  setOpen(true);
                }}
              >
                {tech}
                {value.includes(tech) && (
                  <Check className="h-4 w-4 shrink-0 text-primary" />
                )}
              </button>
            </li>
          ))}
          {!query && filtered.length > 0 && (
            <li className="border-t border-border px-3 py-2 text-xs text-muted-foreground">
              {TECH_STACK_OPTIONS.length}+ tecnologias · digite para filtrar
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
