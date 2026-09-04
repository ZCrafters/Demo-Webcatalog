const { spawnSync } = require('node:child_process');
const { existsSync } = require('node:fs');
const { homedir } = require('node:os');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const [major, minor] = process.versions.node.split('.').map(Number);
let node = process.execPath;
if (major < 22 || (major === 22 && minor < 13)) {
  const bundled = path.join(homedir(), '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe');
  if (process.platform === 'win32' && existsSync(bundled)) node = bundled;
  else { console.error('Nigoo membutuhkan Node.js 22.13+ untuk Vite dan ESLint.'); process.exit(1); }
}
const command = process.argv[2];
const additional = process.argv.slice(3);
const commands = {
  dev: ['node_modules/vite/bin/vite.js', ...additional],
  preview: ['node_modules/vite/bin/vite.js', 'preview', ...additional],
  build: ['node_modules/vite/bin/vite.js', 'build', ...additional],
  lint: ['node_modules/eslint/bin/eslint.js', 'src', 'scripts/import-nigoo.js', 'scripts/importXlsx.js', 'scripts/prerender.js', 'scripts/validate-catalog.js', 'scripts/run.cjs'],
};
if (!commands[command]) { console.error('Gunakan dev, preview, build, atau lint.'); process.exit(1); }
const result = spawnSync(node, commands[command], { cwd: root, stdio: 'inherit', env: process.env });
if (result.error) { console.error(result.error.message); process.exit(1); }
if (result.status !== 0) process.exit(result.status || 1);
if (command === 'build') {
  const routes = spawnSync(node, ['scripts/prerender.js'], { cwd: root, stdio: 'inherit' });
  process.exit(routes.status || 0);
}
