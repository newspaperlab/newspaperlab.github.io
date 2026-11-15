const translations = {
  en: ['Choose a publication', 'Aviation news', 'Airlines, airports and new routes', 'Electronics news', 'New devices and everyday technology'],
  ja: ['メディアを選ぶ', '航空ニュース', '航空会社、空港、新路線', '電子機器ニュース', '新製品と身近なテクノロジー'],
  zh: ['请选择媒体', '航空新闻', '航司、机场与新航线', '电子设备新闻', '新品与日常科技'],
};
const requested = new URLSearchParams(location.search).get('lang');
if (Object.hasOwn(translations, requested)) {
  const ids = ['page-title', 'airlog-topic', 'airlog-desc', 'electronews-topic', 'electronews-desc'];
  const labels = translations[requested];
  document.documentElement.lang = requested === 'zh' ? 'zh-Hans' : requested;
  document.title = `Newspaper Lab | ${labels[0]}`;
  ids.forEach((id, index) => { document.getElementById(id).textContent = labels[index]; });
  for (const link of document.querySelectorAll('[data-edition-link]')) {
    const url = new URL(link.href);
    url.searchParams.set('lang', requested);
    link.href = url;
  }
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
