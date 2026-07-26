/** 装備一覧ページで扱うカテゴリの正規順序(表示順=sort_order) */
export const GEAR_CATEGORIES = [
  "ヘッドライト",
  "帽子",
  "サングラス",
  "ベースレイヤー",
  "フリース",
  "ダウン",
  "シェルジャケット",
  "レインジャケット",
  "パンツ",
  "レインパンツ",
  "靴下",
  "靴",
  "ザック/バックパック",
  "軍手",
  "ゲイター/スパッツ",
] as const;

export type GearItem = {
  id: number;
  category: string;
  name: string | null;
  price_range: string | null;
  product_url: string | null;
  review_text: string | null;
  sort_order: number | null;
};
