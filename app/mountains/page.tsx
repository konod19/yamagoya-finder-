import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { DIFFICULTY_BADGE_CLASS, DifficultyTier } from "@/types/hut";
import { Mountain } from "@/types/mountain";

export const revalidate = 3600;

export const metadata = {
  title: "山から山小屋を探す | 山小屋ファインダー",
  description: "山ごとに山小屋をまとめて比較できます。同じ山にある複数の小屋の違いが一目でわかります。",
};

async function getMountains(): Promise<Mountain[]> {
  const { data, error } = await supabase
    .from("mountains")
    .select("id, name, area, elevation_text, difficulty_tier, huts(id, name)")
    .order("name", { ascending: true });

  if (error) {
    console.error("[getMountains] Supabase error:", error.message);
    return [];
  }
  const mountains = (data ?? []) as Mountain[];
  // 小屋が複数ある山(比較価値が高い)を先に表示
  return [...mountains].sort((a, b) => b.huts.length - a.huts.length);
}

export default async function MountainsPage() {
  const mountains = await getMountains();

  return (
    <main>
      <section className="bg-charcoal">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <h1 className="font-display text-3xl font-black uppercase leading-[1.1] tracking-tight text-mist sm:text-4xl">
            山から<span className="text-trail">山小屋</span>を探す
          </h1>
          <p className="mt-5 max-w-xl text-base text-mist/70">
            登る山が決まっている方向けに、山ごとに山小屋をまとめました。同じ山にある小屋同士を比較したいときにご利用ください。
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <p className="text-sm text-muted">{mountains.length} 座の山を掲載中</p>

        <div className="mt-6 divide-y divide-line border-t border-line">
          {mountains.map((mountain) => {
            const difficulty = (mountain.difficulty_tier ?? "不明") as DifficultyTier;
            return (
              <div key={mountain.id} className="py-5">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <h2 className="font-display text-lg font-extrabold text-ink">{mountain.name}</h2>
                  {mountain.area && <span className="text-sm text-muted">{mountain.area}</span>}
                  {mountain.elevation_text && (
                    <span className="text-sm text-muted">標高{mountain.elevation_text}m</span>
                  )}
                  {difficulty !== "不明" && (
                    <span className={DIFFICULTY_BADGE_CLASS[difficulty]}>難易度: {difficulty}</span>
                  )}
                  <span className="text-xs text-muted">・小屋{mountain.huts.length}件</span>
                </div>
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {mountain.huts.map((hut) => (
                    <Link
                      key={hut.id}
                      href={`/huts/${hut.id}`}
                      className="focus-ring rounded-sm border border-line bg-surface px-3 py-1.5 text-sm text-ink transition-colors hover:border-pine hover:text-pine"
                    >
                      {hut.name}
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <footer className="mt-16 border-t border-line pt-6 text-xs text-muted">
          <p>
            <Link href="/" className="text-trail underline underline-offset-2 hover:text-trail-dark">
              山小屋一覧に戻る
            </Link>
          </p>
        </footer>
      </div>
    </main>
  );
}
