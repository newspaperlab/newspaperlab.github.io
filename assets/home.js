const translations = {
  en: {
    labels: ['Aviation and electronics news & analysis', 'Latest stories', 'Featured explainers', 'Our publications',
      'Aviation news', 'Airlines, airports, routes and what aircraft changes mean for travelers.',
      'Electronics news', 'New devices and consumer technology, with specs, compatibility and buying conditions.',
      'Language', 'AI-generated illustration'],
    description: 'Read aviation news from Airlog and consumer technology news from Electro News, with analysis of the decisions and changes behind each story.',
    intro: "A new route opens. What changes for your trip? A new device launches. Which specs matter? We look at the questions that come up after the headline.",
    features: [
      "Ever wondered why a route that always needed a connection finally gets a nonstop flight? Start with seat count and range.",
      "Will it last a full day outdoors? See what Sony’s 12-hour claim assumes and what the USB-C port can do.",
    ],
  },
  ja: {
    labels: ['航空・電子機器のニュースと解説', '最新記事', '注目の解説', 'メディア紹介',
      '航空ニュース', '航空会社、空港、路線や機材の変更が旅行に与える影響を紹介します。',
      '電子機器ニュース', '新製品と消費者向け技術の仕様、互換性、購入条件を解説します。',
      '言語', 'AI生成の参考イラスト'],
    description: 'Airlogの航空ニュースとElectro Newsの消費者向け技術ニュースを、発表の背景や影響とともにお届けします。',
    intro: "新路線ができると旅はどう変わる？ 新しい機器を買うならどの仕様を見る？ ニュースをきっかけに、気になるところを一つずつ見ていきます。",
    features: [
      "乗り継ぎが当たり前だった区間に直行便ができるのはなぜ？ 座席数と航続距離を見てみましょう。",
      "外で一日使える？ ソニーが示す12時間の条件と、USB-C端子でできることを確認しました。",
    ],
  },
  zh: {
    labels: ['航空与电子设备新闻及解读', '最新报道', '重点解读', '旗下媒体',
      '航空新闻', '关注航司、机场、航线和机型变化对出行的影响。',
      '电子设备新闻', '解读新品及消费技术的规格、兼容性与购买条件。',
      '语言', 'AI 生成示意图'],
    description: '阅读 Airlog 的航空新闻和 Electro News 的消费科技报道，了解重要发布背后的原因及其影响。',
    intro: "有了新航线，出行会怎么变？买新设备时，又该看哪些参数？我们跟着新闻，把这些问题一个个讲清楚。",
    features: [
      "以前总要转机的地方，为什么有一天能直飞了？可以先看看飞机的座位数和航程。",
      "带出门能用一整天吗？来看看索尼所说的12小时有什么条件，USB-C接口又能做什么。",
    ],
  },
};
const requested = new URLSearchParams(location.search).get('lang');
const lang = Object.hasOwn(translations, requested) ? requested : 'ko';
const locale = translations[lang];
if (locale) {
  const ids = ['page-title', 'latest-heading', 'featured-heading', 'editions-heading', 'airlog-topic', 'airlog-desc',
    'electronews-topic', 'electronews-desc'];
  document.documentElement.lang = lang === 'zh' ? 'zh-Hans' : lang;
  document.getElementById('home-intro').textContent = locale.intro;
  document.title = `Newspaper Lab | ${locale.labels[0]}`;
  document.querySelector('meta[name=description]').content = locale.description;
  ids.forEach((id, index) => { document.getElementById(id).textContent = locale.labels[index]; });
  const languages = document.querySelector('.home-languages');
  languages.setAttribute('aria-label', locale.labels[8]);
  languages.querySelector('[aria-current]').removeAttribute('aria-current');
  languages.querySelector(`[href="/?lang=${lang}"]`).setAttribute('aria-current', 'page');
  for (const link of document.querySelectorAll('[data-edition-link], [data-localized-link], .logo')) {
    const url = new URL(link.href);
    url.searchParams.set('lang', lang);
    link.href = url;
  }
  for (const card of document.querySelectorAll('.story-card')) card.lang = 'ko';
}

const sitemapNamespace = 'http://www.sitemaps.org/schemas/sitemap/0.9';
const newsNamespace = 'http://www.google.com/schemas/sitemap-news/0.9';
const parser = new DOMParser();

async function readPage(path, type) {
  const response = await fetch(path);
  if (!response.ok) throw new Error(`Could not read ${path}`);
  return parser.parseFromString(await response.text(), type);
}

function localizedArticle(path) {
  return path.replace(/\/ko\.html$/, `/${lang}.html`);
}

