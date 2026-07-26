import { supabase } from "@/lib/supabase";
import { GearItem } from "@/types/gear";
import GearItemCard from "@/components/GearItemCard";

export const revalidate = 3600;

async function getGearItems(): Promise<GearItem[]> {
  const { data, error } = await supabase
    .from("gear_items")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) {
    console.error("[getGearItems] Supabase error:", error.message);
    return [];
  }
  return (data ?? []) as GearItem[];
}

export default async function GearPage() {
  const gearItems = await getGearItems();

  return (
    <main>
      <section className="bg-charcoal">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <h1 className="font-display text-4xl font-black uppercase leading-[1.05] tracking-tight text-mist sm:text-5xl">
            コスパ<span className="text-trail">最強装備</span>一覧
          </h1>
          <p className="mt-5 max-w-xl text-base text-mist/70">
            持ち物カテゴリごとに、個人的に選んだおすすめを1つだけ紹介します。
          </p>
        </div>
      </section>
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {gearItems.map((item, index) => (
            <GearItemCard key={item.id} item={item} index={index} />
          ))}
        </div>
        <footer className="mt-16 border-t border-line pt-6 text-xs text-muted">
          <p>紹介する装備・価格帯は目安です。天候・経験・体調に応じて必ずご自身で最終判断してください。</p>
        </footer>
      </div>
    </main>
  );
}
