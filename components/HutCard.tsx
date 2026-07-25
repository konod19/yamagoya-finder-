import { Hut, getElevationTier, hasFeature } from "@/types/hut";

const CONFIDENCE_STYLE: Record<string, { dot: string; label: string }> = {
  高: { dot: "bg-blaze-high", label: "情報確度: 高" },
  中: { dot: "bg-blaze-mid", label: "情報確度: 中" },
  低: { dot: "bg-blaze-low", label: "情報確度: 低" },
};

export default function HutCard({ hut }: { hut: Hut }) {
  const tier = getElevationTier(hut.elevation_text);
  const water = hasFeature(hut.water_info);
  const signal = hasFeature(hut.signal_info);
  const confidence =
    hut.information_confidence && CONFIDENCE_STYLE[hut.information_confidence]
      ? CONFIDENCE_STYLE[hut.information_confidence]
      : CONFIDENCE_STYLE["低"];

  return (
    <article className="flex flex-col rounded-card border border-line bg-surface p-5 transition-shadow hover:shadow-md">
      <div className="mb-3 flex items-start justify-between gap-3">
        <h3 className="font-display text-lg leading-snug text-ink">{hut.name}</h3>
        <span
          className="flex shrink-0 items-center gap-1.5 rounded-full border border-line px-2 py-1 text-[11px] text-muted"
          title="この小屋の情報の信頼度の目安です"
        >
          <span className={`h-2 w-2 rounded-full ${confidence.dot}`} aria-hidden="true" />
          {confidence.label}
        </span>
      </div>

      <p className="mb-3 text-sm text-muted">
        {hut.area}
        {hut.mountain_name ? ` ・ ${hut.mountain_name}` : ""}
      </p>

      <div className="mb-4 flex flex-wrap gap-2 text-xs">
        <span className="rounded-full bg-pine/10 px-2.5 py-1 font-mono text-pine">
          {tier}
          {hut.elevation_text ? `(${hut.elevation_text}m)` : ""}
        </span>
        {hut.operating_period && (
          <span className="rounded-full bg-mist px-2.5 py-1 text-muted">{hut.operating_period}</span>
        )}
      </div>

      <dl className="mb-4 grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs text-muted">
        <div className="flex items-center gap-1.5">
          <span aria-hidden="true">{water ? "💧" : "・"}</span>
          <span>水場 {water ? "あり" : hut.water_info === "不明" ? "不明" : "なし"}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span aria-hidden="true">{signal ? "📶" : "・"}</span>
          <span>電波 {signal ? "あり" : hut.signal_info === "不明" ? "不明" : "なし"}</span>
        </div>
      </dl>

      {hut.features && (
        <p className="mb-3 line-clamp-2 text-sm text-ink/80">{hut.features}</p>
      )}

      <div className="mt-auto space-y-1.5 border-t border-line pt-3 text-xs text-muted">
        {hut.price_text && (
          <p>
            <span className="text-ink">料金: </span>
            {hut.price_text}
          </p>
        )}
        {hut.reservation_method && (
          <p>
            <span className="text-ink">予約: </span>
            {hut.reservation_method}
          </p>
        )}
      </div>

      {hut.website_url && hut.website_url !== "不明" ? (
        <a
          href={hut.website_url}
          target="_blank"
          rel="noopener noreferrer"
          className="focus-ring mt-4 inline-flex items-center justify-center rounded-full bg-pine px-4 py-2 text-sm text-mist transition-colors hover:bg-pine-dark"
        >
          公式サイトを見る
        </a>
      ) : (
        <p className="mt-4 text-center text-xs text-muted">公式サイト未確認</p>
      )}

      {hut.correction_note && (
        <p className="mt-3 text-[11px] leading-relaxed text-muted">
          補足: {hut.correction_note}
        </p>
      )}
    </article>
  );
}
