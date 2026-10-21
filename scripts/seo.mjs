import { readFileSync } from 'node:fs';
import { communityLinks } from './navigation.mjs';
import { applySiteSettings, config, escapeHtml } from './site-settings.mjs';

const siteUrl = config.siteUrl;
const pageUrl = file => file === 'index.html' ? siteUrl : new URL(file, siteUrl).href;
const assetUrl = file => new URL(`assets/${file}`, siteUrl).href;
// The placeholder steamUrl is the Steam homepage; only advertise a real store page.
const steamPage = new URL(config.steamUrl).pathname.length > 1 ? config.steamUrl : null;
const socialImage = { src: assetUrl('social-preview.jpg'), width: 1200, height: 630, alt: 'Splatico swimming pool map with props hidden around the pool' };

const pageText = (html, pattern) => html.match(pattern)?.[1].replace(/\s+/g, ' ').trim() ?? '';

function structuredData(description) {
  const data = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'WebSite', '@id': `${siteUrl}#website`, url: siteUrl, name: 'Splatico', inLanguage: 'en-US' },
      {
        '@type': 'VideoGame',
        '@id': `${siteUrl}#game`,
        name: 'Splatico',
        alternateName: 'Splatico: Survive the Hunt',
        url: siteUrl,
        description,
        genre: ['Prop hunt', 'Multiplayer', 'Party'],
        gamePlatform: 'PC',
        playMode: 'MultiPlayer',
        applicationCategory: 'Game',
        image: socialImage.src,
        screenshot: ['library.png', 'pool.png', 'editor.png'].map(assetUrl),
        sameAs: [...communityLinks.map(([href]) => href), ...(steamPage ? [steamPage] : [])],
      },
    ],
  };
  return `<script type="application/ld+json">${JSON.stringify(data).replaceAll('<', '\\u003c')}</script>`;
}

// Canonical, Open Graph and X card tags built from each page's own <title> and description.
export function seoHead(file, html) {
  const title = pageText(html, /<title>([^<]*)<\/title>/);
  const description = pageText(html, /<meta name="description"\s+content="([^"]*)"/);
  const url = escapeHtml(pageUrl(file));
  const tags = [
    `<link rel="canonical" href="${url}">`,
    '<meta property="og:type" content="website">',
    '<meta property="og:site_name" content="Splatico">',
    '<meta property="og:locale" content="en_US">',
    `<meta property="og:title" content="${title}">`,
    `<meta property="og:description" content="${description}">`,
    `<meta property="og:url" content="${url}">`,
    `<meta property="og:image" content="${socialImage.src}">`,
    `<meta property="og:image:width" content="${socialImage.width}">`,
    `<meta property="og:image:height" content="${socialImage.height}">`,
    `<meta property="og:image:alt" content="${socialImage.alt}">`,
    '<meta name="twitter:card" content="summary_large_image">',
    '<meta name="twitter:site" content="@splatico_game">',
  ];
  if (file === 'index.html') tags.push(structuredData(description));
  return `  ${tags.join('\n  ')}\n`;
}

// robots.txt, sitemap.xml and llms.txt for the published pages.
export function crawlerFiles(pages) {
  const urls = [...pages].sort((a, b) => (b === 'index.html') - (a === 'index.html')).map(file => `  <url><loc>${pageUrl(file)}</loc></url>`).join('\n');
  const llms = applySiteSettings(readFileSync('src/llms.txt', 'utf8'))
    .replaceAll('{{SITE_URL}}', siteUrl)
    .replace('{{STEAM_LINK}}\n', steamPage ? `- [Steam store page](${steamPage})\n` : '');
  return {
    'robots.txt': `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}sitemap.xml\n`,
    'sitemap.xml': `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
    'llms.txt': llms,
  };
}
