import { GearItem } from "@/types/gear";

export default function GearItemCard({ item }: { item: GearItem }) {
  return (
    <div className="rounded-card border border-line bg-surface p-5">
      <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">{item.category}</div>
      <h3 className="font-display text-lg font-bold text-ink">{item.name ?? "選定中"}</h3>
      {item.price_range && <p className="mt-1 text-xs text-muted">{item.price_range}</p>}
      {item.review_text && (
        <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-ink/80">{item.review_text}</p>
      )}
      {item.product_url ? (
        <a
          href={item.product_url}
          target="_blank"
          rel="noopener noreferrer"
          className="focus-ring mt-4 inline-flex items-center justify-center rounded-sm bg-pine px-4 py-2 text-xs font-semibold text-mist transition-colors hover:bg-pine-dark"
        >
          公式ページを見る
        </a>
      ) : (
        <p className="mt-4 text-xs text-muted">リンク準備中</p>
      )}
    </div>
  );
}
