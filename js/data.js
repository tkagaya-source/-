/**
 * 千葉日本大学第一中学校・高等学校 教職員ポータル
 * サンプルデータ定義
 * 実運用時はAPIやJSONファイルから取得する想定
 */

/* --- お知らせデータ --- */
var announcements = [
  {
    id: 1,
    date: "2026/02/13",
    category: "important",
    categoryLabel: "重要",
    department: "教務部",
    title: "2月の職員会議の日程変更について",
    body: "2月の職員会議を2月18日（水）16:00〜に変更します。場所は会議室Aです。各学年主任は出席必須となりますので、予定の調整をお願いいたします。議題は年度末成績処理スケジュール、来年度クラス編成方針、卒業式準備について協議予定です。"
  },
  {
    id: 2,
    date: "2026/02/12",
    category: "important",
    categoryLabel: "重要",
    department: "学校長室",
    title: "令和8年度 教育課程編成に関する意見募集",
    body: "来年度の教育課程編成にあたり、各教科から改善提案を募集します。提出期限は2月28日（金）です。所定の書式にて教務部宛にご提出ください。特に探究学習の時間配分やICT活用に関するご意見を歓迎します。"
  },
  {
    id: 3,
    date: "2026/02/10",
    category: "new",
    categoryLabel: "NEW",
    department: "学校長室",
    title: "令和8年度 年間行事計画（案）を共有しました",
    body: "令和8年度の年間行事計画案を共有フォルダにアップロードしました。各学年・各部署で内容をご確認いただき、修正・追加のご要望があれば2月20日までに教務部までお知らせください。"
  },
  {
    id: 4,
    date: "2026/02/08",
    category: "info",
    categoryLabel: "連絡",
    department: "総務部",
    title: "健康診断の受診期間について（3月実施）",
    body: "教職員定期健康診断を3月3日〜14日の期間で実施します。受診日時の希望調査を来週配布しますので、ご提出をお願いいたします。なお、人間ドック受診者は別途申請が必要です。"
  },
  {
    id: 5,
    date: "2026/02/06",
    category: "new",
    categoryLabel: "NEW",
    department: "ICT担当",
    title: "校内Wi-Fi メンテナンスのお知らせ（2/16）",
    body: "2月16日（月）18:00〜22:00に校内Wi-Fiのメンテナンスを実施します。この間、インターネット接続が一時的に不安定になる場合があります。重要な作業は事前に完了いただくか、モバイル回線をご利用ください。"
  },
  {
    id: 6,
    date: "2026/02/05",
    category: "info",
    categoryLabel: "連絡",
    department: "教務部",
    title: "卒業式・修了式 準備担当割り振り表",
    body: "卒業式（3月10日）および修了式（3月22日）の準備担当割り振り表を共有フォルダにアップしました。担当業務をご確認ください。変更希望は教務部・田中までご連絡ください。"
  },
  {
    id: 7,
    date: "2026/02/03",
    category: "info",
    categoryLabel: "連絡",
    department: "生徒指導部",
    title: "2月の生活指導重点項目について",
    body: "2月の生活指導重点項目は「学年末に向けた学習環境の整備」です。教室の整理整頓、ロッカーの片付けについて各クラスでの声かけをお願いいたします。"
  },
  {
    id: 8,
    date: "2026/02/01",
    category: "new",
    categoryLabel: "NEW",
    department: "進路指導部",
    title: "大学入試結果速報（2月1日現在）",
    body: "2月1日現在の大学入試合格状況を進路指導室前に掲示しています。詳細データは進路指導部の共有フォルダをご参照ください。"
  }
];

