# 山小屋ファインダー(yamagoya-finder)

## プロジェクトの目的

登山初心者〜中級者向けに「あなたに合う山小屋」を提案するWebサイト。
以下2つの入口から山小屋情報を探せる。

- `/huts` : 山小屋そのものを検索(エリア・標高帯・難易度・山頂までの目安時間・水場/電波の有無・避けたい条件で絞り込み)
- `/` (トップページ) : 「山」を起点に、その山にある山小屋を比較しながら探す。個々の山の詳細ページ(`/mountains/[id]`)ではコースタイム・登山口アクセス・登山適期・技術的な難所・累積標高差/距離・見どころ・知名度・野生動物情報も掲載

このほか `/gear`(コスパ最強装備一覧)、`/contact`(情報の誤り報告フォーム)がある。

想定ユーザーは一般の登山者(エンジニアではない)。デプロイ・データ更新も含めて、開発者以外が運用できることを重視している(READMEにZIPアップロードでの公開手順を用意しているのはそのため)。

## 技術スタック

- **Next.js 14 (App Router)** + TypeScript + React 18
- **Tailwind CSS**(`tailwind.config.ts` にブランドカラー・フォントを定義)
- **Supabase**(Postgres + PostgREST)をデータストアとして使用。ORMやマイグレーションツールは使っていない
- **Vercel** にデプロイ、**Vercel Analytics** 導入済み
- フォント: Archivo(見出し用 `font-display`)/ Inter(本文用 `font-sans`)、`next/font/google` 経由

## ディレクトリ構成

```
app/
  page.tsx              トップページ(山から探す) 。/huts, /gear へのリンクあり
  huts/page.tsx          山小屋一覧・検索ページ
  huts/[id]/page.tsx     山小屋の個別詳細ページ
  mountains/[id]/page.tsx 山の個別詳細ページ(コースタイム等の登山情報を掲載)
  gear/page.tsx           装備一覧ページ
  contact/page.tsx        お問い合わせ・情報の誤り報告フォーム
  sitemap.ts / robots.ts   SEO用(mountains/hutsの全IDを動的に列挙)
  layout.tsx / globals.css ルートレイアウト・グローバルCSS
components/
  HutFinder.tsx / HutCard.tsx       山小屋一覧の検索UI・カード
  MountainFinder.tsx / MountainCard.tsx  山一覧の検索UI・カード
  HutVisuals.tsx        山小屋カード/詳細で共有するアイコン・等高線プレースホルダー
  MountainVisuals.tsx   複数小屋がある山向けの標高プロファイル(縦のドット+ライン図)。
                        カード表示(MountainCard)と詳細ページ(mountains/[id])の両方から利用
  FilterChip.tsx        絞り込みチップの共通UI
  GearItemCard.tsx      装備一覧カード
  ContactForm.tsx       お問い合わせフォーム(Supabaseへ直接insert)
lib/supabase.ts          Supabaseクライアント(anon keyで初期化。クライアント/サーバー共通)
types/hut.ts             Hut型 + 標高/難易度/料金バッジ等の変換ヘルパー・定数
types/mountain.ts        Mountain型(huts.tsのDifficultyTierを再利用)
```

コンポーネント抽出の方針: 一覧カードと詳細ページの両方で使うロジック・見た目(標高プロファイルの図や等高線プレースホルダーなど)は `components/*Visuals.tsx` に切り出し、両方から import する。

## データベース(Supabase)構成

テーブルは4つ。マイグレーションツールは使っておらず、スキーマ変更は都度SQLを書いて手動でSupabaseのSQL Editorで実行する運用(後述)。

