import { readFileSync } from 'node:fs';

const gamePages = [
  ['index.html', 'Overview', '#about'],
  ['game-modes.html', 'Game modes'],
  ['map-editor.html', 'Map editor'],
];
export const communityLinks = [
  ['https://discord.gg/P88g5WmsQS', 'Discord', 'discord', 'button-discord'],
  ['https://x.com/splatico_game', 'Follow', 'x', 'button-orange'],
  ['https://www.reddit.com/r/Splatico/', 'Reddit', 'reddit', 'button-reddit'],
  ['https://splatico.fandom.com/wiki/Splatico_Wiki', 'Wiki', 'fandom'],
];
const communityIcons = Object.fromEntries(communityLinks.map(([, , icon]) => [
  icon, readFileSync(new URL(`../src/assets/community-${icon}.svg`, import.meta.url), 'utf8').trim(),
]));
const chevron = '<svg class="nav-chevron" viewBox="0 0 12 6" shape-rendering="crispEdges" aria-hidden="true"><path fill="currentColor" d="M0 0H12V2H10V4H8V6H4V4H2V2H0Z"/></svg>';
const sectionLink = (file, id) => file === 'index.html' ? `#${id}` : `./index.html#${id}`;

export function siteHeader(file = 'index.html') {
  const pages = gamePages.map(([target, label, hash = '']) => `<a class="pixel-button button-dark button-small nav-menu-link" aria-label="${label}" href="./${target}${hash}"${target === file ? ' aria-current="page"' : ''}>${label}</a>`).join('');
  const socials = communityLinks.map(([href, label, icon, variant = 'button-dark']) => `<a class="pixel-button ${variant} button-small nav-menu-link" aria-label="${label}" href="${href}" target="_blank" rel="noopener noreferrer">${communityIcons[icon]}<span>${label}</span></a>`).join('');
  return `<header class="site-header">
    <div class="shell header-row">
      <a class="wordmark" href="./index.html" aria-label="Splatico home"><img class="nav-logo" src="./assets/logo.png" width="3840" height="1680" alt="Splatico, Survive the Hunt"></a>
      <nav class="desktop-navigation" aria-label="Main navigation">
        <details class="nav-dropdown" data-nav-dropdown>
          <summary class="nav-trigger">Features ${chevron}</summary>
          <div class="detail-card nav-panel">${pages}</div>
        </details>
        <a class="nav-link" href="${sectionLink(file, 'screenshots')}">Media</a>
        <details class="nav-dropdown nav-community" data-nav-dropdown>
          <summary class="nav-trigger">Community ${chevron}</summary>
          <div class="detail-card nav-panel">${socials}</div>
        </details>
        <a class="nav-link" href="${sectionLink(file, 'press')}">Press</a>
      </nav>
      <details class="mobile-navigation" data-nav-dropdown>
        <summary class="pixel-button button-dark button-small nav-mobile-toggle" aria-label="Toggle navigation"><svg viewBox="0 0 20 20" shape-rendering="crispEdges" aria-hidden="true"><path fill="currentColor" d="M2 2H18V6H2ZM2 8H18V12H2ZM2 14H18V18H2Z"/></svg></summary>
        <nav class="detail-card nav-panel nav-mobile-panel" aria-label="Mobile navigation">
          <p class="nav-group-label">Features</p>${pages}
          <a class="pixel-button button-dark button-small nav-menu-link" aria-label="Media" href="${sectionLink(file, 'screenshots')}">Media</a>
          <a class="pixel-button button-dark button-small nav-menu-link" aria-label="Community" href="${sectionLink(file, 'community')}">Community</a>
          <a class="pixel-button button-dark button-small nav-menu-link" aria-label="Press & creators" href="${sectionLink(file, 'press')}">Press & creators</a>
          <p class="nav-group-label">Follow the hunt</p><div class="nav-mobile-socials">${socials}</div>
        </nav>
      </details>
      <a class="pixel-button button-orange button-small header-steam" data-link="steam" href="{{STEAM_URL}}" target="_blank" rel="noopener noreferrer"><img class="icon" src="./assets/steam.svg" alt="">{{STEAM_BUTTON_LABEL}}</a>
    </div>
  </header><div class="nav-backdrop" aria-hidden="true"></div>`;
}
