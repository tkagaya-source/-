# 学校ポータルサイト

## プロジェクト概要

学校向けのポータルサイト。お知らせ表示と時間割表示の機能を持つ。
フレームワーク不使用のHTML/CSS/JavaScriptで構成される静的サイト。

## ディレクトリ構成

```
/
├── index.html          # メインページ
├── css/
│   └── style.css       # スタイルシート
├── js/
│   ├── data.js         # サンプルデータ（お知らせ・時間割）
│   └── app.js          # アプリケーションロジック
└── CLAUDE.md           # このファイル
```

## 開発方法

### ローカルでの確認

ビルドステップは不要。`index.html` をブラウザで直接開くか、任意のHTTPサーバーで配信する。

```sh
# Python 3 の場合
python3 -m http.server 8000

# Node.js (npx) の場合
npx serve .
```

### コーディング規約

- **HTML**: セマンティックな要素を使用。BEM風のクラス命名（`block__element--modifier`）
- **CSS**: コンポーネント単位でセクション分け。コメントで区切りを明示
- **JavaScript**: 即時実行関数(IIFE)でグローバル汚染を防止。`"use strict"` を使用。ユーザー入力やデータの描画時は必ず `escapeHtml()` でXSS対策を行う

### 言語

UIテキストはすべて日本語。コード中のコメントも日本語で記述する。

## 機能一覧

| 機能 | 説明 |
|------|------|
| お知らせ | カテゴリ（重要・全般・行事）付きのお知らせ一覧を表示 |
| 時間割 | クラス別（1A, 1B, 2A, 2B）の週間時間割を表示。セレクトボックスで切替 |

## データ構造

### お知らせ (`announcements` in `js/data.js`)

```js
{
  date: "YYYY-MM-DD",       // 日付
  category: "important",    // カテゴリID: important | general | event
  categoryLabel: "重要",    // 表示用ラベル
  title: "タイトル",
  body: "本文"
}
```

### 時間割 (`schedules` in `js/data.js`)

クラスIDをキーとするオブジェクト。値は `[時限][曜日(月〜金)]` の2次元配列。

## 変更時の注意

- 新しいカテゴリを追加する場合は `css/style.css` に対応する `.announcement-item__category--<name>` クラスを追加する
- 新しいクラスを追加する場合は `js/data.js` の `schedules` オブジェクトと `index.html` の `<select>` にオプションを追加する
- HTMLに動的コンテンツを挿入する際は必ず `escapeHtml()` を通す