async function storyCard(template, path, date, note) {
  const href = localizedArticle(path);
  const article = await readPage(href, 'text/html');
  const title = article.querySelector('meta[property="og:title"]')?.content;
  const summary = article.querySelector('meta[name="description"]')?.content;
  const cover = article.querySelector('.cover img');
  const src = cover && new URL(cover.getAttribute('src'), new URL(href, location.origin));
  if (!title || !summary || !src || src.origin !== location.origin) throw new Error(`Incomplete article ${href}`);
  const card = template.cloneNode(true);
  card.removeAttribute('lang');
  const link = card.querySelector('h3 a');
  link.href = href;
  link.textContent = title;
  card.querySelector('.story-summary').textContent = note || summary;
  const time = card.querySelector('time');
  time.dateTime = date;
  time.textContent = date;
  const image = card.querySelector('img');
  image.src = src.href;
  image.alt = cover.alt;
  card.querySelector('figcaption')?.remove();
  const disclosure = article.querySelector('.cover figcaption')?.textContent.trim();
  if (disclosure) {
    const caption = document.createElement('figcaption');
    caption.textContent = disclosure;
    image.after(caption);
  }
  return card;
}

async function refreshLatest(list) {
  const edition = list.dataset.latest;
  const sitemap = await readPage(`/news/${edition}/news-sitemap.xml`, 'application/xml');
  const entries = [...sitemap.getElementsByTagNameNS(sitemapNamespace, 'url')].flatMap(entry => {
    const address = entry.getElementsByTagNameNS(sitemapNamespace, 'loc')[0]?.textContent;
    const date = entry.getElementsByTagNameNS(newsNamespace, 'publication_date')[0]?.textContent.slice(0, 10);
    if (!address || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return [];
    const url = new URL(address);
    const prefix = `/news/${edition}/articles/`;
    if (url.origin !== location.origin || !url.pathname.startsWith(prefix) ||
        !/^[a-z0-9-]+\/ko\.html$/.test(url.pathname.slice(prefix.length))) return [];
    return [{path: url.pathname, date}];
  });
  const latest = entries.sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3);
  if (latest.length !== 3) return;
  const current = [...list.querySelectorAll('.story-card')].map(card => ({
    path: new URL(card.querySelector('h3 a').href).pathname,
    date: card.querySelector('time').dateTime,
  }));
  if (lang === 'ko' && latest.every(({path, date}, index) =>
    path === current[index]?.path && date === current[index]?.date)) return;
  const cards = await Promise.all(latest.map(({path, date}) => storyCard(list.firstElementChild, path, date)));
  list.replaceChildren(...cards);
}

for (const list of document.querySelectorAll('[data-latest]')) {
  refreshLatest(list).catch(() => { /* Keep the published HTML when the feed is unavailable. */ });
}
if (locale) {
  document.querySelectorAll('#featured-stories .story-card').forEach((card, index) => {
    const path = new URL(card.querySelector('h3 a').href).pathname;
    storyCard(card, path, card.querySelector('time').dateTime, locale.features[index])
      .then(translated => card.replaceWith(translated))
      .catch(() => { /* Keep the original article link reachable. */ });
  });
}

if (matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)').matches) {
  for (const card of document.querySelectorAll('[data-edition-link]')) {
    card.addEventListener('pointermove', event => {
      const bounds = card.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - .5;
      const y = (event.clientY - bounds.top) / bounds.height - .5;
      card.style.setProperty('--shift-x', `${x * 17}px`);
      card.style.setProperty('--shift-y', `${y * 12}px`);
    });
    card.addEventListener('pointerleave', () => {
      card.style.removeProperty('--shift-x');
      card.style.removeProperty('--shift-y');
    });
  }
}

const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
let transitionLayer;
for (const link of document.querySelectorAll('[data-edition-link]')) {
  link.addEventListener('click', event => {
    if (event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey ||
        event.shiftKey || event.altKey || motionPreference.matches || !Element.prototype.animate) return;
    event.preventDefault();
    if (transitionLayer) return;

    const start = link.getBoundingClientRect();
    const preview = link.cloneNode(true);
    preview.removeAttribute('href');
    preview.setAttribute('aria-hidden', 'true');
    for (const node of preview.querySelectorAll('[id]')) node.removeAttribute('id');

    const edition = link.querySelector('.edition-name').textContent;
    const label = document.createElement('span');
    label.className = 'edition-transition-label';
    label.setAttribute('role', 'status');
    label.textContent = {
      en: `Opening ${edition}`,
      ja: `${edition} に移動します`,
      zh: `正在打开 ${edition}`,
    }[requested] || `${edition}로 이동합니다`;

    transitionLayer = document.createElement('div');
    transitionLayer.className = 'edition-transition';
    transitionLayer.append(preview, label);
    document.body.append(transitionLayer);
    transitionLayer.animate(
      [
        {top: `${start.top}px`, left: `${start.left}px`, width: `${start.width}px`, height: `${start.height}px`, borderRadius: '14px'},
        {top: '0px', left: '0px', width: '100vw', height: '100dvh', borderRadius: '0px'},
      ],
      {duration: 460, easing: 'cubic-bezier(.25,.78,.19,1)', fill: 'both'}
    ).finished
      .then(() => location.assign(link.href))
      .catch(() => { if (transitionLayer) location.assign(link.href); });
  });
}
window.addEventListener('pageshow', () => {
  const layer = transitionLayer;
  transitionLayer = null;
  layer?.remove();
});
