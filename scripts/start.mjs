// `npm start`: everything needed to run the Studio on this computer, in one command. Checks Node, installs the
// packages the first time (or when package-lock.json changed), builds the player, serves the Studio and opens it.

import { spawn, spawnSync } from 'node:child_process';
import { existsSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const say = (s) => console.log(`\x1b[36m▸\x1b[0m ${s}`);

const [major] = process.versions.node.split('.').map(Number);
if (major < 20) {
  console.error(`Kinetic Scenes needs Node.js 20 or newer; this is ${process.versions.node}. Get it from https://nodejs.org/`);
  process.exit(1);
}

// Install when there is nothing installed, or the lock file is newer than the last install.
const marker = join(root, 'node_modules', '.package-lock.json');
const stale = !existsSync(marker) || statSync(join(root, 'package-lock.json')).mtimeMs > statSync(marker).mtimeMs;
if (stale) {
  say('Installing the packages (the first time takes a minute or two)…');
  const r = spawnSync(npm, ['install', '--no-audit', '--no-fund'], { cwd: root, stdio: 'inherit', shell: process.platform === 'win32' });
  if (r.status !== 0) process.exit(r.status ?? 1);
}

say('Building the player and starting the Studio…');
const dev = spawn(npm, ['run', 'dev'], { cwd: root, stdio: ['inherit', 'pipe', 'inherit'], shell: process.platform === 'win32' });
let opened = false;
dev.stdout.on('data', (d) => {
  process.stdout.write(d);
  // Open the browser once Vite says where it is serving.
  const m = !opened && /Local:\s+(http:\/\/\S+)/.exec(String(d).replace(/\x1b\[[0-9;]*m/g, ''));
  if (m) {
    opened = true;
    const url = m[1];
    say(`The Studio is at ${url} (Ctrl+C stops it).`);
    if (process.env.NO_OPEN === '1') return;
    const open = process.platform === 'win32' ? ['cmd', ['/c', 'start', '', url]] : process.platform === 'darwin' ? ['open', [url]] : ['xdg-open', [url]];
    try { spawn(open[0], open[1], { stdio: 'ignore', detached: true }).unref(); } catch { /* no browser to open: the address is printed */ }
  }
});
dev.on('exit', (c) => process.exit(c ?? 0));
process.on('SIGINT', () => { dev.kill('SIGINT'); });