- **`huts`**(山小屋本体。`types/hut.ts` の `Hut` 型がスキーマの実体) — 標高、難易度、水場/電波の有無、料金、予約方法、営業期間、ハザードタグ(`hazard_tags: string[]`)、山頂までの目安時間、写真URL/クレジット、情報確度(`information_confidence`: 高/中/低)、`mountain_id` で `mountains` と紐付け
- **`mountains`**(山。`types/mountain.ts` の `Mountain` 型) — 標高、難易度、都道府県/エリア、写真、コースタイム(`course_time_text`)、登山口アクセス(`trailhead_access_text`)、登山適期(`best_season_text`)、技術的な難所(`technical_notes_text`)、累積標高差/距離(`elevation_gain_text`)、見どころ(`highlights_text`)、知名度(`fame_text`)、野生動物情報(`wildlife_text`)、情報確度。`huts` との関係はPostgRESTの埋め込みリレーション(`huts(id, name, hut_elevation_text)`)で取得
- **`gear_items`**(装備一覧。`sort_order` で表示順を制御。カテゴリの正規順序は `types/gear.ts` の `GEAR_CATEGORIES`)
- **`feedback_submissions`**(お問い合わせフォームからのinsert専用。`message`, `contact_email`)

**⚠️ RLS(Row Level Security)は未設定**(README記載の既知事項)。現状 `huts` / `mountains` / `gear_items` は誰でもanon keyで読み書き可能な状態。書き込み系の新機能を追加するタイミングで必ずRLSを設定すること。

## 環境変数

`.env.local`(gitignore対象、リポジトリには含まれない)に以下3つ:

- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` — アプリ本体(`lib/supabase.ts`)が使う。Vercelの環境変数にも同じものを設定する必要がある(READMEのデプロイ手順を参照)
- `SUPABASE_SECRET_KEY` — アプリコードからは一切参照されない。Claude(開発アシスタント)がSupabaseへのデータ投入・一括更新をcurl等でスクリプト的に行うためだけのキー。**本番アプリの動作には不要**

## ビルド・実行・デプロイ

```bash
npm install
npm run dev      # ローカル開発サーバー
npm run build     # 本番ビルド
npm run lint      # next lint
```

デプロイはVercel(GitHub連携)。`main` ブランチへのpushで自動デプロイされる。詳しい初回セットアップ手順は `README.md` を参照(ユーザーはローカル開発環境を持たないため、GitHubへのZIPアップロード→Vercel連携という手順を採っている)。

### データ更新の反映について(重要)

各ページは `export const revalidate = 3600`(ISR、1時間)で再生成される。

- **コードの変更を伴うpush**は通常通りVercelが新しいビルドを作ってデプロイするので、pushすればすぐ反映される
- **Supabaseのデータだけを変更した場合**(コードの変更なし)、Vercelのエッジキャッシュがしばらく古い内容を返し続けることがある。1時間待てば自然に更新されるが、すぐ確認したい場合はVercelダッシュボードの最新デプロイから **Redeploy** を押すと即座に反映される。データだけ更新して「反映されない」と問い合わせが来たら、まずこれを疑う

## コーディング上のルール・注意点

- コメントは基本的に書かない。書く場合も「なぜそうなっているか」(非自明な理由・過去の不具合の回避策など)のみ、日本語の一行コメントで最小限に留める(既存コードの流儀に合わせる)
- 標高・料金・難易度などの表示用ロジックは `types/hut.ts` / `types/mountain.ts` にヘルパー関数として集約し、コンポーネント側では呼び出すだけにする(例: `parseElevationMeters`, `getElevationTier`, `getPriceBadge`, `getDifficultyTier`)
- 一覧カードと詳細ページで同じ見た目・ロジックが必要になったら、専用コンポーネントに切り出して両方から使う(`HutVisuals.tsx` / `MountainVisuals.tsx` のパターン)
- 写真は主にWikimedia Commonsから、ライセンス・著者を確認のうえ `Special:FilePath` 経由のURLを使用し、`image_credit` にクレジットを保存する運用
- Supabaseのスキーマ変更は、開発者(Claude)がALTER TABLE等のSQLを提示し、ユーザーがSupabaseのSQL Editorで実行する。ローカルにpsql等は無い
- gitはユーザーの手元にGitHub Desktop(GUI)のみがあり、コマンドラインからのpush権限は無い。コミットはClaude側で作成し、pushはユーザーがGitHub Desktopで行う運用
