import { watch } from 'node:fs';
import { readFile, stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import { spawn } from 'node:child_process';
import { dirname, extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const output = resolve(root, 'dist');
const port = Number(process.env.PORT || 4173);
const clients = new Set();
const watchers = [];
const types = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.webp': 'image/webp', '.ttf': 'font/ttf', '.zip': 'application/zip',
  '.txt': 'text/plain; charset=utf-8', '.ico': 'image/x-icon', '.xml': 'application/xml; charset=utf-8',
};
let version = Date.now();
let build;
let building = false;
let dirty = false;
let timer;
let stopped = false;

function refresh() {
  version += 1;
  for (const client of clients) client.write(`data: ${version}\n\n`);
}

function rebuild() {
  dirty = true;
  if (building || stopped) return;
  dirty = false;
  building = true;
  console.log('\nBuilding website...');
  build = spawn(process.execPath, [resolve(root, 'scripts/build.mjs')], {
    cwd: root, stdio: 'inherit',
  });
  build.once('error', error => console.error(error.message));
  build.once('close', code => {
    building = false;
    build = undefined;
    if (stopped) return;
    if (dirty) return rebuild();
    if (code === 0) {
      refresh();
      console.log(`Ready at http://127.0.0.1:${port} (watching for changes)`);
    } else console.error('Build failed. Fix the error and save to retry.');
  });
}

function scheduleBuild() {
  clearTimeout(timer);
  timer = setTimeout(rebuild, 150);
}

const reloadScript = `const version = new URL(document.currentScript.src).searchParams.get('v');
const events = new EventSource('/__dev/events');
events.onmessage = event => { if (event.data !== version) location.reload(); };
`;

const server = createServer(async (request, response) => {
  response.setHeader('Cache-Control', 'no-store');
  try {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    if (pathname === '/__dev/events') {
      response.writeHead(200, {
        'Content-Type': 'text/event-stream', 'Connection': 'keep-alive',
      });
      response.write(`data: ${version}\n\n`);
      clients.add(response);
      request.on('close', () => clients.delete(response));
      return;
    }
    if (pathname === '/__dev/reload.js') {
      response.setHeader('Content-Type', types['.js']);
      return response.end(reloadScript);
    }
    if (!['GET', 'HEAD'].includes(request.method)) {
      response.writeHead(405);
      return response.end('Method not allowed');
    }
    if (building) {
      response.writeHead(503, { 'Refresh': '1' });
      return response.end('Building website. This page will refresh shortly.');
    }
    let file = resolve(output, `.${pathname}`);
    if (file !== output && !file.startsWith(output + sep)) {
      response.writeHead(403);
      return response.end('Forbidden');
    }
    if ((await stat(file).catch(() => null))?.isDirectory()) file = resolve(file, 'index.html');
    if (!extname(file) && !(await stat(file).catch(() => null))) file += '.html';
    let body = await readFile(file);
    const extension = extname(file);
    if (extension === '.html') {
      body = Buffer.from(body.toString().replace('</body>',
        `<script src="/__dev/reload.js?v=${version}"></script></body>`));
    }
    response.writeHead(200, { 'Content-Type': types[extension] || 'application/octet-stream' });
    response.end(request.method === 'HEAD' ? undefined : body);
  } catch (error) {
    response.writeHead(error.code === 'ENOENT' || error.code === 'ENOTDIR' ? 404 : 400);
    response.end('Not found');
  }
});

function stop() {
  if (stopped) return;
  stopped = true;
  clearTimeout(timer);
  watchers.forEach(watcher => watcher.close());
  build?.kill();
  clients.forEach(client => client.end());
  server.close();
}
process.on('SIGINT', stop);
process.on('SIGTERM', stop);
server.on('error', error => {
  console.error(error.code === 'EADDRINUSE'
    ? `Port ${port} is already in use. Stop the old preview, then run npm run dev again.`
    : error.message);
  process.exitCode = 1;
  stop();
});
server.listen(port, '127.0.0.1', () => {
  for (const directory of ['src', 'scripts']) {
    watchers.push(watch(resolve(root, directory), { recursive: true }, scheduleBuild));
  }
  // Most original game art lives in dist/assets; changes there need only a refresh.
  watchers.push(watch(resolve(output, 'assets'), { recursive: true }, () => {
    if (!building) refresh();
  }));
  rebuild();
});
