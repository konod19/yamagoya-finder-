"use client";

import { useMemo, useState } from "react";
import { DifficultyTier, ElevationTier, getElevationTier } from "@/types/hut";
import { Mountain } from "@/types/mountain";
import MountainCard from "./MountainCard";

const ELEVATION_TIERS: ElevationTier[] = ["低山", "中山", "高山"];
const ELEVATION_TIER_LABELS: Record<ElevationTier, string> = {
  低山: "低山(1500m未満)",
  中山: "中山(1500〜2500m)",
  高山: "高山(2500m以上)",
  不明: "不明",
};
const DIFFICULTY_TIERS: DifficultyTier[] = ["初級", "中級", "上級"];

export default function MountainFinder({ mountains }: { mountains: Mountain[] }) {
  const [query, setQuery] = useState("");
  const [area, setArea] = useState<string>("すべて");
  const [prefecture, setPrefecture] = useState<string>("すべて");
  const [tier, setTier] = useState<ElevationTier | "すべて">("すべて");
  const [difficulty, setDifficulty] = useState<DifficultyTier | "すべて">("すべて");

  const areas = useMemo(() => {
    const set = new Set<string>();
    mountains.forEach((m) => {
      if (m.area) set.add(m.area);
    });
    return ["すべて", ...Array.from(set).sort()];
  }, [mountains]);

  const prefectures = useMemo(() => {
    const set = new Set<string>();
    mountains.forEach((m) => {
      if (m.prefecture) set.add(m.prefecture);
    });
    return ["すべて", ...Array.from(set).sort()];
  }, [mountains]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return mountains.filter((m) => {
      if (area !== "すべて" && m.area !== area) return false;
      if (prefecture !== "すべて" && m.prefecture !== prefecture) return false;
      if (tier !== "すべて" && getElevationTier(m.elevation_text) !== tier) return false;
      if (difficulty !== "すべて" && m.difficulty_tier !== difficulty) return false;
      if (q) {
        const haystack = `${m.name} ${m.area ?? ""}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [mountains, query, area, prefecture, tier, difficulty]);

  const resetFilters = () => {
    setQuery("");
    setArea("すべて");
    setPrefecture("すべて");
    setTier("すべて");
    setDifficulty("すべて");
  };

  const hasActiveFilters =
    query !== "" ||
    area !== "すべて" ||
    prefecture !== "すべて" ||
    tier !== "すべて" ||
    difficulty !== "すべて";

  return (
    <div>
      <div className="mb-8 rounded-card border border-line bg-surface p-5">
        <label className="flex flex-col gap-1.5 text-sm text-muted">
          山名・エリアで検索
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="例: 槍ヶ岳, 八ヶ岳"
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
            都道府県(登山口・駐車場基準)
            <select
              value={prefecture}
              onChange={(e) => setPrefecture(e.target.value)}
              className="focus-ring rounded-md border border-line bg-mist px-3 py-2 text-sm text-ink"
            >
              {prefectures.map((p) => (
                <option key={p} value={p}>
                  {p}
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
                  {ELEVATION_TIER_LABELS[t]}
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
        </div>

        {hasActiveFilters && (
          <div className="mt-4 flex justify-end">
            <button
              onClick={resetFilters}
              className="focus-ring rounded-sm border border-line px-3 py-1.5 text-xs text-muted hover:border-pine hover:text-pine"
            >
              条件をリセット
            </button>
          </div>
        )}
      </div>

      <p className="mb-4 text-sm text-muted">{filtered.length} 座の山を掲載中</p>

      {filtered.length === 0 ? (
        <div className="rounded-card border border-dashed border-line bg-surface px-6 py-16 text-center">
          <p className="font-display text-lg font-bold text-ink">条件に合う山が見つかりませんでした</p>
          <p className="mt-2 text-sm text-muted">エリアや標高帯を広げるか、検索キーワードを短くしてみてください。</p>
          <button
            onClick={resetFilters}
            className="focus-ring mt-5 rounded-sm bg-pine px-5 py-2 text-sm font-semibold text-mist hover:bg-pine-dark"
          >
            条件をリセット
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((mountain) => (
            <MountainCard key={mountain.id} mountain={mountain} />
          ))}
        </div>
      )}
    </div>
  );
}
