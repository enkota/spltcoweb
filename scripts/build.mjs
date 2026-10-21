import { copyFileSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { buildFeaturePages } from './pages.mjs';
import { pixelSurfaces } from './pixel-surfaces.mjs';
import { siteHeader } from './navigation.mjs';
mkdirSync('dist', { recursive: true });
// Remove retired pages from existing output directories.
for (const file of ['customization.html', 'customisation.html']) rmSync(`dist/${file}`, { force: true });
mkdirSync('dist/downloads', { recursive: true });
for (const file of ['blocks-import.png', 'props-import.png', 'assets-import.png', 'decals-placement.png']) copyFileSync(`src/assets/${file}`, `dist/assets/${file}`);
copyFileSync('src/downloads/splatico.js', 'dist/downloads/splatico.js');
writeFileSync('dist/index.html', readFileSync('src/index.html', 'utf8').replace('<!-- SITE_HEADER -->', siteHeader()));
copyFileSync('src/main.js', 'dist/main.js');
buildFeaturePages();
for (const file of ['index.html', 'map-editor.html', 'game-modes.html', 'chaos.html']) {
  writeFileSync(`dist/${file}`, pixelSurfaces(readFileSync(`dist/${file}`, 'utf8')));
}
copyFileSync('src/pixel-rim.svg', 'dist/assets/pixel-rim.svg');
const zip = spawnSync('zip', ['-q', '-j', 'dist/splatico-press-kit.zip', 'src/press-kit.txt', ...['boot-logo.png', 'menu-logo-text.png', 'logo-splats.png', 'library.png', 'pool.png', 'hunter.png', 'hat-crown.png'].map(file => `dist/assets/${file}`)], { stdio: 'inherit' });
if (zip.status !== 0) process.exit(zip.status ?? 1);
const result = spawnSync(process.execPath, ['node_modules/@tailwindcss/cli/dist/index.mjs', '-i', 'src/styles.css', '-o', 'dist/styles.css', '--minify'], { stdio: 'inherit' });
if (result.status === 0) {
  // Keep cached markup paired with the exact stylesheet and script it was built with.
  const version = file => createHash('sha256').update(readFileSync(`dist/${file}`)).digest('hex').slice(0, 12);
  const css = version('styles.css');
  const js = version('main.js');
  for (const file of ['index.html', 'map-editor.html', 'game-modes.html', 'chaos.html']) {
    const html = readFileSync(`dist/${file}`, 'utf8')
      .replace('href="./styles.css"', `href="./styles.css?v=${css}"`)
      .replace('src="./main.js"', `src="./main.js?v=${js}"`);
    writeFileSync(`dist/${file}`, html);
  }
}
process.exit(result.status ?? 1);
