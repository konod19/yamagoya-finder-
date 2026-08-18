"use client";

import { useMemo, useState } from "react";
import { Mountain } from "@/types/mountain";
import MountainCard from "./MountainCard";

export default function MountainFinder({ mountains }: { mountains: Mountain[] }) {
  const [query, setQuery] = useState("");
  const [prefecture, setPrefecture] = useState<string>("すべて");

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
      if (prefecture !== "すべて" && m.prefecture !== prefecture) return false;
      if (q) {
        const haystack = `${m.name} ${m.area ?? ""}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [mountains, query, prefecture]);

  const resetFilters = () => {
    setQuery("");
    setPrefecture("すべて");
  };

  const hasActiveFilters = query !== "" || prefecture !== "すべて";

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

        <div className="mt-4 grid grid-cols-1 gap-4 sm:max-w-xs">
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
          <p className="mt-2 text-sm text-muted">都道府県を広げるか、検索キーワードを短くしてみてください。</p>
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
