/**
 * 千葉日本大学第一中学校・高等学校 教職員ポータル
 * メインアプリケーション
 */

(function () {
  "use strict";

  /* ==============================
   * ユーティリティ
   * ============================== */

  // --- HTMLエスケープ（XSS対策） ---
  function escapeHtml(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // --- 日付フォーマット ---
  var DAY_NAMES = ["日", "月", "火", "水", "木", "金", "土"];

  function formatDateJa(date) {
    return date.getFullYear() + "年" + (date.getMonth() + 1) + "月" + date.getDate() + "日（" + DAY_NAMES[date.getDay()] + "）";
  }

  function formatYMD(date) {
    var y = date.getFullYear();
    var m = ("0" + (date.getMonth() + 1)).slice(-2);
    var d = ("0" + date.getDate()).slice(-2);
    return y + "-" + m + "-" + d;
  }

  // --- notifyDate を「M/D（曜）」形式に変換 ---
  function formatNotifyDateShort(dateStr) {
    var parts = dateStr.split("-");
    var d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
    return (d.getMonth() + 1) + "/" + d.getDate() + "（" + DAY_NAMES[d.getDay()] + "）";
  }

  // --- 生徒伝達事項をnotifyDate昇順（直近→未来）でソート ---
  function getSortedStudentAnnouncements() {
    return studentAnnouncements.slice().sort(function (a, b) {
      return a.notifyDate.localeCompare(b.notifyDate);
    });
  }

  /* ==============================
   * カレンダー状態管理
   * ============================== */
  var calendarState = {
    home: { year: 0, month: 0, selectedDate: null },
    full: { year: 0, month: 0, selectedDate: null }
  };

  // ホームお知らせタブの状態（"teacher" | "student"）
  var homeNoticeTab = "teacher";

  /* ==============================
   * ヘッダー・挨拶
   * ============================== */
  function renderHeader() {
    var now = new Date();
    var dateStr = formatDateJa(now);

    var headerDate = document.getElementById("headerDate");
    if (headerDate) {
      headerDate.innerHTML = escapeHtml(dateStr) + "<br>教職員専用";
    }

    var todayText = document.getElementById("todayText");
    if (todayText) {
      todayText.textContent = dateStr;
    }

    var greetText = document.getElementById("greetText");
    if (greetText) {
      var h = now.getHours();
      var greet = h < 11 ? "おはようございます" : h < 17 ? "こんにちは" : "お疲れさまです";
      greetText.textContent = greet + "、加賀屋先生";
    }
  }

  /* ==============================
   * ナビゲーション
   * ============================== */
  function navigateTo(sectionName) {
    // ナビタブの状態更新
    var navItems = document.querySelectorAll(".nav__item");
    navItems.forEach(function (item) {
      if (item.getAttribute("data-section") === sectionName) {
        item.classList.add("nav__item--active");
      } else {
        item.classList.remove("nav__item--active");
      }
    });

    // セクションの表示切替
    var sections = document.querySelectorAll(".page-section");
    sections.forEach(function (sec) {
      if (sec.id === "section-" + sectionName) {
        sec.classList.add("page-section--active");
      } else {
        sec.classList.remove("page-section--active");
      }
    });

    // セクション固有の初期化
    if (sectionName === "announcements") {
      renderAnnouncementFullList("all");
      renderStudentFullList();
    } else if (sectionName === "calendar") {
      renderCalendar("full");
      renderCalendarEventsList();
    } else if (sectionName === "documents") {
      renderDocumentsPage();
    } else if (sectionName === "applications") {
      renderApplicationsPage();
    }

    // ページ上部にスクロール
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function setupNavigation() {
    // ナビタブのクリック
    var navItems = document.querySelectorAll(".nav__item");
    navItems.forEach(function (item) {
      item.addEventListener("click", function () {
        var section = this.getAttribute("data-section");
        navigateTo(section);
      });
    });

    // カード内「もっと見る」リンク
    var moreLinks = document.querySelectorAll("[data-nav]");
    moreLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        var section = this.getAttribute("data-nav");
        navigateTo(section);
      });
    });
  }

  /* ==============================
   * クイックアクセス
   * ============================== */
  function renderQuickActions() {
    var container = document.getElementById("quickActions");
    if (!container) return;

    var html = "";
    quickActions.forEach(function (action) {
      html +=
        '<a class="quick-btn" href="' + escapeHtml(action.url) + '">' +
        '  <div class="quick-btn__icon ' + escapeHtml(action.colorClass) + '">' + escapeHtml(action.icon) + "</div>" +
        '  <span class="quick-btn__label">' + escapeHtml(action.label) + "</span>" +
        "</a>";
    });
    container.innerHTML = html;
  }

  /* ==============================
   * ホームお知らせタブ切替
   * ============================== */
  function setupHomeNoticeTabs() {
    var tabsContainer = document.getElementById("homeNoticeTabs");
    if (!tabsContainer) return;

    tabsContainer.addEventListener("click", function (e) {
      var tab = e.target.closest(".card__tab");
      if (!tab) return;

      var tabName = tab.getAttribute("data-tab");
      if (tabName === homeNoticeTab) return;

      homeNoticeTab = tabName;

      // タブの見た目を切替
      tabsContainer.querySelectorAll(".card__tab").forEach(function (t) {
        t.classList.remove("card__tab--active");
      });
      tab.classList.add("card__tab--active");

      // リストを再描画
      renderHomeNotices();
    });
  }

  /* ==============================
   * お知らせ（ホーム・サマリー）
   * ============================== */
  function renderHomeNotices() {
    var container = document.getElementById("homeNoticeList");
    if (!container) return;

    if (homeNoticeTab === "teacher") {
      renderHomeTeacherNotices(container);
    } else {
      renderHomeStudentNotices(container);
    }
  }

  // --- 先生方へ（ホーム・サマリー） ---
  function renderHomeTeacherNotices(container) {
    var items = teacherAnnouncements.slice(0, 5);
    var html = "";
    items.forEach(function (item) {
      html +=
        '<div class="notice-item" data-announcement-id="' + item.id + '" data-type="teacher">' +
        '  <span class="notice-badge badge-' + escapeHtml(item.category) + '">' + escapeHtml(item.categoryLabel) + "</span>" +
        '  <div class="notice-content">' +
        '    <div class="notice-title">' + escapeHtml(item.title) + "</div>" +
        '    <div class="notice-meta">' + escapeHtml(item.date) + " · " + escapeHtml(item.department) + "</div>" +
        "  </div>" +
        "</div>";
    });
    container.innerHTML = html;

    // クリックでモーダル表示
    container.querySelectorAll(".notice-item").forEach(function (el) {
      el.addEventListener("click", function () {
        var id = parseInt(this.getAttribute("data-announcement-id"), 10);
        showTeacherModal(id);
      });
    });
  }

  // --- 生徒伝達事項（ホーム・サマリー） ---
  function renderHomeStudentNotices(container) {
    var sorted = getSortedStudentAnnouncements().slice(0, 5);
    var html = "";
    sorted.forEach(function (item) {
      html +=
        '<div class="notice-item" data-announcement-id="' + item.id + '" data-type="student">' +
        '  <div class="notice-content">' +
        '    <div class="notice-tags">' +
        '      <span class="notice-tag notice-tag--date">' + escapeHtml(formatNotifyDateShort(item.notifyDate)) + '</span>' +
        '      <span class="notice-tag notice-tag--grade">' + escapeHtml(item.targetGrade) + '</span>' +
        '    </div>' +
        '    <div class="notice-title">' + escapeHtml(item.title) + "</div>" +
        '    <div class="notice-meta">' + escapeHtml(item.department) + "</div>" +
        "  </div>" +
        "</div>";
    });
    container.innerHTML = html;

    // クリックでモーダル表示
    container.querySelectorAll(".notice-item").forEach(function (el) {
      el.addEventListener("click", function () {
        var id = parseInt(this.getAttribute("data-announcement-id"), 10);
        showStudentModal(id);
      });
    });
  }

  /* ==============================
   * 先生方へ（全件・フィルタ付き）
   * ============================== */
  function renderAnnouncementFullList(filter) {
    var container = document.getElementById("announcementFullList");
    if (!container) return;

    var items = filter === "all"
      ? teacherAnnouncements
      : teacherAnnouncements.filter(function (a) { return a.category === filter; });

    if (items.length === 0) {
      container.innerHTML = '<p style="padding:24px;color:var(--text-sub);text-align:center;">該当するお知らせはありません</p>';
      return;
    }

    var html = "";
    items.forEach(function (item) {
      html +=
        '<div class="announcement-card" data-announcement-id="' + item.id + '" data-type="teacher">' +
        '  <div class="announcement-card__header">' +
        '    <span class="notice-badge badge-' + escapeHtml(item.category) + '">' + escapeHtml(item.categoryLabel) + "</span>" +
        '    <span class="announcement-card__title">' + escapeHtml(item.title) + "</span>" +
        "  </div>" +
        '  <div class="announcement-card__body">' + escapeHtml(item.body) + "</div>" +
        '  <div class="announcement-card__meta">' + escapeHtml(item.date) + " · " + escapeHtml(item.department) + "</div>" +
        "</div>";
    });
    container.innerHTML = html;

    // クリックでモーダル表示
    container.querySelectorAll(".announcement-card").forEach(function (el) {
      el.addEventListener("click", function () {
        var id = parseInt(this.getAttribute("data-announcement-id"), 10);
        showTeacherModal(id);
      });
    });
  }

  function setupAnnouncementFilter() {
    var filterBar = document.getElementById("announcementFilter");
    if (!filterBar) return;

    filterBar.addEventListener("click", function (e) {
      var btn = e.target.closest(".filter-btn");
      if (!btn) return;

      // アクティブ状態の切替
      filterBar.querySelectorAll(".filter-btn").forEach(function (b) {
        b.classList.remove("filter-btn--active");
      });
      btn.classList.add("filter-btn--active");

      var filter = btn.getAttribute("data-filter");
      renderAnnouncementFullList(filter);
    });
  }

  /* ==============================
   * 生徒伝達事項（全件・notifyDate昇順）
   * ============================== */
  function renderStudentFullList() {
    var container = document.getElementById("studentFullList");
    if (!container) return;

    var sorted = getSortedStudentAnnouncements();

    if (sorted.length === 0) {
      container.innerHTML = '<p style="padding:24px;color:var(--text-sub);text-align:center;">生徒伝達事項はありません</p>';
      return;
    }

    var html = "";
    sorted.forEach(function (item) {
      html +=
        '<div class="student-card" data-announcement-id="' + item.id + '" data-type="student">' +
        '  <div class="student-card__meta-row">' +
        '    <span class="student-card__tag tag-notify-date">連絡日: ' + escapeHtml(formatNotifyDateShort(item.notifyDate)) + '</span>' +
        '    <span class="student-card__tag tag-target-grade">対象: ' + escapeHtml(item.targetGrade) + '</span>' +
        '  </div>' +
        '  <div class="student-card__title">' + escapeHtml(item.title) + '</div>' +
        '  <div class="student-card__body">' + escapeHtml(item.body) + '</div>' +
        '  <div class="student-card__footer">登録日: ' + escapeHtml(item.date) + ' · ' + escapeHtml(item.department) + '</div>' +
        '</div>';
    });
    container.innerHTML = html;

    // クリックでモーダル表示
    container.querySelectorAll(".student-card").forEach(function (el) {
      el.addEventListener("click", function () {
        var id = parseInt(this.getAttribute("data-announcement-id"), 10);
        showStudentModal(id);
      });
    });
  }

  /* ==============================
   * お知らせセクション タブ切替
   * ============================== */
  function setupAnnounceTabs() {
    var tabsContainer = document.getElementById("announceTabs");
    if (!tabsContainer) return;

    tabsContainer.addEventListener("click", function (e) {
      var btn = e.target.closest(".announce-tab");
      if (!btn) return;

      var tabName = btn.getAttribute("data-announce-tab");

      // タブの見た目を切替
      tabsContainer.querySelectorAll(".announce-tab").forEach(function (b) {
        b.classList.remove("announce-tab--active");
      });
      btn.classList.add("announce-tab--active");

      // パネルの表示切替
      var teacherPanel = document.getElementById("teacherPanel");
      var studentPanel = document.getElementById("studentPanel");

      if (tabName === "teacher") {
        teacherPanel.classList.add("announce-panel--active");
        studentPanel.classList.remove("announce-panel--active");
      } else {
        teacherPanel.classList.remove("announce-panel--active");
        studentPanel.classList.add("announce-panel--active");
      }
    });
  }

  /* ==============================
   * モーダル
   * ============================== */

  // --- 先生方へモーダル ---
  function showTeacherModal(id) {
    var item = teacherAnnouncements.find(function (a) { return a.id === id; });
    if (!item) return;

    var content = document.getElementById("modalContent");
    if (!content) return;

    content.innerHTML =
      "<h3>" + escapeHtml(item.title) + "</h3>" +
      '<div class="modal-meta">' +
      '  <span class="notice-badge badge-' + escapeHtml(item.category) + '">' + escapeHtml(item.categoryLabel) + "</span>" +
      "  <span>" + escapeHtml(item.date) + "</span>" +
      "  <span>" + escapeHtml(item.department) + "</span>" +
      "</div>" +
      '<div class="modal-body">' + escapeHtml(item.body) + "</div>";

    openModal();
  }

  // --- 生徒伝達事項モーダル ---
  function showStudentModal(id) {
    var item = studentAnnouncements.find(function (a) { return a.id === id; });
    if (!item) return;

    var content = document.getElementById("modalContent");
    if (!content) return;

    content.innerHTML =
      "<h3>" + escapeHtml(item.title) + "</h3>" +
      '<div class="modal-meta">' +
      '  <span class="student-card__tag tag-notify-date">連絡日: ' + escapeHtml(formatNotifyDateShort(item.notifyDate)) + '</span>' +
      '  <span class="student-card__tag tag-target-grade">対象: ' + escapeHtml(item.targetGrade) + '</span>' +
      "  <span>" + escapeHtml(item.department) + "</span>" +
      "</div>" +
      '<div class="modal-body">' + escapeHtml(item.body) + "</div>";

    openModal();
  }

  function openModal() {
    var overlay = document.getElementById("modalOverlay");
    if (overlay) overlay.classList.add("modal-overlay--active");
  }

  function closeModal() {
    var overlay = document.getElementById("modalOverlay");
    if (overlay) overlay.classList.remove("modal-overlay--active");
  }

  function setupModal() {
    var closeBtn = document.getElementById("modalClose");
    if (closeBtn) {
      closeBtn.addEventListener("click", closeModal);
    }

    var overlay = document.getElementById("modalOverlay");
    if (overlay) {
      overlay.addEventListener("click", function (e) {
        if (e.target === overlay) closeModal();
      });
    }

    // Escキーで閉じる
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeModal();
    });
  }

  /* ==============================
   * カレンダー
   * ============================== */
  function getEventsForDate(dateStr) {
    return events.filter(function (ev) { return ev.date === dateStr; });
  }

  function getEventsForMonth(year, month) {
    var prefix = year + "-" + ("0" + (month + 1)).slice(-2);
    return events.filter(function (ev) { return ev.date.indexOf(prefix) === 0; });
  }

  function renderCalendar(target) {
    var containerId = target === "full" ? "fullCalendar" : "homeCalendar";
    var container = document.getElementById(containerId);
    if (!container) return;

    var state = calendarState[target];
    var today = new Date();
    var todayStr = formatYMD(today);

    var year = state.year;
    var month = state.month;

    // 月の最初の日と最後の日
    var firstDay = new Date(year, month, 1);
    var lastDay = new Date(year, month + 1, 0);
    var startDow = firstDay.getDay(); // 0=日曜

    // 前月の日を埋める
    var prevMonthLast = new Date(year, month, 0);
    var prevDays = prevMonthLast.getDate();

    var html = "";

    // カレンダーヘッダー（月送り）
    html +=
      '<div class="cal-month">' +
      '  <button class="cal-month__nav" data-dir="-1" data-target="' + target + '">&lsaquo;</button>' +
      '  <div class="cal-month__title">' + year + "年 " + (month + 1) + "月</div>" +
      '  <button class="cal-month__nav" data-dir="1" data-target="' + target + '">&rsaquo;</button>' +
      "</div>";

    // 曜日ヘッダー
    html += '<div class="cal-grid">';
    var dows = ["日", "月", "火", "水", "木", "金", "土"];
    dows.forEach(function (dow, i) {
      var cls = "cal-dow";
      if (i === 0) cls += " cal-dow--sun";
      if (i === 6) cls += " cal-dow--sat";
      html += '<div class="' + cls + '">' + dow + "</div>";
    });

    // 前月の日
    for (var p = startDow - 1; p >= 0; p--) {
      var pDay = prevDays - p;
      var pDow = (startDow - p - 1 + 7) % 7;
      var pCls = "cal-day cal-day--other";
      if (pDow === 0) pCls += " cal-day--sun";
      if (pDow === 6) pCls += " cal-day--sat";
      html += '<div class="' + pCls + '">' + pDay + "</div>";
    }

    // 当月の日
    for (var d = 1; d <= lastDay.getDate(); d++) {
      var dateObj = new Date(year, month, d);
      var dateStr = formatYMD(dateObj);
      var dow = dateObj.getDay();
      var cls = "cal-day";
      if (dateStr === todayStr) cls += " cal-day--today";
      if (dow === 0) cls += " cal-day--sun";
      if (dow === 6) cls += " cal-day--sat";
      if (getEventsForDate(dateStr).length > 0) cls += " cal-day--has-event";
      if (state.selectedDate === dateStr) cls += " cal-day--selected";
      html += '<div class="' + cls + '" data-date="' + dateStr + '" data-target="' + target + '">' + d + "</div>";
    }

    // 次月の日を埋める
    var totalCells = startDow + lastDay.getDate();
    var remaining = (7 - (totalCells % 7)) % 7;
    for (var n = 1; n <= remaining; n++) {
      var nDow = (totalCells + n - 1) % 7;
      var nCls = "cal-day cal-day--other";
      if (nDow === 0) nCls += " cal-day--sun";
      if (nDow === 6) nCls += " cal-day--sat";
      html += '<div class="' + nCls + '">' + n + "</div>";
    }

    html += "</div>"; // .cal-grid 終了

    container.innerHTML = html;

    // イベントバインド：月送りボタン
    container.querySelectorAll(".cal-month__nav").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var dir = parseInt(this.getAttribute("data-dir"), 10);
        var tgt = this.getAttribute("data-target");
        var st = calendarState[tgt];
        st.month += dir;
        if (st.month < 0) { st.month = 11; st.year--; }
        if (st.month > 11) { st.month = 0; st.year++; }
        st.selectedDate = null;
        renderCalendar(tgt);
        if (tgt === "full") renderCalendarEventsList();
      });
    });

    // イベントバインド：日付クリック
    container.querySelectorAll(".cal-day:not(.cal-day--other)").forEach(function (dayEl) {
      dayEl.addEventListener("click", function () {
        var date = this.getAttribute("data-date");
        var tgt = this.getAttribute("data-target");
        var st = calendarState[tgt];

        if (st.selectedDate === date) {
          st.selectedDate = null;
        } else {
          st.selectedDate = date;
        }

        renderCalendar(tgt);

        if (tgt === "full") renderCalendarEventsList();

        if (tgt === "home" && st.selectedDate) {
          var dayEvents = getEventsForDate(date);
          if (dayEvents.length > 0) {
            showEventsModal(date, dayEvents);
          }
        }
      });
    });
  }

  function showEventsModal(dateStr, dayEvents) {
    var content = document.getElementById("modalContent");
    if (!content) return;

    var dateParts = dateStr.split("-");
    var dateLabel = parseInt(dateParts[1], 10) + "月" + parseInt(dateParts[2], 10) + "日の行事";

    var html = "<h3>" + escapeHtml(dateLabel) + "</h3>";
    dayEvents.forEach(function (ev) {
      html +=
        '<div style="padding:12px 0;border-bottom:1px solid var(--border);">' +
        '  <div style="font-weight:600;font-size:15px;color:var(--text);">' + escapeHtml(ev.title) + "</div>" +
        '  <div style="font-size:13px;color:var(--text-sub);margin-top:4px;">' + escapeHtml(ev.detail) + "</div>" +
        "</div>";
    });
    content.innerHTML = html;
    openModal();
  }

  /* ==============================
   * カレンダーセクション行事リスト
   * ============================== */
  function renderCalendarEventsList() {
    var container = document.getElementById("calendarEventsList");
    var titleEl = document.getElementById("calendarEventsTitle");
    if (!container) return;

    var state = calendarState.full;

    var evts;
    var titleText;
    if (state.selectedDate) {
      evts = getEventsForDate(state.selectedDate);
      var parts = state.selectedDate.split("-");
      titleText = parseInt(parts[1], 10) + "月" + parseInt(parts[2], 10) + "日の行事";
    } else {
      evts = getEventsForMonth(state.year, state.month);
      titleText = (state.month + 1) + "月の行事";
    }

    if (titleEl) titleEl.textContent = titleText;

    if (evts.length === 0) {
      container.innerHTML = '<p style="padding:24px;color:var(--text-sub);text-align:center;">行事はありません</p>';
      return;
    }

    evts.sort(function (a, b) { return a.date.localeCompare(b.date); });
    container.innerHTML = renderEventItems(evts);
  }

  /* ==============================
   * 直近の行事（ホーム）
   * ============================== */
  function renderHomeEvents() {
    var container = document.getElementById("homeEventsList");
    if (!container) return;

    var todayStr = formatYMD(new Date());
    var upcoming = events
      .filter(function (ev) { return ev.date >= todayStr; })
      .sort(function (a, b) { return a.date.localeCompare(b.date); })
      .slice(0, 5);

    if (upcoming.length === 0) {
      container.innerHTML = '<p style="padding:24px;color:var(--text-sub);text-align:center;">直近の行事はありません</p>';
      return;
    }

    container.innerHTML = renderEventItems(upcoming);
  }

  function renderEventItems(evts) {
    var html = "";
    evts.forEach(function (ev) {
      var parts = ev.date.split("-");
      var day = parseInt(parts[2], 10);
      var month = parseInt(parts[1], 10) + "月";

      html +=
        '<div class="event-item">' +
        '  <div class="event-date">' +
        '    <div class="event-date__day">' + day + "</div>" +
        '    <div class="event-date__month">' + escapeHtml(month) + "</div>" +
        "  </div>" +
        '  <div class="event-bar" style="background:' + escapeHtml(ev.color) + ';"></div>' +
        '  <div class="event-info">' +
        '    <div class="event-info__title">' + escapeHtml(ev.title) + "</div>" +
        '    <div class="event-info__sub">' + escapeHtml(ev.detail) + "</div>" +
        "  </div>" +
        "</div>";
    });
    return html;
  }

  /* ==============================
   * 共有ドキュメント（ホーム・サイドバー）
   * ============================== */
  function renderHomeLinks() {
    var container = document.getElementById("homeLinksGrid");
    if (!container) return;

    var items = sharedLinks.slice(0, 6);
    var html = "";
    items.forEach(function (link) {
      html +=
        '<a class="link-item" href="' + escapeHtml(link.url) + '">' +
        '  <div class="link-item__icon">' + escapeHtml(link.icon) + "</div>" +
        '  <div class="link-item__label">' + escapeHtml(link.label) + "</div>" +
        "</a>";
    });
    container.innerHTML = html;
  }

  /* ==============================
   * 共有ドキュメント（全画面ページ）
   * ============================== */
  function renderDocumentsPage() {
    var container = document.getElementById("documentsGrid");
    if (!container) return;

    var html = "";
    sharedLinks.forEach(function (link) {
      html +=
        '<a class="document-card" href="' + escapeHtml(link.url) + '">' +
        '  <div class="document-card__icon">' + escapeHtml(link.icon) + "</div>" +
        '  <div class="document-card__label">' + escapeHtml(link.label) + "</div>" +
        "</a>";
    });
    container.innerHTML = html;
  }

  /* ==============================
   * 申請フォーム（全画面ページ）
   * ============================== */
  function renderApplicationsPage() {
    var container = document.getElementById("applicationsGrid");
    if (!container) return;

    var html = "";
    quickActions.forEach(function (action) {
      html +=
        '<a class="document-card" href="' + escapeHtml(action.url) + '">' +
        '  <div class="document-card__icon">' + escapeHtml(action.icon) + "</div>" +
        '  <div class="document-card__label">' + escapeHtml(action.label) + "</div>" +
        "</a>";
    });
    container.innerHTML = html;
  }

  /* ==============================
   * 出勤状況
   * ============================== */
  function renderStaffStatus() {
    var container = document.getElementById("homeStatusWidget");
    if (!container) return;

    var html = "";
    staffStatus.forEach(function (status) {
      html +=
        '<div class="status-row">' +
        '  <span class="status-label">' +
        '    <div class="status-dot" style="background:' + escapeHtml(status.color) + ';"></div>' +
        escapeHtml(status.label) +
        "  </span>" +
        '  <span class="status-val">' + escapeHtml(String(status.count)) + "名</span>" +
        "</div>";
    });
    container.innerHTML = html;
  }

  /* ==============================
   * 初期化
   * ============================== */
  function init() {
    var now = new Date();

    // カレンダー状態の初期化
    calendarState.home.year = now.getFullYear();
    calendarState.home.month = now.getMonth();
    calendarState.full.year = now.getFullYear();
    calendarState.full.month = now.getMonth();

    // 各コンポーネントの描画
    renderHeader();
    renderQuickActions();
    renderHomeNotices();
    renderCalendar("home");
    renderHomeEvents();
    renderHomeLinks();
    renderStaffStatus();

    // イベント設定
    setupNavigation();
    setupHomeNoticeTabs();
    setupAnnouncementFilter();
    setupAnnounceTabs();
    setupModal();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
