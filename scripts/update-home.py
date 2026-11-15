"""Refresh the Korean archive on the homepage and the unified XML sitemap."""
from html import escape
import json
from pathlib import Path
import re
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
SITE = 'https://newspaperlab.github.io'
EDITIONS = {'airlog': 'AIRLOG', 'electronews': 'Electro News'}
SITEMAP_NS = 'http://www.sitemaps.org/schemas/sitemap/0.9'


def entry(edition, article, featured=False):
    base = f'/news/{edition}/'
    href = escape(f"{base}articles/{article['id']}/ko.html", quote=True)
    body = article['locales']['ko']
    published = article.get('published') or article['date']
    image = article.get('image') or {}
    cover = image.get('url')
    picture = ''
    if featured and cover:
        if not cover.startswith(('https://', '/')):
            cover = base + cover
        alt = (image.get('alt') or {}).get('ko', '')
        picture = f'<img src="{escape(cover, quote=True)}" alt="{escape(alt, quote=True)}">'
    label = EDITIONS[edition]
    return (
        f'<article data-edition="{edition}"><a href="{href}">{picture}'
        f'<div class="story-copy"><p class="story-meta">{label} · '
        f'<time datetime="{escape(published)}">{escape(published)}</time></p>'
        f'<h3>{escape(body["title"])}</h3><p class="story-summary">{escape(body["summary"])}</p>'
        '</div></a></article>'
    )


def replace_block(page, name, content):
    start, end = f'<!-- {name}:start -->', f'<!-- {name}:end -->'
    if page.count(start) != 1 or page.count(end) != 1:
        raise ValueError(f'Missing or duplicate homepage marker for {name}')
    return re.sub(re.escape(start) + '.*?' + re.escape(end),
                  lambda _: f'{start}\n{content}\n{end}', page, flags=re.S)


def main():
    archive = []
    featured = []
    for edition in EDITIONS:
        articles = json.loads((ROOT / 'news' / edition / 'news.json').read_text())['articles']
        if articles:
            featured.append(entry(edition, articles[0], featured=True))
        archive.extend((edition, article) for article in articles)
    archive.sort(key=lambda item: item[1].get('published') or item[1]['date'], reverse=True)

    homepage = ROOT / 'index.html'
    page = replace_block(homepage.read_text(), 'featured', '\n'.join(featured))
    page = replace_block(page, 'archive', '\n'.join(entry(*item) for item in archive))
    homepage.write_text(page)

    ET.register_namespace('', SITEMAP_NS)
    tag = lambda name: f'{{{SITEMAP_NS}}}{name}'
    urlset = ET.Element(tag('urlset'))
    seen = set()
    for path in ('/', '/privacy.html', '/cookies.html', '/terms.html', '/about.html', '/contact.html'):
        address = SITE + path
        ET.SubElement(ET.SubElement(urlset, tag('url')), tag('loc')).text = address
        seen.add(address)
    for edition in EDITIONS:
        sitemap = ET.parse(ROOT / 'news' / edition / 'sitemap.xml')
        for url in sitemap.getroot().findall(tag('url')):
            address = url.findtext(tag('loc'))
            if address and address not in seen:
                urlset.append(url)
                seen.add(address)
    ET.indent(urlset)
    ET.ElementTree(urlset).write(ROOT / 'sitemap.xml', encoding='utf-8', xml_declaration=True)


if __name__ == '__main__':
    main()
