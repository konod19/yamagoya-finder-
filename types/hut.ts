export type Hut = {
  id: number;
  name: string;
  area: string | null;
  mountain_name: string | null;
  elevation_text: string | null;
  operating_period: string | null;
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
