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
