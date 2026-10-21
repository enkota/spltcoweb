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

`npm run dev` rebuilds and refreshes the browser when you save these settings. For production, run `npm run build`, then commit and push to `main`.
