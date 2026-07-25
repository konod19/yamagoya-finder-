import { Hut, getElevationTier, hasFeature, getPriceBadge } from "@/types/hut";

const CONFIDENCE_DOT: Record<string, string> = {
  高: "bg-blaze-high",
  中: "bg-blaze-mid",
  低: "bg-blaze-low",
};

const TIER_GRADIENT: Record<string, string> = {
  低山: "from-tier-low/70 to-tier-low/30",
  中山: "from-tier-mid/70 to-tier-mid/30",
  高山: "from-tier-high/70 to-tier-high/30",
  不明: "from-muted/50 to-muted/20",
};

function DropIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-3.5 w-3.5" aria-hidden="true">
      <path
        d="M10 2c2.5 3.2 5.5 6.8 5.5 10a5.5 5.5 0 1 1-11 0c0-3.2 3-6.8 5.5-10Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SignalIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-3.5 w-3.5" aria-hidden="true">
      <path d="M3 15h2v3H3v-3Z" fill="currentColor" />
      <path d="M8 11h2v7H8v-7Z" fill="currentColor" />
      <path d="M13 7h2v11h-2V7Z" fill="currentColor" />
      <path d="M18 3h2v15h-2V3Z" fill="currentColor" opacity="0.35" />
    </svg>
  );
}

function MountainGlyph() {
  return (
    <svg viewBox="0 0 200 100" className="absolute inset-x-0 bottom-0 h-full w-full" aria-hidden="true">
      <polygon points="0,100 55,35 90,65 130,15 200,100" fill="rgba(255,255,255,0.22)" />
      <polygon points="0,100 40,55 80,100" fill="rgba(255,255,255,0.15)" />
    </svg>
  );
}

export default function HutCard({ hut }: { hut: Hut }) {
  const tier = getElevationTier(hut.elevation_text);
  const water = hasFeature(hut.water_info);
  const signal = hasFeature(hut.signal_info);
  const confidenceDot = CONFIDENCE_DOT[hut.information_confidence ?? "低"] ?? CONFIDENCE_DOT["低"];
  const priceBadge = getPriceBadge(hut.price_text);

  return (
    <article className="group flex flex-col overflow-hidden rounded-card border border-line bg-surface transition-all duration-200 hover:-translate-y-1 hover:shadow-xl">
      <div className={`relative h-36 w-full overflow-hidden bg-gradient-to-br ${TIER_GRADIENT[tier]}`}>
        {hut.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={hut.image_url}
            alt={`${hut.name}の写真`}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <MountainGlyph />
        )}

        <span
          className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-ink/55 px-2.5 py-1 text-[11px] font-medium text-mist backdrop-blur-sm"
          title="この小屋の情報の信頼度の目安です"
        >
          <span className={`h-1.5 w-1.5 rounded-full ${confidenceDot}`} aria-hidden="true" />
          情報確度: {hut.information_confidence ?? "低"}
        </span>

        <span className="absolute right-3 top-3 rounded-full bg-trail px-3 py-1 text-xs font-bold text-white shadow-sm">
          {priceBadge ?? "料金要確認"}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg font-bold leading-snug text-ink">{hut.name}</h3>
        <p className="mt-1 text-sm text-muted">
          {hut.area}
          {hut.mountain_name ? ` ・ ${hut.mountain_name}` : ""}
        </p>

        <div className="mt-3 flex flex-wrap gap-2 text-xs">
          <span className="rounded-full bg-pine/10 px-2.5 py-1 font-semibold tabular-nums text-pine">
            {tier}
            {hut.elevation_text ? `(${hut.elevation_text}m)` : ""}
          </span>
          {hut.operating_period && (
            <span className="rounded-full bg-mist px-2.5 py-1 text-muted">{hut.operating_period}</span>
          )}
        </div>

        <div className="mt-3 flex items-center gap-4 text-xs text-muted">
          <span className="flex items-center gap-1.5">
            <DropIcon />
            水場 {water ? "あり" : hut.water_info === "不明" ? "不明" : "なし"}
          </span>
          <span className="flex items-center gap-1.5">
            <SignalIcon />
            電波 {signal ? "あり" : hut.signal_info === "不明" ? "不明" : "なし"}
          </span>
        </div>

        {hut.features && (
          <p className="mt-3 line-clamp-2 text-sm text-ink/80">{hut.features}</p>
        )}

        <div className="mt-4 space-y-1.5 border-t border-line pt-3 text-xs text-muted">
          {hut.price_text && (
            <p className="line-clamp-1">
              <span className="font-semibold text-ink">料金: </span>
              {hut.price_text}
            </p>
          )}
          {hut.reservation_method && (
            <p className="line-clamp-1">
              <span className="font-semibold text-ink">予約: </span>
              {hut.reservation_method}
            </p>
          )}
        </div>

        {hut.website_url && hut.website_url !== "不明" ? (
          <a
            href={hut.website_url}
            target="_blank"
            rel="noopener noreferrer"
            className="focus-ring mt-4 inline-flex items-center justify-center rounded-full bg-pine px-4 py-2.5 text-sm font-semibold text-mist transition-colors hover:bg-pine-dark"
          >
            公式サイトを見る
          </a>
        ) : (
          <p className="mt-4 text-center text-xs text-muted">公式サイト未確認</p>
        )}

        {hut.correction_note && (
          <p className="mt-3 text-[11px] leading-relaxed text-muted">補足: {hut.correction_note}</p>
        )}
      </div>
    </article>
  );
}
