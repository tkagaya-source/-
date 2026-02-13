# 学校ポータルサイト

## プロジェクト概要

学校向けのポータルサイト。お知らせ表示と時間割表示の機能を持つ。
フレームワーク不使用のHTML/CSS/JavaScriptで構成される静的サイト。ビルドツールやパッケージマネージャーは使用していない。

## ディレクトリ構成

```
/
├── index.html          # メインページ（エントリーポイント）
├── css/
│   └── style.css       # スタイルシート（全コンポーネント分を1ファイルに集約）
├── js/
│   ├── data.js         # サンプルデータ（お知らせ・時間割・時限ラベル）
│   └── app.js          # アプリケーションロジック（描画・イベント処理）
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

### テスト・リンター

テストフレームワークやリンターは導入されていない。変更後はブラウザで目視確認する。

### コーディング規約

- **HTML**: セマンティックな要素を使用。BEM風のクラス命名（`block__element--modifier`）
- **CSS**: コンポーネント単位でセクション分け。日本語コメントで区切りを明示（例: `/* === ヘッダー === */`）
- **JavaScript**:
  - 即時実行関数(IIFE)でグローバル汚染を防止。`"use strict"` を使用
  - ユーザー入力やデータの描画時は必ず `escapeHtml()` でXSS対策を行う
  - `data.js` のグローバル変数 (`var`) は `app.js` 内のIIFEから参照される。スクリプト読み込み順序は `data.js` → `app.js` の順（`index.html` で定義）

### 言語

UIテキストはすべて日本語。コード中のコメントも日本語で記述する。

## アーキテクチャ

### スクリプト読み込み順序

`index.html` の末尾で以下の順にスクリプトを読み込む。順序に依存関係があるため変更不可。

1. `js/data.js` — グローバル変数 `announcements`, `schedules`, `periodLabels` を定義
2. `js/app.js` — IIFE内で上記グローバル変数を参照し、DOM操作を行う

### app.js の構成

| 関数 | 説明 |
|------|------|
| `renderAnnouncements()` | `announcements` 配列を元にお知らせ一覧HTMLを生成・挿入 |
| `renderSchedule(classId)` | 指定クラスIDの時間割テーブルのtbodyを生成・挿入 |
| `escapeHtml(str)` | `& < > " '` をHTMLエンティティに変換するXSS対策関数 |
| `init()` | DOMContentLoadedで呼ばれる初期化関数。お知らせ描画・時間割の初期表示・セレクトボックスのchangeイベント登録 |

## 機能一覧

| 機能 | 説明 |
|------|------|
| お知らせ | カテゴリ（重要・全般・行事）付きのお知らせ一覧を表示 |
| 時間割 | クラス別（1A, 1B, 2A, 2B）の週間時間割を表示。セレクトボックスで切替。6時限×5曜日（月〜金） |

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

クラスIDをキーとするオブジェクト。値は `[時限][曜日(月〜金)]` の2次元配列（6時限×5曜日）。

### 時限ラベル (`periodLabels` in `js/data.js`)

`["1限", "2限", "3限", "4限", "5限", "6限"]` — 時間割テーブルの行ヘッダーに使用。

## CSSの構成

スタイルは `css/style.css` に以下のセクション構成でまとめている:

| セクション | 内容 |
|-----------|------|
| リセット・ベース | ボックスモデルリセット、フォント設定（Hiragino/Noto Sans JP/Meiryo） |
| ヘッダー | `.header`, `.header__title`, `.header__nav`, `.header__link` |
| メインコンテンツ | `.main`（最大幅960px、中央寄せ） |
| セクション共通 | `.section`, `.section__title` |
| お知らせ | `.announcement-list`, `.announcement-item` および各子要素 |
| 時間割 | `.schedule-controls`, `.schedule-table` および関連クラス |
| フッター | `.footer` |
| レスポンシブ | 600px以下でヘッダー縦並び、テーブルフォント縮小 |

## 変更時の注意

- 新しいカテゴリを追加する場合は `css/style.css` に対応する `.announcement-item__category--<name>` クラスを追加する
- 新しいクラス（学年・組）を追加する場合は `js/data.js` の `schedules` オブジェクトと `index.html` の `<select id="class-select">` にオプションを追加する
- 時限数を変更する場合は `js/data.js` の `periodLabels` 配列と各クラスの時間割データの行数を合わせる
- HTMLに動的コンテンツを挿入する際は必ず `escapeHtml()` を通す
- スクリプトの読み込み順序（`data.js` → `app.js`）を変更しないこと
