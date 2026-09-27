import { spawn } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = dirname(fileURLToPath(import.meta.url));
const expoArgs = process.argv.slice(2);
const expoCli = join(projectRoot, 'node_modules', '.bin', process.platform === 'win32' ? 'expo.cmd' : 'expo');
const server = spawn(process.execPath, [join(projectRoot, 'server.mjs')], { cwd: projectRoot, stdio: 'inherit' });
const expo = spawn(expoCli, ['start', ...expoArgs], { cwd: projectRoot, stdio: 'inherit', shell: process.platform === 'win32' });

function stop() {
  server.kill('SIGTERM');
  expo.kill('SIGTERM');
}

process.on('SIGINT', stop);
process.on('SIGTERM', stop);
expo.on('exit', (code) => {
  server.kill('SIGTERM');
  process.exit(code ?? 0);
});
