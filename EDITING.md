# Editing the website

Edit the HTML files directly:

- `src/index.html`: homepage.
- `src/map-editor.html`: map editor page.
- `src/game-modes.html`: game modes page.

Save while `npm run dev` is running to rebuild and refresh the browser. `dist` is generated output; make edits in `src`.

The `<!-- SITE_HEADER -->` marker inserts the shared header. Edit its links in `scripts/navigation.mjs`. Pixel borders are added automatically during the build, so the source HTML stays easy to read.

New HTML files in `src` are included in the build automatically. Add a navigation link in `scripts/navigation.mjs` when you want to expose a new page in the menu.

## Website settings

Edit `src/site-config.json`:

- `steamButtonMode`: `"wishlist"` before release or `"buy"` after release. Updates every Steam button and footer link across all pages. Buy mode also removes the launch sentence.
- `steamUrl`: the Steam store URL for the game. Currently the placeholder Steam homepage.
- `launchYear`: the year shown in the hero launch sentence. Currently 2027.
- `siteUrl`: the live address of the site, ending in `/`. Used for canonical links, social previews, the sitemap and `llms.txt`.

## Search, social and AI crawlers

The build adds these automatically, so there is nothing to keep in sync by hand:

- Canonical, Open Graph and X card tags on every page, taken from each page's `<title>` and `<meta name="description">`. Write those two well and the link previews follow.
- Structured data describing the game on the homepage (`scripts/seo.mjs`). The Steam store link is added there once `steamUrl` points to the real store page.
- `robots.txt` and `sitemap.xml`. New pages in `src` are added to the sitemap.
- `llms.txt`, a plain summary of the game for AI tools. Edit the text in `src/llms.txt`.

The link preview image is `dist/assets/social-preview.jpg` (1200 × 630).

`npm run dev` rebuilds and refreshes the browser when you save these settings. For production, run `npm run build`, then commit and push to `main`.
