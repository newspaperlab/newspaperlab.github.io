/* Newspaper Lab privacy notice v2026-11-06.1. No advertising/analytics requests. */
(() => {
  'use strict';
  if (window.NewspaperLabPrivacy) return;
  const VERSION = '2026-11-06.1';
  const KEY = 'nl_privacy_notice_v1';
  const DAYS = 180;
  const requested = new URLSearchParams(location.search).get('lang') || document.documentElement.lang.slice(0, 2);
  const language = ['ko', 'en', 'ja', 'zh'].includes(requested) ? requested : 'ko';
  const copy = {
    ko: { title: '개인정보와 쿠키 안내', intro: '현재 광고·분석용 쿠키를 사용하지 않습니다. 안내 확인 상태만 이 브라우저에 최대 180일 저장하며, 기사 열람에는 동의가 필요하지 않습니다.', acknowledge: '확인하고 닫기', settings: '쿠키·개인정보 설정', details: '자세히 보기', close: '닫기', essential: '필수 안내 설정', always: '이 브라우저에만 저장', essentialText: '이 안내를 확인했다는 상태와 정책 버전·만료 시각을 저장합니다. 방문 기록이나 식별자는 넣지 않으며 서버로 전송하지 않습니다.', analytics: '방문 분석', ads: '광고·맞춤 광고', inactive: '사용하지 않음', analyticsText: '방문 분석 도구를 설치하지 않았습니다.', adsText: '광고 코드를 실행하지 않으며 광고 쿠키에 동의한 것으로 처리하지 않습니다.', stored: '안내 확인 상태가 저장되어 있습니다.', unstored: '아직 저장된 확인 상태가 없습니다.', expires: '자동 만료', reset: '안내 확인 기록 삭제', resetDone: '이 브라우저의 안내 확인 기록을 삭제했습니다.', saved: '안내 확인 상태를 저장했습니다.', unavailable: '브라우저 저장이 차단되어 이번 페이지에서만 안내를 닫았습니다.', footer: ['개인정보처리방침', '이용약관', '쿠키 안내', '소개', '문의'], navigation: '운영 및 개인정보 안내', note: '현재 사용하지 않는 항목에는 동의 스위치가 없습니다. 광고나 분석 기능을 도입하면 적용 전에 안내와 필요한 선택 절차를 마련합니다.' },
    en: { title: 'Privacy and cookies', intro: 'No advertising or analytics cookies are used. We remember only that you have seen this notice, in this browser for up to 180 days. Reading articles does not require consent.', acknowledge: 'Got it', settings: 'Cookie & privacy settings', details: 'Read more', close: 'Close', essential: 'Essential notice preference', always: 'Stored only in this browser', essentialText: 'Stores acknowledgement, policy version and expiry. No browsing history or identifier is included or sent to a server.', analytics: 'Visitor analytics', ads: 'Advertising & personalization', inactive: 'Not in use', analyticsText: 'No visitor analytics tool is installed.', adsText: 'No ad code is run. Acknowledging this notice does not consent to advertising cookies.', stored: 'Your acknowledgement is saved.', unstored: 'No acknowledgement is saved.', expires: 'Expires', reset: 'Delete notice acknowledgement', resetDone: 'The notice acknowledgement has been deleted in this browser.', saved: 'Your acknowledgement has been saved.', unavailable: 'Browser storage is unavailable; the notice is closed only for this page.', footer: ['Privacy policy', 'Terms', 'Cookie notice', 'About', 'Contact'], navigation: 'Policies and contact', note: 'Inactive services have no consent switches. Before introducing ads or analytics, we will update the disclosures and required choices.' },
    ja: { title: 'プライバシーとCookie', intro: '現在、広告・アクセス解析用Cookieは使用していません。案内を確認した状態だけをこのブラウザーに最大180日保存します。記事の閲覧に同意は不要です。', acknowledge: '確認して閉じる', settings: 'Cookie・プライバシー設定', details: '詳細を見る', close: '閉じる', essential: '案内の確認設定', always: 'このブラウザー内のみ', essentialText: '確認状態、方針の版、期限のみを保存します。閲覧履歴や識別子は含めず、サーバーに送信しません。', analytics: 'アクセス解析', ads: '広告・パーソナライズ', inactive: '使用していません', analyticsText: 'アクセス解析ツールは導入していません。', adsText: '広告コードは実行しません。案内の確認は広告Cookieへの同意ではありません。', stored: '確認状態を保存しています。', unstored: '保存された確認状態はありません。', expires: '有効期限', reset: '確認記録を削除', resetDone: 'このブラウザーの確認記録を削除しました。', saved: '確認状態を保存しました。', unavailable: '保存が制限されているため、このページでのみ閉じました。', footer: ['プライバシー', '利用規約', 'Cookieの案内', '紹介', 'お問い合わせ'], navigation: '方針とお問い合わせ', note: '未使用の機能には同意スイッチを設けません。広告や解析の導入前に必要な案内と選択手続きを用意します。' },
    zh: { title: '隐私与Cookie说明', intro: '目前不使用广告或访问分析Cookie。仅在本浏览器保存已阅读提示的状态，最长180天。阅读文章不需要同意。', acknowledge: '了解并关闭', settings: 'Cookie与隐私设置', details: '了解详情', close: '关闭', essential: '必要的提示设置', always: '仅保存在本浏览器', essentialText: '只保存提示确认状态、政策版本和到期时间，不包含浏览记录或标识符，也不传往服务器。', analytics: '访问分析', ads: '广告与个性化', inactive: '未使用', analyticsText: '没有安装访问分析工具。', adsText: '不运行广告代码；确认提示不代表同意广告Cookie。', stored: '已保存提示确认状态。', unstored: '尚未保存确认状态。', expires: '到期时间', reset: '删除提示确认记录', resetDone: '已删除本浏览器的提示确认记录。', saved: '已保存确认状态。', unavailable: '浏览器禁止存储，仅在本页面关闭提示。', footer: ['隐私政策', '使用条款', 'Cookie说明', '关于', '联系'], navigation: '政策与联系', note: '未使用的服务没有同意开关。引入广告或分析之前，会更新说明并提供必要选择。' }
  }[language];
  function read() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return null;
      const value = JSON.parse(raw);
      const now = Date.now();
      if (value.version !== VERSION || value.acknowledged !== true || !Number.isFinite(value.expiresAt) || value.expiresAt <= now || value.expiresAt > now + DAYS * 86400000 + 60000) {
        localStorage.removeItem(KEY); return null;
      }
      return value;
    } catch (_) { try { localStorage.removeItem(KEY); } catch (_) {} return null; }
  }
  let banner, dialog, status, previousFocus;
  function element(tag, text, className) { const node = document.createElement(tag); if (text) node.textContent = text; if (className) node.className = className; return node; }
  function button(text, action) { const node = element('button', text, 'nl-button'); node.type = 'button'; node.addEventListener('click', action); return node; }
  function say(text) { if (status) status.textContent = text; }
  function refresh() {
    const record = read();
    if (dialog) {
      const state = dialog.querySelector('[data-nl-state]');
      state.textContent = record ? copy.stored + ' ' + copy.expires + ': ' + new Date(record.expiresAt).toLocaleDateString(language) : copy.unstored;
    }
    if (banner) banner.hidden = !!record;
    return record;
  }
  function acknowledge() {
    const value = { version: VERSION, acknowledged: true, expiresAt: Date.now() + DAYS * 86400000 };
    let persisted = false;
    try { localStorage.setItem(KEY, JSON.stringify(value)); persisted = true; } catch (_) {}
    if (banner) banner.hidden = true;
    if (dialog) { refresh(); if (!persisted && banner) banner.hidden = true; }
    close(); say(persisted ? copy.saved : copy.unavailable);
  }
  function close() { if (dialog && dialog.open) { if (typeof dialog.close === 'function') dialog.close(); else dialog.removeAttribute('open'); } }
  function open() {
    if (!dialog) return;
    previousFocus = document.activeElement;
    refresh();
    if (!dialog.open) { if (typeof dialog.showModal === 'function') dialog.showModal(); else dialog.setAttribute('open', ''); }
    dialog.querySelector('[data-nl-close]').focus();
  }
  function reset() {
    try { localStorage.removeItem(KEY); } catch (_) {}
    refresh(); say(copy.resetDone);
  }
  function boot() {
    status = element('div', '', 'nl-sr-only'); status.setAttribute('role', 'status'); status.setAttribute('aria-live', 'polite'); document.body.append(status);
    if (!document.querySelector('.nl-policy-links')) {
      const nav = element('nav', '', 'nl-policy-links'); nav.setAttribute('aria-label', copy.navigation);
      ['privacy', 'terms', 'cookies', 'about', 'contact'].forEach((path, index) => { const link = element('a', copy.footer[index]); link.href = '/' + path + '.html'; nav.append(link); });
      const control = element('button', copy.settings, 'nl-button'); control.type = 'button'; control.setAttribute('data-nl-open-settings', ''); nav.append(control); document.body.append(nav);
    }
    banner = element('section', '', 'nl-notice'); banner.setAttribute('aria-label', copy.title);
    const content = element('div', '', 'nl-notice-copy'); content.append(element('h2', copy.title), element('p', copy.intro));
    const more = element('a', copy.details); more.href = '/cookies.html'; content.append(more);
    const actions = element('div', '', 'nl-actions'); actions.append(button(copy.acknowledge, acknowledge), button(copy.settings, open)); banner.append(content, actions);
    dialog = element('dialog', '', 'nl-dialog'); dialog.setAttribute('aria-labelledby', 'nl-dialog-title');
    const title = element('h2', copy.settings); title.id = 'nl-dialog-title';
    const exit = button(copy.close, close); exit.setAttribute('data-nl-close', ''); exit.classList.add('nl-dialog-close');
    dialog.append(exit, title);
    const state = element('p', '', 'nl-state'); state.setAttribute('data-nl-state', ''); dialog.append(state);
    [[copy.essential, copy.always, copy.essentialText], [copy.analytics, copy.inactive, copy.analyticsText], [copy.ads, copy.inactive, copy.adsText]].forEach(([name, state, detail]) => {
      const section = element('section', '', 'nl-category'); section.append(element('h3', name), element('span', state, 'nl-badge'), element('p', detail)); dialog.append(section);
    });
    dialog.append(element('p', copy.note, 'nl-note'));
    const controls = element('div', '', 'nl-actions'); controls.append(button(copy.acknowledge, acknowledge), button(copy.reset, reset)); dialog.append(controls);
    const moreDialog = element('a', copy.details); moreDialog.href = '/privacy.html'; dialog.append(moreDialog);
    dialog.addEventListener('close', () => { if (previousFocus && previousFocus.isConnected) previousFocus.focus(); });
    dialog.addEventListener('cancel', () => {});
    dialog.addEventListener('click', e => { if (e.target === dialog) { const r = dialog.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) close(); } });
    document.body.append(banner, dialog);
    document.addEventListener('click', e => { const target = e.target.closest('[data-nl-open-settings]'); if (target) { e.preventDefault(); open(); } });
    window.addEventListener('storage', e => { if (e.key === KEY || e.key === null) refresh(); });
    refresh();
  }
  window.NewspaperLabPrivacy = Object.freeze({ version: VERSION, open, reset, getState: () => ({ necessary: true, analytics: false, advertising: false, noticeAcknowledged: !!read() }) });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true }); else boot();
})();
