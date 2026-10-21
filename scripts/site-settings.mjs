import { readFileSync } from 'node:fs';

export const config = JSON.parse(readFileSync(new URL('../src/site-config.json', import.meta.url), 'utf8'));
if (!['wishlist', 'buy'].includes(config.steamButtonMode)) {
  throw new Error('src/site-config.json: steamButtonMode must be "wishlist" or "buy".');
}
if (!Number.isInteger(config.launchYear) || config.launchYear < 2000 || config.launchYear > 2100) {
  throw new Error('src/site-config.json: launchYear must be a year between 2000 and 2100.');
}
const siteUrl = new URL(config.siteUrl);
if (siteUrl.protocol !== 'https:' || !siteUrl.pathname.endsWith('/')) {
  throw new Error('src/site-config.json: siteUrl must be an HTTPS URL ending in /.');
}
if (new URL(config.steamUrl).protocol !== 'https:') {
  throw new Error('src/site-config.json: steamUrl must be an HTTPS URL.');
}
export const escapeHtml = value => String(value).replace(/[&<>"']/g, character => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
})[character]);

export function applySiteSettings(html) {
  const wishlist = config.steamButtonMode === 'wishlist';
  return html
    .replaceAll('{{STEAM_BUTTON_LABEL}}', wishlist ? 'Wishlist on Steam' : 'Buy on Steam')
    .replaceAll('{{STEAM_URL}}', escapeHtml(config.steamUrl))
    .replaceAll('{{LAUNCH_NOTICE}}', wishlist
      ? ` Launching ${config.launchYear}.`
      : '');
}
