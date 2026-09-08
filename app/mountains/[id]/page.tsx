import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { DIFFICULTY_BADGE_CLASS, DifficultyTier, getElevationTier, CONFIDENCE_DOT } from "@/types/hut";
import { Mountain } from "@/types/mountain";
import { ContourPlaceholder } from "@/components/HutVisuals";
import { HutElevationProfile } from "@/components/MountainVisuals";

export const revalidate = 3600;

async function getMountain(id: number): Promise<Mountain | null> {
  const { data, error } = await supabase
    .from("mountains")
    .select(
      "id, name, area, elevation_text, difficulty_tier, prefecture, image_url, image_credit, course_time_text, trailhead_access_text, best_season_text, technical_notes_text, elevation_gain_text, highlights_text, fame_text, wildlife_text, information_confidence, huts(id, name, hut_elevation_text)"
    )
    .eq("id", id)
    .single();
  if (error || !data) return null;
  return data as Mountain;
}

export async function generateStaticParams() {
  const { data } = await supabase.from("mountains").select("id");
  return (data ?? []).map((m) => ({ id: String(m.id) }));
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const mountain = await getMountain(Number(params.id));
  if (!mountain) {
    return { title: "山が見つかりません | 山小屋ファインダー" };
  }
  const areaLabel = [mountain.prefecture, mountain.area].filter(Boolean).join(" ・ ");
  return {
    title: `${mountain.name}(${areaLabel}) | 山小屋ファインダー`,
    description: `${mountain.name}のコースタイム・登山口アクセス・登山適期・難所・見どころをまとめました。${areaLabel}にある山です。`,
  };
}

export default async function MountainDetailPage({ params }: { params: { id: string } }) {
  const mountain = await getMountain(Number(params.id));
  if (!mountain) notFound();

  const tier = getElevationTier(mountain.elevation_text);
  const difficulty = (mountain.difficulty_tier ?? "不明") as DifficultyTier;
  const confidenceDot = CONFIDENCE_DOT[mountain.information_confidence ?? "低"] ?? CONFIDENCE_DOT["低"];
  const hasMultipleHuts = mountain.huts.length > 1;

  return (
    <main>
      <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:px-8">
        <Link href="/" className="focus-ring text-sm text-muted hover:text-pine">
          ← 山から探すに戻る
        </Link>
      </div>

      <div className="mx-auto max-w-3xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="relative h-64 w-full overflow-hidden rounded-card sm:h-96">
          {mountain.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={mountain.image_url} alt={`${mountain.name}の写真`} className="h-full w-full object-cover" />
          ) : (
            <ContourPlaceholder tier={tier} />
          )}

          {mountain.image_url && mountain.image_credit && (
            <span className="absolute bottom-2 right-3 rounded-sm bg-ink/50 px-1.5 py-0.5 text-[11px] text-mist/90 backdrop-blur-sm">
              Photo: {mountain.image_credit}
            </span>
          )}

          {mountain.information_confidence && (
            <span
              className="absolute left-3 top-3 flex items-center gap-1.5 rounded-sm bg-ink/60 px-2.5 py-1 text-xs font-medium text-mist backdrop-blur-sm"
              title="この山の情報の信頼度の目安です"
            >
              <span className={`h-1.5 w-1.5 rounded-full ${confidenceDot}`} aria-hidden="true" />
              情報確度: {mountain.information_confidence}
            </span>
          )}
        </div>

        <h1 className="mt-6 font-display text-3xl font-black leading-snug text-ink sm:text-4xl">{mountain.name}</h1>
        <p className="mt-1 text-base text-muted">
          {[mountain.prefecture, mountain.area].filter(Boolean).join(" ・ ")}
        </p>

        {mountain.information_confidence === "低" && (
          <p className="mt-3 rounded-sm border border-trail/40 bg-trail/10 px-3 py-2 text-sm font-semibold text-trail">
            情報確度が低いため、必ず最新の登山情報でご確認ください
          </p>
        )}

        <div className="mt-4 flex flex-wrap gap-2 text-sm">
          <span className="rounded-sm bg-pine/10 px-3 py-1.5 font-semibold text-pine">
            {tier}
            {mountain.elevation_text ? `(標高${mountain.elevation_text}m)` : ""}
          </span>
          {difficulty !== "不明" && (
            <span className={DIFFICULTY_BADGE_CLASS[difficulty]}>難易度: {difficulty}</span>
          )}
          {mountain.fame_text && <span className="rounded-sm bg-mist px-3 py-1.5 text-muted">{mountain.fame_text}</span>}
        </div>

        <div className="mt-6 space-y-3 rounded-card border border-line bg-surface p-5 text-sm">
          {mountain.course_time_text && (
            <p>
              <span className="font-semibold text-ink">コースタイム: </span>
              <span className="text-muted">{mountain.course_time_text}</span>
            </p>
          )}
          {mountain.elevation_gain_text && (
            <p>
              <span className="font-semibold text-ink">累積標高差・距離: </span>
              <span className="text-muted">{mountain.elevation_gain_text}</span>
            </p>
          )}
          {mountain.trailhead_access_text && (
            <p>
              <span className="font-semibold text-ink">登山口・アクセス: </span>
              <span className="text-muted">{mountain.trailhead_access_text}</span>
            </p>
          )}
          {mountain.best_season_text && (
            <p>
              <span className="font-semibold text-ink">登山適期: </span>
              <span className="text-muted">{mountain.best_season_text}</span>
            </p>
          )}
        </div>

        {mountain.technical_notes_text && (
          <div className="mt-4 rounded-card border border-trail/30 bg-trail/5 p-5 text-sm">
            <p className="font-semibold text-trail">技術的な難所</p>
            <p className="mt-1 whitespace-pre-wrap text-ink/80">{mountain.technical_notes_text}</p>
          </div>
        )}

        {mountain.highlights_text && (
          <div className="mt-4">
            <p className="text-sm font-semibold text-ink">眺望・見どころ</p>
            <p className="mt-1 whitespace-pre-wrap text-sm text-ink/80">{mountain.highlights_text}</p>
          </div>
        )}

        {mountain.wildlife_text && (
          <div className="mt-4">
            <p className="text-sm font-semibold text-ink">野生動物に関する情報</p>
            <p className="mt-1 whitespace-pre-wrap text-sm text-ink/80">{mountain.wildlife_text}</p>
          </div>
        )}

        <div className="mt-8 border-t border-line pt-6">
          <p className="text-sm font-semibold text-ink">
            この山の山小屋
            <span className="ml-2 text-xs font-normal text-muted">{mountain.huts.length}件</span>
          </p>
          <div className="mt-4">
            {hasMultipleHuts ? (
              <HutElevationProfile huts={mountain.huts} />
            ) : (
              <div className="flex flex-wrap gap-2">
                {mountain.huts.map((hut) => (
                  <Link
                    key={hut.id}
                    href={`/huts/${hut.id}`}
                    className="focus-ring rounded-sm border border-line bg-mist px-2.5 py-1 text-sm text-ink transition-colors hover:border-pine hover:text-pine"
                  >
                    {hut.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        <p className="mt-8 border-t border-line pt-4 text-xs text-muted">
          コースタイムや登山適期は年により変動します。最終的な判断は必ず最新の公式情報・登山地図でご確認ください。
          情報の誤りに気づいた方は
          <Link href="/contact" className="text-trail underline underline-offset-2 hover:text-trail-dark">
            こちら
          </Link>
          からお知らせください。
        </p>
      </div>
    </main>
  );
}
