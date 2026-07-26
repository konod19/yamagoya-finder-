import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Hut } from "@/types/hut";
import HutFinder from "@/components/HutFinder";

export const revalidate = 3600; // 1時間ごとに再取得(データ更新を反映)

async function getHuts(): Promise<Hut[]> {
  const { data, error } = await supabase
    .from("huts")
    .select("*")
    .order("id", { ascending: true });

  if (error) {
    console.error("[getHuts] Supabase error:", error.message);
    return [];
  }
  // 写真がある山小屋を先に表示する(Array.sortは安定ソートなので、id順は各グループ内で維持される)
  return ((data ?? []) as Hut[]).sort((a, b) => (a.image_url ? 0 : 1) - (b.image_url ? 0 : 1));
}

export default async function Home() {
  const huts = await getHuts();

  return (
    <main>
      <section className="relative overflow-hidden bg-charcoal">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://sysyrgcmltiwgdfitgno.supabase.co/storage/v1/object/public/hut-photos/hero-kitadake.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-charcoal/55" aria-hidden="true" />
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="mb-5 inline-flex items-center gap-2 rounded-sm border border-trail/40 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-trail-light">
            <span className="h-1.5 w-1.5 bg-trail" aria-hidden="true" />
            日本の山小屋データベース ・ {huts.length}件掲載中
          </div>
          <h1 className="font-display text-3xl font-black uppercase leading-[1.15] tracking-tight text-mist sm:text-6xl sm:leading-[1.05]">
            <span className="sm:hidden">
              あなたに合う山小屋を
              <br />
              迷わず<span className="text-trail">見つける。</span>
            </span>
            <span className="hidden sm:inline">
              あなたに合う
              <br />
              <span className="inline-block whitespace-nowrap">山小屋を迷わず</span><wbr /><span className="inline-block whitespace-nowrap text-trail">見つける。</span>
            </span>
          </h1>
          <p className="mt-5 max-w-xl text-base text-mist/70">
            <span className="inline-block whitespace-nowrap">エリア・標高・水場・電波の条件で絞り込んで</span>
            <br />
            <span className="inline-block whitespace-nowrap">次の登山で</span><wbr /><span className="inline-block whitespace-nowrap">泊まりやすい</span><wbr /><span className="inline-block whitespace-nowrap">山小屋を</span><wbr /><span className="inline-block whitespace-nowrap">探せます。</span>
          </p>
          <Link
            href="/gear"
            className="focus-ring mt-4 inline-block text-sm text-trail-light underline underline-offset-4 hover:text-trail"
          >
            → コスパ最強装備一覧を見る
          </Link>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <HutFinder huts={huts} />

        <footer className="mt-16 border-t border-line pt-6 text-xs text-muted">
          <p>
            料金・予約方法・営業期間は変更されることがあります。最終的な判断は必ず各山小屋の公式情報でご確認ください。
          </p>
        </footer>
      </div>
    </main>
  );
}
