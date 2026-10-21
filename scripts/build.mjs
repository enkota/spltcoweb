import { copyFileSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { pixelSurfaces } from './pixel-surfaces.mjs';
import { siteHeader } from './navigation.mjs';
import { applySiteSettings } from './site-settings.mjs';
mkdirSync('dist', { recursive: true });
const pages = readdirSync('src').filter(file => file.endsWith('.html'));
// Keep published pages in sync with the HTML files in src.
for (const file of readdirSync('dist')) {
  if (file.endsWith('.html') && !pages.includes(file)) rmSync(`dist/${file}`);
}
mkdirSync('dist/downloads', { recursive: true });
for (const file of ['blocks-import.png', 'props-import.png', 'assets-import.png', 'decals-placement.png']) copyFileSync(`src/assets/${file}`, `dist/assets/${file}`);
copyFileSync('src/downloads/splatico.js', 'dist/downloads/splatico.js');
for (const file of pages) {
  const html = readFileSync(`src/${file}`, 'utf8').replace('<!-- SITE_HEADER -->', siteHeader(file));
  writeFileSync(`dist/${file}`, pixelSurfaces(applySiteSettings(html)));
}
copyFileSync('src/main.js', 'dist/main.js');
copyFileSync('src/pixel-rim.svg', 'dist/assets/pixel-rim.svg');
const zip = spawnSync('zip', ['-q', '-j', 'dist/splatico-press-kit.zip', 'src/press-kit.txt', ...['boot-logo.png', 'menu-logo-text.png', 'logo-splats.png', 'library.png', 'pool.png', 'hunter.png', 'hat-crown.png'].map(file => `dist/assets/${file}`)], { stdio: 'inherit' });
if (zip.status !== 0) process.exit(zip.status ?? 1);
const result = spawnSync(process.execPath, ['node_modules/@tailwindcss/cli/dist/index.mjs', '-i', 'src/styles.css', '-o', 'dist/styles.css', '--minify'], { stdio: 'inherit' });
if (result.status === 0) {
  // Keep cached markup paired with the exact stylesheet and script it was built with.
  const version = file => createHash('sha256').update(readFileSync(`dist/${file}`)).digest('hex').slice(0, 12);
  const css = version('styles.css');
  const js = version('main.js');
  for (const file of pages) {
    const html = readFileSync(`dist/${file}`, 'utf8')
      .replace('href="./styles.css"', `href="./styles.css?v=${css}"`)
      .replace('src="./main.js"', `src="./main.js?v=${js}"`);
    writeFileSync(`dist/${file}`, html);
  }
}
process.exit(result.status ?? 1);
