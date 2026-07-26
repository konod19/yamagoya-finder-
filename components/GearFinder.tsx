"use client";

import { useMemo, useState } from "react";
import { ElevationTier } from "@/types/hut";
import { GearItem, GearRule, Season, SEASONS, matchRequiredCategories, pickGearItems } from "@/types/gear";
import GearItemCard from "./GearItemCard";

const ELEVATION_TIERS: ElevationTier[] = ["低山", "中山", "高山"];

export default function GearFinder({
  gearItems,
  gearRules,
}: {
  gearItems: GearItem[];
  gearRules: GearRule[];
}) {
  const [tier, setTier] = useState<ElevationTier>("中山");
  const [season, setSeason] = useState<Season>("夏");
  const [overnight, setOvernight] = useState(true);

  const requiredCategories = useMemo(
    () => matchRequiredCategories(gearRules, tier, season, overnight),
    [gearRules, tier, season, overnight]
  );

  const itemsByCategory = useMemo(() => {
    const map = new Map<string, GearItem[]>();
    requiredCategories.forEach((cat) => map.set(cat, pickGearItems(gearItems, cat, tier, season, 3)));
    return map;
  }, [gearItems, requiredCategories, tier, season]);

  return (
    <div>
      <div className="mb-8 rounded-card border border-line bg-surface p-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <label className="flex flex-col gap-1.5 text-sm text-muted">
            標高帯
            <select
              value={tier}
              onChange={(e) => setTier(e.target.value as ElevationTier)}
              className="focus-ring rounded-md border border-line bg-mist px-3 py-2 text-sm text-ink"
            >
              {ELEVATION_TIERS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1.5 text-sm text-muted">
            季節
            <select
              value={season}
              onChange={(e) => setSeason(e.target.value as Season)}
              className="focus-ring rounded-md border border-line bg-mist px-3 py-2 text-sm text-ink"
            >
              {SEASONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1.5 text-sm text-muted">
            日帰り / 宿泊
            <select
              value={overnight ? "宿泊" : "日帰り"}
              onChange={(e) => setOvernight(e.target.value === "宿泊")}
              className="focus-ring rounded-md border border-line bg-mist px-3 py-2 text-sm text-ink"
            >
              <option value="日帰り">日帰り</option>
              <option value="宿泊">宿泊(山小屋泊)</option>
            </select>
          </label>
        </div>
      </div>

      <div className="rounded-card border border-line bg-surface p-5">
        {requiredCategories.length === 0 ? (
          <p className="text-sm text-muted">条件に合う装備ルールが見つかりませんでした。</p>
        ) : (
          requiredCategories.map((cat) => (
            <div key={cat} className="mb-6 last:mb-0">
              <h3 className="mb-2 font-display text-base font-bold text-ink">{cat}</h3>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {(itemsByCategory.get(cat) ?? []).map((item) => (
                  <GearItemCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
