// Match ChunkyPlate's 2px steps, 3px black outline and 3px lower wall.
const controls = new Set(['pixel-button', 'shot-thumbnail', 'mode-card', 'dialog-close', 'play-square']);
const panels = new Set(['video-frame', 'gallery-stage', 'editor-image', 'hero-tag', 'screenshot-dialog', 'role-card', 'community-panel', 'cosmetic-stage', 'chaos-art', 'press-panel', 'feature-image', 'detail-card', 'detail-banner', 'feature-character-stage', 'character-tile', 'rule-tag']);

export function pixelSurfaces(html) {
  return html.replace(/<([a-z][\w-]*)\b[^>]*\bclass="([^"]*)"[^>]*>/gi, (tag, name, classes) => {
    const names = classes.split(/\s+/);
    const control = names.some(value => controls.has(value));
    if (!control && !names.some(value => panels.has(value))) return tag;
    const plate = control || names.includes('screenshot-dialog') ? '<span class="pixel-plate" aria-hidden="true"><span class="pixel-wall"></span><span class="pixel-face"></span></span>' : '';
    const focus = control || names.includes('video-frame') || names.includes('gallery-stage') ? '<span class="pixel-focus" aria-hidden="true"></span>' : '';
    return `${tag}${plate}<span class="pixel-rim" aria-hidden="true"></span>${focus}`;
  });
}
