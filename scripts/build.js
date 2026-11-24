/* eslint-disable @typescript-eslint/no-require-imports */
const { spawnSync } = require('node:child_process');
const path = require('node:path');

const rootDir = path.resolve(__dirname, '..');
const binDir = path.join(rootDir, 'node_modules', '.bin');

// Cap native Rust/Node thread pools so high-vCPU shared hosts (e.g., 64-core Hostinger
// CloudLinux containers) do not hit `OS can't spawn worker thread (os error 11)` during build.
const buildEnv = {
  ...process.env,
  TOKIO_WORKER_THREADS: process.env.TOKIO_WORKER_THREADS || '2',
  RAYON_NUM_THREADS: process.env.RAYON_NUM_THREADS || '2',
  UV_THREADPOOL_SIZE: process.env.UV_THREADPOOL_SIZE || '2',
  OMP_NUM_THREADS: process.env.OMP_NUM_THREADS || '2',
  NEXT_TELEMETRY_DISABLED: process.env.NEXT_TELEMETRY_DISABLED || '1',
};

function runStep(binName, args) {
  const isWin = process.platform === 'win32';
  const binPath = path.join(binDir, isWin ? `${binName}.cmd` : binName);
  const res = spawnSync(binPath, args, {
    cwd: rootDir,
    env: buildEnv,
    stdio: 'inherit',
    shell: isWin,
  });

  if (res.error) {
    console.error(`[build] Failed to start ${binName}:`, res.error);
    process.exit(1);
  }
  if (typeof res.status === 'number' && res.status !== 0) {
    process.exit(res.status);
  }
  if (res.signal) {
    console.error(`[build] ${binName} terminated with signal ${res.signal}`);
    process.exit(1);
  }
}

runStep('prisma', ['generate']);
runStep('next', ['build', '--webpack']);
