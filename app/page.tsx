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
      <section className="bg-charcoal">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="mb-5 inline-flex items-center gap-2 rounded-sm border border-trail/40 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-trail-light">
            <span className="h-1.5 w-1.5 bg-trail" aria-hidden="true" />
            日本の山小屋データベース ・ {huts.length}件掲載中
          </div>
          <h1 className="font-display text-4xl font-black uppercase leading-[1.05] tracking-tight text-mist sm:text-6xl">
            あなたに合う
            <br />
            山小屋を、迷わず<span className="text-trail">見つける。</span>
          </h1>
          <p className="mt-5 max-w-xl text-base text-mist/70">
            エリア・標高・水場・電波の条件で絞り込んで、次の登山で泊まりやすい山小屋を探せます。
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
