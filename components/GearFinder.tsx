"use client";

import { useMemo, useState } from "react";
import { ElevationTier, getPriceRange } from "@/types/hut";
import {
  GearItem,
  GearRule,
  Season,
  SEASONS,
  PriceRange,
  matchRequiredCategories,
  pickGearItems,
  parsePriceRange,
  sumPriceRanges,
  formatPriceRange,
} from "@/types/gear";
import GearItemCard from "./GearItemCard";

const ELEVATION_TIERS: ElevationTier[] = ["低山", "中山", "高山"];

type SimulatorHut = { id: number; name: string; price_text: string | null };

export default function GearFinder({
  gearItems,
  gearRules,
  huts,
  initialHutId,
}: {
  gearItems: GearItem[];
  gearRules: GearRule[];
  huts: SimulatorHut[];
  initialHutId: number | null;
}) {
  const [tier, setTier] = useState<ElevationTier>("中山");
  const [season, setSeason] = useState<Season>("夏");
  const [overnight, setOvernight] = useState(true);
  const [selectedHutId, setSelectedHutId] = useState<number | "">(initialHutId ?? "");

  const requiredCategories = useMemo(
    () => matchRequiredCategories(gearRules, tier, season, overnight),
    [gearRules, tier, season, overnight]
  );

  const itemsByCategory = useMemo(() => {
    const map = new Map<string, GearItem[]>();
    requiredCategories.forEach((cat) => map.set(cat, pickGearItems(gearItems, cat, tier, season, 3)));
    return map;
  }, [gearItems, requiredCategories, tier, season]);

  const gearTotal = useMemo(() => {
    const perCategoryRanges: (PriceRange | null)[] = [];
    itemsByCategory.forEach((items) => {
      const parsed = items
        .map((it) => parsePriceRange(it.price_range))
        .filter((r): r is PriceRange => r !== null);
      if (parsed.length > 0) {
        perCategoryRanges.push({
          min: Math.min(...parsed.map((r) => r.min)),
          max: Math.max(...parsed.map((r) => r.max)),
        });
      }
    });
    return sumPriceRanges(perCategoryRanges);
  }, [itemsByCategory]);

  const selectedHut = huts.find((h) => h.id === selectedHutId);
  const hutRange = selectedHut ? getPriceRange(selectedHut.price_text) : null;
  const combinedTotal = sumPriceRanges([gearTotal, hutRange]);

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

      <div className="mb-8 rounded-card border border-line bg-surface p-5">
        <p className="mb-4 flex items-center gap-2 text-xs text-muted">
          <span className="rounded-sm bg-mist px-2 py-0.5 font-semibold uppercase tracking-wide text-muted">
            PR
          </span>
          本ページで紹介する商品にはアフィリエイト広告を含みます。
        </p>
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

      <div className="rounded-card border border-line bg-surface p-5">
        <h2 className="mb-4 font-display text-lg font-bold text-ink">総費用シミュレーター</h2>
        <label className="flex flex-col gap-1.5 text-sm text-muted">
          宿泊する山小屋を選ぶ(任意)
          <select
            value={selectedHutId}
            onChange={(e) => setSelectedHutId(e.target.value ? Number(e.target.value) : "")}
            className="focus-ring rounded-md border border-line bg-mist px-3 py-2 text-sm text-ink"
          >
            <option value="">選択しない(装備費のみ表示)</option>
            {huts.map((h) => (
              <option key={h.id} value={h.id}>
                {h.name}
              </option>
            ))}
          </select>
        </label>

        <div className="mt-4 space-y-1.5 border-t border-line pt-4 text-sm text-muted">
          <p>
            装備費(目安): <span className="font-semibold text-ink">{formatPriceRange(gearTotal)}</span>
          </p>
          {selectedHut && (
            <p>
              山小屋代(目安):{" "}
              <span className="font-semibold text-ink">
                {hutRange ? formatPriceRange(hutRange) : "料金要確認"}
              </span>
            </p>
          )}
        </div>

        <p className="mt-4 font-display text-xl font-black text-trail">
          {combinedTotal ? `${formatPriceRange(combinedTotal)}程度` : "金額未定"}
          <span className="ml-2 text-sm font-normal text-muted">(交通費別)</span>
        </p>
      </div>
    </div>
  );
}
