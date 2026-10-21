const gamePages = [
  ['index.html', 'OVERVIEW', '#about'],
  ['game-modes.html', 'GAME MODES'],
  ['chaos.html', 'CHAOS MODIFIERS'],
  ['map-editor.html', 'MAP EDITOR'],
];
const communityLinks = [
  ['https://discord.gg/P88g5WmsQS', 'DISCORD', 'button-purple'],
  ['https://x.com/splatico_game', 'FOLLOW ON X'],
  ['https://splatico.fandom.com/wiki/Splatico_Wiki', 'WIKI'],
];
const chevron = '<svg class="nav-chevron" viewBox="0 0 12 6" shape-rendering="crispEdges" aria-hidden="true"><path fill="currentColor" d="M0 0H12V2H10V4H8V6H4V4H2V2H0Z"/></svg>';
const sectionLink = (file, id) => file === 'index.html' ? `#${id}` : `./index.html#${id}`;

export function siteHeader(file = 'index.html') {
  const pages = gamePages.map(([target, label, hash = '']) => `<a class="pixel-button button-dark button-small nav-menu-link" aria-label="${label}" href="./${target}${hash}"${target === file ? ' aria-current="page"' : ''}>${label}</a>`).join('');
  const socials = communityLinks.map(([href, label, variant = 'button-dark']) => `<a class="pixel-button ${variant} button-small nav-menu-link" aria-label="${label}" href="${href}" target="_blank" rel="noopener noreferrer">${label}</a>`).join('');
  return `<header class="site-header">
    <div class="shell header-row">
      <a class="wordmark" href="./index.html" aria-label="Splatico home"><img class="nav-logo" src="./assets/logo.png" width="3840" height="1680" alt="Splatico, Survive the Hunt"></a>
      <nav class="desktop-navigation" aria-label="Main navigation">
        <details class="nav-dropdown" data-nav-dropdown>
          <summary class="nav-trigger">THE GAME ${chevron}</summary>
          <div class="detail-card nav-panel">${pages}</div>
        </details>
        <a class="nav-link" href="${sectionLink(file, 'screenshots')}">SCREENSHOTS</a>
        <details class="nav-dropdown nav-community" data-nav-dropdown>
          <summary class="nav-trigger">COMMUNITY ${chevron}</summary>
          <div class="detail-card nav-panel"><a class="pixel-button button-dark button-small nav-menu-link" aria-label="JOIN THE HUNT" href="${sectionLink(file, 'community')}">JOIN THE HUNT</a>${socials}</div>
        </details>
        <a class="nav-link" href="${sectionLink(file, 'press')}">PRESS</a>
      </nav>
      <details class="mobile-navigation" data-nav-dropdown>
        <summary class="pixel-button button-dark button-small nav-mobile-toggle" aria-label="Toggle navigation"><svg viewBox="0 0 20 20" shape-rendering="crispEdges" aria-hidden="true"><path fill="currentColor" d="M2 3H18V6H2ZM2 9H18V12H2ZM2 15H18V18H2Z"/></svg></summary>
        <nav class="detail-card nav-panel nav-mobile-panel" aria-label="Mobile navigation">
          <p class="nav-group-label">THE GAME</p>${pages}
          <a class="pixel-button button-dark button-small nav-menu-link" aria-label="SCREENSHOTS" href="${sectionLink(file, 'screenshots')}">SCREENSHOTS</a>
          <a class="pixel-button button-dark button-small nav-menu-link" aria-label="COMMUNITY" href="${sectionLink(file, 'community')}">COMMUNITY</a>
          <a class="pixel-button button-dark button-small nav-menu-link" aria-label="PRESS & CREATORS" href="${sectionLink(file, 'press')}">PRESS & CREATORS</a>
          <p class="nav-group-label">FOLLOW THE HUNT</p><div class="nav-mobile-socials">${socials}</div>
        </nav>
      </details>
      <a class="pixel-button button-orange button-small header-steam" data-link="steam" href="https://store.steampowered.com/" target="_blank" rel="noopener noreferrer"><img class="icon" src="./assets/steam.svg" alt="">BUY ON STEAM</a>
    </div>
  </header>`;
}
