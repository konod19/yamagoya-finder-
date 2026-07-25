"use client";

import { useMemo, useState } from "react";
import {
  Hut,
  ElevationTier,
  getElevationTier,
  hasFeature,
  DifficultyTier,
  getDifficultyTier,
  SummitTimeTier,
  getSummitTimeTier,
  HAZARD_TAGS,
  HazardTag,
  hasHazardTag,
} from "@/types/hut";
import HutCard from "./HutCard";
import { FilterChip } from "./FilterChip";

const ELEVATION_TIERS: ElevationTier[] = ["低山", "中山", "高山"];
const DIFFICULTY_TIERS: DifficultyTier[] = ["初級", "中級", "上級"];
const SUMMIT_TIME_TIERS: SummitTimeTier[] = ["4時間以下", "6時間以下", "8時間以下", "それ以上"];

export default function HutFinder({ huts }: { huts: Hut[] }) {
  const [query, setQuery] = useState("");
  const [area, setArea] = useState<string>("すべて");
  const [tier, setTier] = useState<ElevationTier | "すべて">("すべて");
  const [difficulty, setDifficulty] = useState<DifficultyTier | "すべて">("すべて");
  const [summitTime, setSummitTime] = useState<SummitTimeTier | "すべて">("すべて");
  const [waterOnly, setWaterOnly] = useState(false);
  const [signalOnly, setSignalOnly] = useState(false);
  const [excludedHazards, setExcludedHazards] = useState<Set<HazardTag>>(new Set());

  const areas = useMemo(() => {
    const set = new Set<string>();
    huts.forEach((h) => {
      if (h.area) set.add(h.area);
    });
    return ["すべて", ...Array.from(set).sort()];
  }, [huts]);

  const toggleHazard = (tag: HazardTag) => {
    setExcludedHazards((prev) => {
      const next = new Set(prev);
      if (next.has(tag)) {
        next.delete(tag);
      } else {
        next.add(tag);
      }
      return next;
    });
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return huts.filter((h) => {
      if (area !== "すべて" && h.area !== area) return false;
      if (tier !== "すべて" && getElevationTier(h.hut_elevation_text) !== tier) return false;
      if (difficulty !== "すべて" && getDifficultyTier(h) !== difficulty) return false;
      if (summitTime !== "すべて" && getSummitTimeTier(h.summit_time_hours_text) !== summitTime)
        return false;
      if (waterOnly && !hasFeature(h.water_info)) return false;
      if (signalOnly && !hasFeature(h.signal_info)) return false;
      if (
        excludedHazards.size > 0 &&
        HAZARD_TAGS.some((t) => excludedHazards.has(t) && hasHazardTag(h, t))
      )
        return false;
      if (q) {
        const haystack = `${h.name} ${h.mountain_name ?? ""} ${h.features ?? ""}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [huts, query, area, tier, difficulty, summitTime, waterOnly, signalOnly, excludedHazards]);

  const resetFilters = () => {
    setQuery("");
    setArea("すべて");
    setTier("すべて");
    setDifficulty("すべて");
    setSummitTime("すべて");
    setWaterOnly(false);
    setSignalOnly(false);
    setExcludedHazards(new Set());
  };

  const hasActiveFilters =
    query !== "" ||
    area !== "すべて" ||
    tier !== "すべて" ||
    difficulty !== "すべて" ||
    summitTime !== "すべて" ||
    waterOnly ||
    signalOnly ||
    excludedHazards.size > 0;

  return (
    <div>
      <div className="mb-8 rounded-card border border-line bg-surface p-5">
        <label className="flex flex-col gap-1.5 text-sm text-muted">
          小屋名・山名・特徴で検索
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="例: 稜線, 涸沢, テント"
            className="focus-ring rounded-md border border-line bg-mist px-3 py-2 text-sm text-ink"
          />
        </label>

        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
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
            標高帯(山小屋)
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

          <label className="flex flex-col gap-1.5 text-sm text-muted">
            難易度
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as DifficultyTier | "すべて")}
              className="focus-ring rounded-md border border-line bg-mist px-3 py-2 text-sm text-ink"
            >
              <option value="すべて">すべて</option>
              {DIFFICULTY_TIERS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1.5 text-sm text-muted">
            山頂までの目安時間
            <select
              value={summitTime}
              onChange={(e) => setSummitTime(e.target.value as SummitTimeTier | "すべて")}
              className="focus-ring rounded-md border border-line bg-mist px-3 py-2 text-sm text-ink"
            >
              <option value="すべて">すべて</option>
              {SUMMIT_TIME_TIERS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted">避けたい条件:</span>
          {HAZARD_TAGS.map((tagName) => (
            <FilterChip
              key={tagName}
              label={tagName}
              active={excludedHazards.has(tagName)}
              onClick={() => toggleHazard(tagName)}
            />
          ))}
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
              className="focus-ring ml-auto rounded-sm border border-line px-3 py-1.5 text-xs text-muted hover:border-pine hover:text-pine"
            >
              条件をリセット
            </button>
          )}
        </div>
      </div>

      <p className="mb-4 text-sm text-muted">{filtered.length} 件の山小屋</p>

      {filtered.length === 0 ? (
        <div className="rounded-card border border-dashed border-line bg-surface px-6 py-16 text-center">
          <p className="font-display text-lg font-bold text-ink">条件に合う山小屋が見つかりませんでした</p>
          <p className="mt-2 text-sm text-muted">
            エリアや標高帯を広げるか、検索キーワードを短くしてみてください。
          </p>
          <button
            onClick={resetFilters}
            className="focus-ring mt-5 rounded-sm bg-pine px-5 py-2 text-sm font-semibold text-mist hover:bg-pine-dark"
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
