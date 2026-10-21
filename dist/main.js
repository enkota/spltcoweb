// Steam buttons and launch year are configured in src/site-config.json.
// Add the trailer's YouTube ID and change #play-video back to a <button> when the trailer is ready.
const SITE_LINKS = {
  youtubeVideoId: '',
};

const siteHeader = document.querySelector('.site-header');
if (siteHeader) {
  const menus = [...siteHeader.querySelectorAll('[data-nav-dropdown]')];
  const closeMenus = () => menus.forEach(menu => menu.open = false);
  menus.forEach(menu => menu.addEventListener('toggle', () => {
    if (menu.open) menus.filter(other => other !== menu).forEach(other => other.open = false);
  }));
  document.addEventListener('click', event => {
    if (!siteHeader.contains(event.target)) closeMenus();
  });
  siteHeader.addEventListener('click', event => {
    if (event.target.closest('a')) closeMenus();
  });
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    const openMenu = menus.find(menu => menu.open);
    if (!openMenu) return;
    event.preventDefault();
    closeMenus();
    openMenu.querySelector('summary').focus();
  });
}

const playButton = SITE_LINKS.youtubeVideoId ? document.querySelector('#play-video') : null;
playButton?.addEventListener('click', () => {
  const iframe = document.createElement('iframe');
  iframe.title = 'Splatico trailer';
  iframe.src = `https://www.youtube-nocookie.com/embed/${SITE_LINKS.youtubeVideoId}?autoplay=1&rel=0`;
  iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
  iframe.allowFullscreen = true;
  iframe.referrerPolicy = 'strict-origin-when-cross-origin';
  playButton.replaceWith(iframe);
  iframe.focus();
});

// Each thumbnail supplies its own image, and its data-alt text for the featured shot.
const featuredShot = document.querySelector('#featured-shot');
if (featuredShot) {
  let selectedShot = 0;
  const thumbnails = [...document.querySelectorAll('.shot-thumbnail')];
  function selectShot(index) {
    selectedShot = (index + thumbnails.length) % thumbnails.length;
    const shot = thumbnails[selectedShot];
    featuredShot.src = shot.querySelector('img').getAttribute('src');
    featuredShot.alt = shot.dataset.alt;
    thumbnails.forEach((button, i) => {
      button.classList.toggle('selected', i === selectedShot);
      button.setAttribute('aria-pressed', String(i === selectedShot));
    });
  }
  thumbnails.forEach((button, i) => button.addEventListener('click', () => selectShot(i)));
  document.querySelector('#previous-shot').addEventListener('click', () => selectShot(selectedShot - 1));
  document.querySelector('#next-shot').addEventListener('click', () => selectShot(selectedShot + 1));
  document.querySelector('#screenshots').addEventListener('keydown', event => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    selectShot(selectedShot + (event.key === 'ArrowLeft' ? -1 : 1));
  });
  selectShot(0);
}

const parallaxItems = [...document.querySelectorAll('[data-parallax]')];
if (parallaxItems.length && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  let pending = false;
  const updateParallax = () => {
    parallaxItems.forEach(item => {
      const rect = item.parentElement.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > innerHeight) return;
      const progress = Math.max(-1, Math.min(1, (rect.top + rect.height / 2 - innerHeight / 2) / innerHeight));
      item.style.transform = `translateY(${progress * Number(item.dataset.parallax)}px)`;
    });
    pending = false;
  };
  window.addEventListener('scroll', () => { if (!pending) { pending = true; requestAnimationFrame(updateParallax); } }, { passive: true });
  updateParallax();
}
