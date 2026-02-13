/**
 * 学校ポータルサイト - メインアプリケーション
 */

(function () {
  "use strict";

  // --- お知らせ描画 ---
  function renderAnnouncements() {
    var container = document.getElementById("announcement-list");
    if (!container) return;

    var html = "";
    for (var i = 0; i < announcements.length; i++) {
      var item = announcements[i];
      html +=
        '<article class="announcement-item">' +
        '  <div class="announcement-item__date">' +
        escapeHtml(item.date) +
        '    <span class="announcement-item__category announcement-item__category--' +
        escapeHtml(item.category) +
        '">' +
        escapeHtml(item.categoryLabel) +
        "    </span>" +
        "  </div>" +
        '  <div class="announcement-item__title">' +
        escapeHtml(item.title) +
        "  </div>" +
        '  <div class="announcement-item__body">' +
        escapeHtml(item.body) +
        "  </div>" +
        "</article>";
    }
    container.innerHTML = html;
  }

  // --- 時間割描画 ---
  function renderSchedule(classId) {
    var tbody = document.getElementById("schedule-body");
    if (!tbody) return;

    var data = schedules[classId];
    if (!data) return;

    var html = "";
    for (var row = 0; row < data.length; row++) {
      html += "<tr>";
      html += "<th>" + escapeHtml(periodLabels[row]) + "</th>";
      for (var col = 0; col < data[row].length; col++) {
        html += "<td>" + escapeHtml(data[row][col]) + "</td>";
      }
      html += "</tr>";
    }
    tbody.innerHTML = html;
  }

  // --- HTMLエスケープ ---
  function escapeHtml(str) {
    if (!str) return "";
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // --- 初期化 ---
  function init() {
    renderAnnouncements();

    var classSelect = document.getElementById("class-select");
    if (classSelect) {
      renderSchedule(classSelect.value);
      classSelect.addEventListener("change", function () {
        renderSchedule(this.value);
      });
    }
  }

  document.addEventListener("DOMContentLoaded", init);
})();