/* --- 行事データ --- */
var events = [
  { id: 1,  date: "2026-02-05", title: "入試対策委員会", detail: "16:00〜 / 会議室A", color: "#8B1A2B" },
  { id: 2,  date: "2026-02-12", title: "学年末テスト時間割発表", detail: "全学年 / 職員室掲示", color: "#C8972A" },
  { id: 3,  date: "2026-02-13", title: "職員研修（午後）", detail: "13:30〜 / 視聴覚室", color: "#8B1A2B" },
  { id: 4,  date: "2026-02-14", title: "中学入試（第3回）", detail: "8:00〜 / 全館", color: "#B84059" },
  { id: 5,  date: "2026-02-17", title: "進路指導委員会", detail: "16:00〜 / 会議室B", color: "#2E9E6B" },
  { id: 6,  date: "2026-02-20", title: "保護者懇談会", detail: "14:00〜17:00 / 各教室", color: "#B84059" },
  { id: 7,  date: "2026-02-23", title: "天皇誕生日（祝日）", detail: "休校日", color: "#C0392B" },
  { id: 8,  date: "2026-02-25", title: "学年末テスト 1日目", detail: "全学年 / 1〜5限", color: "#C8972A" },
  { id: 9,  date: "2026-02-26", title: "学年末テスト 2日目", detail: "全学年 / 1〜5限", color: "#C8972A" },
  { id: 10, date: "2026-02-27", title: "学年末テスト 3日目", detail: "全学年 / 1〜4限", color: "#C8972A" },
  { id: 11, date: "2026-03-03", title: "テスト返却・採点締切", detail: "全教科 / 成績入力期限3/5", color: "#8B1A2B" },
  { id: 12, date: "2026-03-05", title: "成績入力締切", detail: "17:00まで / 成績管理システム", color: "#C0392B" },
  { id: 13, date: "2026-03-07", title: "成績会議", detail: "14:00〜 / 会議室A", color: "#8B1A2B" },
  { id: 14, date: "2026-03-10", title: "卒業式", detail: "10:00〜 / 体育館", color: "#B84059" },
  { id: 15, date: "2026-03-15", title: "新入生登校日", detail: "9:00〜12:00 / 体育館・各教室", color: "#2E9E6B" },
  { id: 16, date: "2026-03-22", title: "修了式", detail: "9:00〜 / 体育館", color: "#B84059" },
  { id: 17, date: "2026-03-25", title: "新年度準備開始", detail: "教室移動・清掃", color: "#2E9E6B" }
];

/* --- 共有リンクデータ --- */
var sharedLinks = [
  { icon: "📊", label: "成績管理シート", url: "#" },
  { icon: "📝", label: "授業計画テンプレ", url: "#" },
  { icon: "📅", label: "年間行事計画", url: "#" },
  { icon: "📋", label: "各種様式ダウンロード", url: "#" },
  { icon: "🏫", label: "校則・内規", url: "#" },
  { icon: "🖥", label: "ICTマニュアル", url: "#" },
  { icon: "📖", label: "教育課程表", url: "#" },
  { icon: "🔒", label: "個人情報取扱規程", url: "#" }
];

/* --- 出勤状況データ --- */
var staffStatus = [
  { label: "出勤中", count: 38, color: "#34C47A" },
  { label: "出張・外出", count: 4, color: "#F59E3A" },
  { label: "休暇", count: 2, color: "#F06B6B" },
  { label: "研修", count: 1, color: "#5B8DEF" }
];

/* --- クイックアクセスデータ --- */
var quickActions = [
  { icon: "📋", label: "休暇・出張申請", colorClass: "icon-red", url: "#" },
  { icon: "🏢", label: "施設利用申請", colorClass: "icon-orange", url: "#" },
  { icon: "📦", label: "備品・消耗品申請", colorClass: "icon-green", url: "#" },
  { icon: "📁", label: "共有ドキュメント", colorClass: "icon-purple", url: "#" },
  { icon: "📄", label: "出席簿入力", colorClass: "icon-blue", url: "#" },
  { icon: "💬", label: "生徒面談記録", colorClass: "icon-teal", url: "#" },
  { icon: "📊", label: "成績入力", colorClass: "icon-yellow", url: "#" },
  { icon: "🖨", label: "印刷申請", colorClass: "icon-gray", url: "#" }
];
