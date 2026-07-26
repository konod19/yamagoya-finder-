import type { ElevationTier } from "@/types/hut";

export type GearCategory = "レイヤリング" | "雨具" | "灯り" | "防寒" | "行動食" | "登山保険";

/** 装備診断UIで使う正規カテゴリ一覧 */
export const GEAR_CATEGORIES: GearCategory[] = ["レイヤリング", "雨具", "灯り", "防寒", "行動食", "登山保険"];

export type Season = "春" | "夏" | "秋" | "冬";
export const SEASONS: Season[] = ["春", "夏", "秋", "冬"];

export type GearItem = {
  id: number;
  category: string;
  name: string;
  price_range: string | null;
  affiliate_url: string | null;
  applicable_tiers: string[];
  applicable_seasons: string[];
};

export type GearRule = {
  id: number;
  elevation_tier: string | null;
  season: string | null;
  overnight: boolean | null;
  required_categories: string[];
};

export type PriceRange = { min: number; max: number };

/** "8,000〜12,000円" のような範囲テキストから最小・最大額(円)を取り出す。単一額のみならmin=maxとして扱う。取れなければnull。 */
export function parsePriceRange(priceRangeText: string | null): PriceRange | null {
  if (!priceRangeText) return null;
  const range = priceRangeText.match(/([0-9][0-9,]*)\s*[〜~\-]\s*([0-9][0-9,]*)\s*円/);
  if (range) {
    const min = Number(range[1].replace(/,/g, ""));
    const max = Number(range[2].replace(/,/g, ""));
    if (Number.isFinite(min) && Number.isFinite(max)) return { min, max };
  }
  const single = priceRangeText.match(/([0-9][0-9,]{2,7})\s*円/);
  if (single) {
    const num = Number(single[1].replace(/,/g, ""));
    if (Number.isFinite(num)) return { min: num, max: num };
  }
  return null;
}

/** 複数の価格帯を合算する(null=金額不明はスキップ)。1件も取得できなければnull。 */
export function sumPriceRanges(ranges: (PriceRange | null)[]): PriceRange | null {
  const valid = ranges.filter((r): r is PriceRange => r !== null);
  if (valid.length === 0) return null;
  return valid.reduce((acc, r) => ({ min: acc.min + r.min, max: acc.max + r.max }), { min: 0, max: 0 });
}

/** PriceRangeを "¥8,000〜12,000" のような表示用文字列に整形する */
export function formatPriceRange(range: PriceRange | null): string {
  if (!range) return "金額未定";
  if (range.min === range.max) return `¥${range.min.toLocaleString("ja-JP")}`;
  return `¥${range.min.toLocaleString("ja-JP")}〜${range.max.toLocaleString("ja-JP")}`;
}

/**
 * 標高帯・季節・日帰り/宿泊からgear_rulesを照合し、必要な装備カテゴリ一覧を返す。
 * elevation_tier/season/overnightがnullのルールは「問わず適用」のワイルドカードとして扱い、
 * 最も具体的(null以外の項目数が多い)なルール1件を採用する。該当ルールがなければ空配列を返す。
 */
export function matchRequiredCategories(
  rules: GearRule[],
  tier: ElevationTier,
  season: Season,
  overnight: boolean
): string[] {
  const candidates = rules
    .filter((r) => r.elevation_tier === null || r.elevation_tier === tier)
    .filter((r) => r.season === null || r.season === season)
    .filter((r) => r.overnight === null || r.overnight === overnight)
    .map((r) => ({
      rule: r,
      specificity:
        (r.elevation_tier !== null ? 1 : 0) +
        (r.season !== null ? 1 : 0) +
        (r.overnight !== null ? 1 : 0),
    }))
    .sort((a, b) => b.specificity - a.specificity);

  return candidates.length > 0 ? candidates[0].rule.required_categories : [];
}

/** カテゴリ・標高帯・季節に該当する装備アイテムを絞り込み、上位limit件を返す(タグ未設定の項目は「全標高帯/全季節対応」として通す) */
export function pickGearItems(
  items: GearItem[],
  category: string,
  tier: ElevationTier,
  season: Season,
  limit = 3
): GearItem[] {
  return items
    .filter(
      (it) =>
        it.category === category &&
        (it.applicable_tiers.length === 0 || it.applicable_tiers.includes(tier)) &&
        (it.applicable_seasons.length === 0 || it.applicable_seasons.includes(season))
    )
    .slice(0, limit);
}
