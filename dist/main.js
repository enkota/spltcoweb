// Replace these values when the store page and Splatico trailer are ready.
const SITE_LINKS = {
  steam: 'https://store.steampowered.com/',
  youtubeVideoId: 'aqz-KE-bpKQ', // Big Buck Bunny: temporary sample video.
};
document.querySelectorAll('[data-link="steam"]').forEach(link => link.href = SITE_LINKS.steam);

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

const playButton = document.querySelector('#play-video');
playButton?.addEventListener('click', () => {
  const iframe = document.createElement('iframe');
  iframe.title = 'Placeholder video / Big Buck Bunny';
  iframe.src = `https://www.youtube-nocookie.com/embed/${SITE_LINKS.youtubeVideoId}?autoplay=1&rel=0`;
  iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
  iframe.allowFullscreen = true;
  iframe.referrerPolicy = 'strict-origin-when-cross-origin';
  playButton.replaceWith(iframe);
  iframe.focus();
});

const SHOTS = [
  { src: './assets/library.png', caption: 'The Library', alt: 'Library map with tall bookshelves and a central fireplace' },
  { src: './assets/pool.png', caption: 'Swimming Pool', alt: 'Voxel swimming pool with diving boards, lane ropes and scattered props' },
  { src: './assets/editor.png', caption: 'Everyday hiding places', alt: 'Library lounge with sofas, lamps, a chessboard and plenty of hiding places' },
];
if (document.querySelector('#screenshot-dialog')) {
let selectedShot = 0;
const galleryDialog = document.querySelector('#screenshot-dialog');
const galleryTrigger = document.querySelector('#open-shot');
const featuredShot = document.querySelector('#featured-shot');
const dialogImage = document.querySelector('#dialog-image');
const thumbnails = document.querySelectorAll('[data-shot]');
function selectShot(index) {
  selectedShot = (index + SHOTS.length) % SHOTS.length;
  const shot = SHOTS[selectedShot];
  [featuredShot, dialogImage].forEach(img => { img.src = shot.src; img.alt = shot.alt; });
  document.querySelector('#shot-caption').textContent = shot.caption;
  document.querySelector('#dialog-caption').textContent = shot.caption;
  galleryTrigger.setAttribute('aria-label', `Enlarge ${shot.caption} screenshot`);
  thumbnails.forEach(button => {
    const isSelected = Number(button.dataset.shot) === selectedShot;
    button.classList.toggle('selected', isSelected);
    button.setAttribute('aria-pressed', String(isSelected));
  });
}

thumbnails.forEach(button => button.addEventListener('click', () => selectShot(Number(button.dataset.shot))));
galleryTrigger.addEventListener('click', () => {
  selectShot(selectedShot);
  galleryDialog.showModal();
  document.body.classList.add('gallery-open');
});
document.querySelector('#close-gallery').addEventListener('click', () => galleryDialog.close());
document.querySelector('#previous-shot').addEventListener('click', () => selectShot(selectedShot - 1));
document.querySelector('#next-shot').addEventListener('click', () => selectShot(selectedShot + 1));
galleryDialog.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft') { event.preventDefault(); selectShot(selectedShot - 1); }
  if (event.key === 'ArrowRight') { event.preventDefault(); selectShot(selectedShot + 1); }
});
galleryDialog.addEventListener('click', event => {
  if (event.target !== galleryDialog) return;
  const rect = galleryDialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) galleryDialog.close();
});
galleryDialog.addEventListener('close', () => {
  document.body.classList.remove('gallery-open');
  galleryTrigger.focus();
});

}

if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const parallaxImages = [...document.querySelectorAll('[data-parallax]')];
  let pending = false;
  const updateParallax = () => {
    parallaxImages.forEach(img => {
      const rect = img.parentElement.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > innerHeight) return;
      const progress = Math.max(-1, Math.min(1, (rect.top + rect.height / 2 - innerHeight / 2) / innerHeight));
      img.style.transform = `translateY(${progress * Number(img.dataset.parallax)}px)`;
    });
    pending = false;
  };
  window.addEventListener('scroll', () => { if (!pending) { pending = true; requestAnimationFrame(updateParallax); } }, { passive: true });
  updateParallax();
}
