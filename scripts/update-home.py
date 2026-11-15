"""Refresh the unified sitemap from both editions."""
from pathlib import Path
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
SITE = 'https://newspaperlab.github.io'
EDITIONS = ('airlog', 'electronews')
SITEMAP_NS = 'http://www.sitemaps.org/schemas/sitemap/0.9'


def main():
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
