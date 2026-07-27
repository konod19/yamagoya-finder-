export type Hut = {
  id: number;
  name: string;
  area: string | null;
  mountain_name: string | null;
  hut_elevation_text: string | null;
  summit_elevation_text: string | null;
  operating_period: string | null;
  season_open_text: string | null;
  season_close_text: string | null;
  capacity_text: string | null;
  reservation_method: string | null;
  water_info: string | null;
  signal_info: string | null;
  features: string | null;
  website_url: string | null;
  information_confidence: string | null;
  price_text: string | null;
  correction_note: string | null;
  image_url: string | null;
  image_credit: string | null;
  difficulty_tier: string | null;
  hazard_tags: string[];
  summit_time_hours_text: string | null;
  created_at: string | null;
};

export type ElevationTier = "低山" | "中山" | "高山" | "不明";

/** "約1984" のような文字列から標高(m)の数値を取り出す。取れなければ null。 */
export function parseElevationMeters(elevationText: string | null): number | null {
  if (!elevationText) return null;
  const match = elevationText.match(/(\d[\d,]*)/);
  if (!match) return null;
  const num = Number(match[1].replace(/,/g, ""));
  return Number.isFinite(num) ? num : null;
}

export function getElevationTier(elevationText: string | null): ElevationTier {
  const m = parseElevationMeters(elevationText);
  if (m === null) return "不明";
  if (m < 1500) return "低山";
  if (m < 2500) return "中山";
  return "高山";
}

/** "あり(雪渓・沢の水)" / "なし" / "不明" のような文字列から有無を判定 */
export function hasFeature(value: string | null): boolean {
  if (!value) return false;
  return value.trim().startsWith("あり");
}

/**
 * "1泊2食14000円/夕食のみ12600円..." のような長い料金テキストから
 * カードバッジ用の短い金額表示("¥14,000〜")を抽出する。
 * 抽出できない場合はnullを返す(呼び出し側で「料金要確認」等を表示)。
 */
export function getPriceBadge(priceText: string | null): string | null {
  if (!priceText) return null;
  const match = priceText.match(/([0-9][0-9,]{3,7})\s*円/);
  if (!match) return null;
  const num = Number(match[1].replace(/,/g, ""));
  if (!Number.isFinite(num) || num <= 0) return null;
  return `¥${num.toLocaleString("ja-JP")}〜`;
}

export type DifficultyTier = "初級" | "中級" | "上級" | "不明";

/** difficulty_tier の値を既知の3段階に正規化する。想定外の値は不明扱い。 */
export function getDifficultyTier(hut: Hut): DifficultyTier {
  const t = hut.difficulty_tier;
  if (t === "初級" || t === "中級" || t === "上級") return t;
  return "不明";
}

/** 情報確度バッジのドット色(HutCard・詳細ページで共有) */
export const CONFIDENCE_DOT: Record<string, string> = {
  高: "bg-blaze-high",
  中: "bg-blaze-mid",
  低: "bg-blaze-low",
};

/** 難易度バッジのスタイル(HutCard・詳細ページで共有) */
export const DIFFICULTY_BADGE_CLASS: Record<DifficultyTier, string> = {
  初級: "rounded-sm bg-pine/10 px-2.5 py-1 font-semibold text-pine",
  中級: "rounded-sm bg-mist px-2.5 py-1 font-semibold text-ink",
  上級: "rounded-sm bg-trail/10 px-2.5 py-1 font-semibold text-trail",
  不明: "",
};

export type SummitTimeTier = "4時間以下" | "6時間以下" | "8時間以下" | "それ以上" | "不明";

/** "6" や "約6.5" のような文字列から山頂までの目安時間(時間)を取り出す。取れなければnull。 */
export function parseSummitTimeHours(text: string | null): number | null {
  if (!text) return null;
  const match = text.match(/(\d+(\.\d+)?)/);
  if (!match) return null;
  const num = Number(match[1]);
  return Number.isFinite(num) ? num : null;
}

export function getSummitTimeTier(text: string | null): SummitTimeTier {
  const h = parseSummitTimeHours(text);
  if (h === null) return "不明";
  if (h <= 4) return "4時間以下";
  if (h <= 6) return "6時間以下";
  if (h <= 8) return "8時間以下";
  return "それ以上";
}

/** ハザードタグの正規セット(フィルターUI・カード表示で共有) */
export const HAZARD_TAGS = ["梯子あり", "鎖場あり", "ヘルメット推奨"] as const;
export type HazardTag = (typeof HAZARD_TAGS)[number];

/** hut.hazard_tags に指定タグが含まれるか判定 */
export function hasHazardTag(hut: Hut, tag: HazardTag): boolean {
  return hut.hazard_tags.includes(tag);
}
