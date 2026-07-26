import { GearItem } from "@/types/gear";

export default function GearItemCard({ item }: { item: GearItem }) {
  return (
    <div className="flex flex-col rounded-card border border-line bg-surface p-4">
      <h4 className="font-display text-sm font-bold leading-snug text-ink">{item.name}</h4>
      <p className="mt-1 text-xs text-muted">{item.price_range ?? "価格要確認"}</p>
      {item.product_url ? (
        <a
          href={item.product_url}
          target="_blank"
          rel="noopener noreferrer"
          className="focus-ring mt-3 inline-flex items-center justify-center rounded-sm bg-pine px-3 py-2 text-xs font-semibold text-mist transition-colors hover:bg-pine-dark"
        >
          公式ページを見る
        </a>
      ) : (
        <p className="mt-3 text-center text-[11px] text-muted">リンク準備中</p>
      )}
    </div>
  );
}
