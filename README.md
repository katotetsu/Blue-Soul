# Blue Soul Project

## セットアップ手順

1. 依存パッケージのインストール

```bash
npm install
```

2. 開発サーバーの起動

```bash
npm run dev
```

---

## ディレクトリ構成

- `src/app/chant_current/page.tsx` … 現在の応援歌ページ
- `src/app/chant_search/page.tsx` … 応援歌検索ページ（雛形あり）
- `src/components/common/Header.tsx` … 共通ヘッダーコンポーネント
- `src/components/common/Footer.tsx` … 共通フッターコンポーネント

---

## 共通コンポーネントの使い方

各ページで以下のようにインポートして使います。

```tsx
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";

export default function SomePage() {
  return (
    <div>
      <Header />
      {/* ページ固有の内容 */}
      <Footer />
    </div>
  );
}
```

---

## ページ雛形

- `chant_search/page.tsx` にはHeader・Footerが組み込まれており、すぐに開発を始められます。
- 必要に応じて他のページも同様の構成で作成してください。

---

## 注意事項

- フッターのナビゲーションは、現在のページに応じてアイコンの色が自動で切り替わります。
- 共通UIの修正は`components/common/`配下で行ってください。
- 新しいページを追加する場合は`src/app/`配下にディレクトリを作成し、`page.tsx`を配置してください。

---

## その他

- 質問や不明点があれば、READMEに追記するか、開発メンバーにご相談ください。

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
