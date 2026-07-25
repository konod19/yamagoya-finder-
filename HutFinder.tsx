"use client";

import { useMemo, useState } from "react";
import { Hut, ElevationTier, getElevationTier, hasFeature } from "@/types/hut";
import HutCard from "./HutCard";

const ELEVATION_TIERS: ElevationTier[] = ["低山", "中山", "高山"];

export default function HutFinder({ huts }: { huts: Hut[] }) {
  const [query, setQuery] = useState("");
  const [area, setArea] = useState<string>("すべて");
  const [tier, setTier] = useState<ElevationTier | "すべて">("すべて");
  const [waterOnly, setWaterOnly] = useState(false);
  const [signalOnly, setSignalOnly] = useState(false);

  const areas = useMemo(() => {
    const set = new Set<string>();
    huts.forEach((h) => {
      if (h.area) set.add(h.area);
    });
    return ["すべて", ...Array.from(set).sort()];
  }, [huts]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return huts.filter((h) => {
      if (area !== "すべて" && h.area !== area) return false;
      if (tier !== "すべて" && getElevationTier(h.elevation_text) !== tier) return false;
      if (waterOnly && !hasFeature(h.water_info)) return false;
      if (signalOnly && !hasFeature(h.signal_info)) return false;
      if (q) {
        const haystack = `${h.name} ${h.mountain_name ?? ""} ${h.features ?? ""}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [huts, query, area, tier, waterOnly, signalOnly]);

  const resetFilters = () => {
    setQuery("");
    setArea("すべて");
    setTier("すべて");
    setWaterOnly(false);
    setSignalOnly(false);
  };

  const hasActiveFilters =
    query !== "" || area !== "すべて" || tier !== "すべて" || waterOnly || signalOnly;

  return (
    <div>
      <div className="mb-8 rounded-card border border-line bg-surface p-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <label className="flex flex-col gap-1.5 text-sm text-muted lg:col-span-2">
            小屋名・山名・特徴で検索
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="例: 稜線, 涸沢, テント"
              className="focus-ring rounded-md border border-line bg-mist px-3 py-2 text-sm text-ink"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-sm text-muted">
            エリア
            <select
              value={area}
              onChange={(e) => setArea(e.target.value)}
              className="focus-ring rounded-md border border-line bg-mist px-3 py-2 text-sm text-ink"
            >
              {areas.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1.5 text-sm text-muted">
            標高帯
            <select
              value={tier}
              onChange={(e) => setTier(e.target.value as ElevationTier | "すべて")}
              className="focus-ring rounded-md border border-line bg-mist px-3 py-2 text-sm text-ink"
            >
              <option value="すべて">すべて</option>
              {ELEVATION_TIERS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-2 text-sm text-ink">
            <input
              type="checkbox"
              checked={waterOnly}
              onChange={(e) => setWaterOnly(e.target.checked)}
              className="focus-ring h-4 w-4 accent-pine"
            />
            水場ありのみ
          </label>
          <label className="flex items-center gap-2 text-sm text-ink">
            <input
              type="checkbox"
              checked={signalOnly}
              onChange={(e) => setSignalOnly(e.target.checked)}
              className="focus-ring h-4 w-4 accent-pine"
            />
            電波ありのみ
          </label>

          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="focus-ring ml-auto rounded-full border border-line px-3 py-1.5 text-xs text-muted hover:border-pine hover:text-pine"
            >
              条件をリセット
            </button>
          )}
        </div>
      </div>

      <p className="mb-4 text-sm text-muted">{filtered.length} 件の山小屋</p>

      {filtered.length === 0 ? (
        <div className="rounded-card border border-dashed border-line bg-surface px-6 py-16 text-center">
          <p className="font-display text-lg text-ink">条件に合う山小屋が見つかりませんでした</p>
          <p className="mt-2 text-sm text-muted">
            エリアや標高帯を広げるか、検索キーワードを短くしてみてください。
          </p>
          <button
            onClick={resetFilters}
            className="focus-ring mt-5 rounded-full bg-pine px-5 py-2 text-sm text-mist hover:bg-pine-dark"
          >
            条件をリセット
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((hut) => (
            <HutCard key={hut.id} hut={hut} />
          ))}
        </div>
      )}
    </div>
  );
}
