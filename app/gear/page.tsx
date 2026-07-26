import { supabase } from "@/lib/supabase";
import { GearItem, GearRule } from "@/types/gear";
import GearFinder from "@/components/GearFinder";

export const revalidate = 3600;

type SimulatorHut = { id: number; name: string; price_text: string | null };

async function getGearItems(): Promise<GearItem[]> {
  const { data, error } = await supabase.from("gear_items").select("*").order("id", { ascending: true });
  if (error) {
    console.error("[getGearItems] Supabase error:", error.message);
    return [];
  }
  return (data ?? []) as GearItem[];
}

async function getGearRules(): Promise<GearRule[]> {
  const { data, error } = await supabase.from("gear_rules").select("*").order("id", { ascending: true });
  if (error) {
    console.error("[getGearRules] Supabase error:", error.message);
    return [];
  }
  return (data ?? []) as GearRule[];
}

async function getHutsForSimulator(): Promise<SimulatorHut[]> {
  const { data, error } = await supabase
    .from("huts")
    .select("id, name, price_text")
    .order("name", { ascending: true });
  if (error) {
    console.error("[getHutsForSimulator] Supabase error:", error.message);
    return [];
  }
  return (data ?? []) as SimulatorHut[];
}

export default async function GearPage({
  searchParams,
}: {
  searchParams: { hutId?: string };
}) {
  const [gearItems, gearRules, huts] = await Promise.all([
    getGearItems(),
    getGearRules(),
    getHutsForSimulator(),
  ]);
  const initialHutId = searchParams.hutId ? Number(searchParams.hutId) : null;

  return (
    <main>
      <section className="bg-charcoal">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <h1 className="font-display text-4xl font-black uppercase leading-[1.05] tracking-tight text-mist sm:text-5xl">
            装備診断・<span className="text-trail">総費用シミュレーター</span>
          </h1>
          <p className="mt-5 max-w-xl text-base text-mist/70">
            標高帯・季節・日帰り/宿泊を選ぶだけで、必要な装備と山小屋代を含めたおおよその総費用がわかります。
          </p>
        </div>
      </section>
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <GearFinder gearItems={gearItems} gearRules={gearRules} huts={huts} initialHutId={initialHutId} />
        <footer className="mt-16 border-t border-line pt-6 text-xs text-muted">
          <p>装備の要否・価格帯は目安です。天候・経験・体調に応じて必ずご自身で最終判断してください。</p>
        </footer>
      </div>
    </main>
  );
}
