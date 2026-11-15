const route = location.pathname.match(/^\/news\/(airlog|electronews)\/articles\/([^/]+)\/(ko|en|ja|zh)\.html$/);
const headline = document.querySelector('.article-head h1');
const reading = document.querySelector('.reading');

if (route && headline && reading) {
  const [, edition, articleId, lang] = route;
  const base = `/news/${edition}/`;
  const key = 'nl_article_bookmarks_v1';
  const bookmarkId = `${edition}/${articleId}`;
  const canonical = document.querySelector('link[rel="canonical"]')?.href || location.origin + location.pathname;
  const [searchLabel, saveLabel, libraryLabel, shareLabel, fontLabel, printLabel, relatedLabel,
    closeLabel, emptyLabel, savedLabel, removedLabel, copyLabel, copyHelp, storageError, sizeLabel] = {
    ko: ['기사 검색', '북마크', '저장 기사', '공유', '글자 크기', '인쇄', '함께 읽을 기사',
      '닫기', '저장한 기사가 없습니다.', '이 브라우저에 저장했어요.', '북마크를 해제했어요.', '기사 링크를 복사했어요.', '기사 링크를 선택해 복사하세요.', '브라우저에 저장할 수 없어요.', '본문 글자 크기'],
    en: ['Search articles', 'Bookmark', 'Saved', 'Share', 'Text size', 'Print', 'Related stories',
      'Close', 'No saved articles.', 'Saved in this browser.', 'Bookmark removed.', 'Article link copied.', 'Select and copy the article link.', 'This browser could not save the bookmark.', 'Article text size'],
    ja: ['記事検索', '保存', '保存済み', '共有', '文字サイズ', '印刷', '関連記事',
      '閉じる', '保存した記事はありません。', 'このブラウザーに保存しました。', '保存を解除しました。', '記事リンクをコピーしました。', '記事リンクを選択してコピーしてください。', 'このブラウザーに保存できません。', '本文の文字サイズ'],
    zh: ['搜索报道', '收藏', '已收藏', '分享', '字号', '打印', '相关阅读',
      '关闭', '没有已收藏的报道。', '已保存到此浏览器。', '已取消收藏。', '已复制报道链接。', '请选择并复制报道链接。', '无法在此浏览器中保存。', '正文的字号'],
  }[lang];

  function element(tag, text, className) {
    const node = document.createElement(tag);
    if (text) node.textContent = text;
    if (className) node.className = className;
    return node;
  }

  const header = document.querySelector('.topline header');
  const search = element('form', '', 'article-search');
  search.setAttribute('role', 'search');
  const field = element('input');
  field.type = 'search';
  field.placeholder = searchLabel;
  field.setAttribute('aria-label', searchLabel);
  field.required = true;
  const find = element('button', '⌕');
  find.type = 'submit';
  find.setAttribute('aria-label', searchLabel);
  search.append(field, find);
  search.addEventListener('submit', event => {
    event.preventDefault();
    const query = field.value.trim();
    if (query) location.assign(`${base}?lang=${lang}#${new URLSearchParams({q: query})}`);
  });
  if (header) header.insertBefore(search, header.querySelector('.languages'));

  function readBookmarks() {
    try {
      const data = JSON.parse(localStorage.getItem(key) || '{}');
      return data && typeof data === 'object' && !Array.isArray(data) ? data : {};
    } catch (_) {
      return {};
    }
  }

  const rail = element('div', '', 'article-tools');
  const status = element('p', '', 'article-status');
  status.setAttribute('role', 'status');
  status.hidden = true;
  let statusTimer;
  function say(text) {
    clearTimeout(statusTimer);
    status.textContent = text;
    status.hidden = false;
    statusTimer = setTimeout(() => { status.hidden = true; }, 3200);
  }

  function control(label, symbol, onClick) {
    const button = element('button', '', 'article-tool');
    button.type = 'button';
    const icon = element('span', symbol, 'article-tool-icon');
    icon.setAttribute('aria-hidden', 'true');
    button.append(icon, element('span', label));
    button.addEventListener('click', onClick);
    return button;
  }

  const bookmark = control(saveLabel, '☆', () => {
    const saved = readBookmarks();
    const removing = Object.hasOwn(saved, bookmarkId);
    if (removing) delete saved[bookmarkId];
    else saved[bookmarkId] = {title: headline.textContent.trim(), path: location.pathname};
    try {
      if (Object.keys(saved).length) localStorage.setItem(key, JSON.stringify(saved));
      else localStorage.removeItem(key);
      updateBookmark();
      say(removing ? removedLabel : savedLabel);
    } catch (_) {
      say(storageError);
    }
  });

  function updateBookmark() {
    const isSaved = Object.hasOwn(readBookmarks(), bookmarkId);
    bookmark.setAttribute('aria-pressed', String(isSaved));
    bookmark.firstElementChild.textContent = isSaved ? '★' : '☆';
  }
  updateBookmark();
  window.addEventListener('storage', event => { if (!event.key || event.key === key) updateBookmark(); });

  const dialog = element('dialog', '', 'article-dialog');
  const dialogTitle = element('h2', '');
  dialogTitle.id = 'article-dialog-title';
  dialog.setAttribute('aria-labelledby', dialogTitle.id);
  const dialogBody = element('div');
  const close = element('button', closeLabel, 'article-dialog-close');
  close.type = 'button';
  close.addEventListener('click', () => dialog.close());
  dialog.append(dialogTitle, dialogBody, close);
  document.body.append(dialog);

  function openDialog(title, content) {
    dialogTitle.textContent = title;
    dialogBody.replaceChildren(content);
    if (!dialog.open) dialog.showModal();
  }

  const library = control(libraryLabel, '▤', () => {
    const list = element('ul');
    for (const item of Object.values(readBookmarks()).reverse()) {
      if (typeof item?.path !== 'string' || !/^\/news\/(airlog|electronews)\/articles\/[^/]+\/(ko|en|ja|zh)\.html$/.test(item.path)) continue;
      const li = element('li');
      const link = element('a', item.title || item.path);
      link.href = item.path;
      li.append(link);
      list.append(li);
    }
    openDialog(libraryLabel, list.children.length ? list : element('p', emptyLabel));
  });

  const share = control(shareLabel, '↗', async () => {
    if (navigator.share) {
      try {
        await navigator.share({title: headline.textContent.trim(), url: canonical});
        return;
      } catch (error) {
        if (error.name === 'AbortError') return;
      }
    }
    try {
      await navigator.clipboard.writeText(canonical);
      say(copyLabel);
    } catch (_) {
      const copyField = element('input');
      copyField.readOnly = true;
      copyField.value = canonical;
      copyField.setAttribute('aria-label', copyHelp);
      openDialog(copyHelp, copyField);
      copyField.select();
    }
  });

  const font = control(fontLabel, 'Aa', () => {
    const sizes = element('div', '', 'article-size-options');
    for (const [value, label] of [['.93','A−'], ['1','A'], ['1.2','A+']]) {
      const button = element('button', label);
      button.type = 'button';
      button.setAttribute('aria-label', `${sizeLabel} ${Math.round(Number(value) * 100)}%`);
      button.addEventListener('click', () => {
        reading.style.setProperty('--reading-scale', value);
        dialog.close();
      });
      sizes.append(button);
    }
    openDialog(sizeLabel, sizes);
  });

  rail.append(bookmark, library, share, font, control(printLabel, '⎙', () => window.print()), status);
  document.querySelector('.article-head').after(rail);

  const articlePath = new RegExp(`^${base}articles/([^/]+)/${lang}\\.html$`);
  const prior = [...reading.querySelectorAll('.sources')].find(section => {
    const links = [...section.querySelectorAll('a[href]')];
    return links.length && links.every(link => articlePath.test(new URL(link.href).pathname));
  });
  const preferredIds = prior ? [...prior.querySelectorAll('a')].map(link => new URL(link.href).pathname.match(articlePath)[1]) : [];
  const fallbackDate = date => String(date || '').slice(0, 10);
  const last = reading.querySelector('.back');
  const loadRelated = async () => {
    const response = await fetch(`${base}news.json`);
    if (!response.ok) return;
    const {articles} = await response.json();
    if (!Array.isArray(articles)) return;
    const current = articles.find(row => row.id === articleId);
    const candidates = articles.filter(row => row.id !== articleId && row.locales?.[lang]?.title);
    const score = row => {
      const index = preferredIds.indexOf(row.id);
      if (index >= 0) return 100 - index;
      return current?.category?.[lang] === row.category?.[lang] ? 1 : 0;
    };
    candidates.sort((a, b) => score(b) - score(a) ||
      fallbackDate(b.published || b.date).localeCompare(fallbackDate(a.published || a.date)));
    const section = element('section', '', 'article-related');
    const title = element('h2', relatedLabel);
    title.id = 'related-stories';
    section.setAttribute('aria-labelledby', title.id);
    const list = element('ul');
    for (const row of candidates.slice(0, 4)) {
      const item = element('li');
      const link = element('a');
      link.href = `${base}articles/${encodeURIComponent(row.id)}/${lang}.html`;
      const copy = element('span', row.locales[lang].title, 'related-title');
      const date = fallbackDate(row.published || row.date);
      if (date) {
        const time = element('time', date);
        time.dateTime = date;
        copy.append(time);
      }
      link.append(copy);
      if (row.image?.url) {
        const source = new URL(row.image.url, new URL(base, location.origin));
        if (source.origin === location.origin) {
          const image = element('img');
          image.loading = 'lazy';
          image.alt = '';
          image.src = source.href;
          link.append(image);
        }
      }
      item.append(link);
      list.append(item);
    }
    if (!list.children.length) return;
    section.append(title, list);
    if (prior) prior.replaceWith(section);
    else reading.insertBefore(section, last);
  };
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting)) return;
      observer.disconnect();
      loadRelated().catch(() => {});
    }, {rootMargin: '350px'});
    observer.observe(prior || last || reading.lastElementChild || reading);
  } else {
    loadRelated().catch(() => {});
  }
}
