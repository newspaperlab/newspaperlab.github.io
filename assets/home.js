const languages = {
  ko: ['항공·전자기기 뉴스', '매일 오전 7시, 새로운 기사를 전합니다.', '최신 기사', '전체 기사', '제목이나 키워드 검색', '기사 검색', '매체', '모든 매체', n => `기사 ${n}편`, '다국어 목록을 불러오지 못해 한국어 기사를 표시합니다.'],
  en: ['Aviation & electronics news', 'New stories daily at 7 a.m. KST.', 'Latest stories', 'All stories', 'Search titles or keywords', 'Search stories', 'Edition', 'All editions', n => `${n} stories`, 'The translated archive is unavailable. Showing Korean stories.'],
  ja: ['航空・電子機器ニュース', '毎日午前7時（韓国時間）に新着記事を公開します。', '最新記事', 'すべての記事', 'タイトルやキーワードで検索', '記事を検索', 'メディア', 'すべてのメディア', n => `${n}件の記事`, '多言語版を読み込めなかったため、韓国語の記事を表示しています。'],
  zh: ['航空与电子设备新闻', '每天韩国时间上午7点发布新文章。', '最新文章', '全部文章', '搜索标题或关键词', '搜索文章', '媒体', '所有媒体', n => `${n}篇文章`, '暂时无法加载多语言列表，现显示韩语文章。'],
};
const editions = { airlog: 'AIRLOG', electronews: 'Electro News' };
const requested = new URLSearchParams(location.search).get('lang');
const lang = Object.hasOwn(languages, requested) ? requested : 'ko';
const [title, schedule, latestTitle, archiveTitle, placeholder, searchLabel, editionLabel, allEditions, countLabel, loadError] = languages[lang];
const archive = document.querySelector('#archive');
const featured = document.querySelector('#featured');
const input = document.querySelector('#article-search');
const filter = document.querySelector('#edition-filter');
const status = document.querySelector('#archive-status');
let statusNote = '';

document.documentElement.lang = lang === 'zh' ? 'zh-Hans' : lang;
document.title = `Newspaper Lab | ${title}`;
document.querySelector('#page-title').textContent = title;
document.querySelector('#schedule').textContent = schedule;
document.querySelector('#featured-title').textContent = latestTitle;
document.querySelector('#archive-title').textContent = archiveTitle;
input.placeholder = placeholder;
input.setAttribute('aria-label', searchLabel);
filter.setAttribute('aria-label', editionLabel);
filter.options[0].textContent = allEditions;
for (const link of document.querySelectorAll('.languages a')) {
  if (new URL(link.href).searchParams.get('lang') === lang) link.setAttribute('aria-current', 'true');
  else link.removeAttribute('aria-current');
}
for (const link of document.querySelectorAll('[data-edition-link]')) {
  const url = new URL(link.href);
  url.searchParams.set('lang', lang);
  link.href = url;
}

function element(tag, text, className) {
  const node = document.createElement(tag);
  if (text) node.textContent = text;
  if (className) node.className = className;
  return node;
}

function makeStory(edition, article, showImage = false) {
  const base = `/${edition}/`;
  const locale = article.locales[lang] ? lang : 'ko';
  const { title, summary } = article.locales[locale];
  const published = article.published || article.date;
  const card = element('article');
  card.dataset.edition = edition;
  const link = element('a');
  link.href = `${base}articles/${encodeURIComponent(article.id)}/${locale}.html`;
  if (showImage && article.image?.url) {
    const image = element('img');
    image.src = new URL(article.image.url, new URL(base, location.origin));
    image.alt = article.image.alt?.[locale] || '';
    link.append(image);
  }
  const copy = element('div', null, 'story-copy');
  const meta = element('p', `${editions[edition]} · `, 'story-meta');
  const time = element('time', published);
  time.dateTime = published;
  meta.append(time);
  copy.append(meta, element('h3', title), element('p', summary, 'story-summary'));
  link.append(copy);
  card.append(link);
  return card;
}

function applyFilter() {
  const query = input.value.trim().toLocaleLowerCase();
  let count = 0;
  for (const article of archive.children) {
    const matchesEdition = !filter.value || article.dataset.edition === filter.value;
    article.hidden = !matchesEdition || !article.textContent.toLocaleLowerCase().includes(query);
    if (!article.hidden) count++;
  }
  status.textContent = [statusNote, countLabel(count)].filter(Boolean).join(' · ');
}

input.addEventListener('input', applyFilter);
filter.addEventListener('change', applyFilter);
document.querySelector('.archive-tools').hidden = false;
applyFilter();

if (lang !== 'ko') {
  Promise.all(Object.keys(editions).map(async edition => {
    const response = await fetch(`/${edition}/news.json`);
    if (!response.ok) throw new Error(`Archive returned ${response.status}`);
    const data = await response.json();
    return data.articles.map(article => ({ edition, article }));
  })).then(groups => {
    featured.replaceChildren(...groups.filter(group => group.length).map(([{ edition, article }]) => makeStory(edition, article, true)));
    const entries = groups.flat();
    entries.sort((left, right) =>
      (right.article.published || right.article.date).localeCompare(left.article.published || left.article.date));
    archive.replaceChildren(...entries.map(({ edition, article }) => makeStory(edition, article)));
    applyFilter();
  }).catch(() => {
    statusNote = loadError;
    applyFilter();
  });
}
