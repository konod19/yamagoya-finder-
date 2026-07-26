import { GearItem } from "@/types/gear";

export default function GearItemCard({ item }: { item: GearItem }) {
  return (
    <div className="flex flex-col rounded-card border border-line bg-surface p-4">
      <div className="flex items-start justify-between gap-2">
        <h4 className="font-display text-sm font-bold leading-snug text-ink">{item.name}</h4>
        <span className="shrink-0 rounded-sm bg-mist px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted">
          PR
        </span>
      </div>
      <p className="mt-1 text-xs text-muted">{item.price_range ?? "価格要確認"}</p>
      {item.affiliate_url ? (
        <a
          href={item.affiliate_url}
          target="_blank"
          rel="noopener noreferrer nofollow sponsored"
          className="focus-ring mt-3 inline-flex items-center justify-center rounded-sm bg-pine px-3 py-2 text-xs font-semibold text-mist transition-colors hover:bg-pine-dark"
        >
          商品を見る
        </a>
      ) : (
        <p className="mt-3 text-center text-[11px] text-muted">リンク準備中</p>
      )}
    </div>
  );
}
