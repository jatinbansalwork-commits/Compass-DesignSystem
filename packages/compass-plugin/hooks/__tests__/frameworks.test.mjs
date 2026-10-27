import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { execFileSync } from 'child_process';
import { fileURLToPath } from 'url';
import { detectFrameworks, getNudge, lockfileMentions } from '../utils/frameworks.mjs';

const hooksDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const makeProject = (files) => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'klear360-plugin-test-'));
  for (const [name, content] of Object.entries(files)) {
    fs.mkdirSync(path.dirname(path.join(dir, name)), { recursive: true });
    fs.writeFileSync(
      path.join(dir, name),
      typeof content === 'string' ? content : JSON.stringify(content),
    );
  }
  return dir;
};

const runSessionStart = (cwd) =>
  execFileSync(process.execPath, [path.join(hooksDir, 'session-start.mjs')], {
    input: JSON.stringify({ cwd, session_id: 'test-session' }),
    encoding: 'utf8',
  });

test('detects react from package.json', () => {
  const dir = makeProject({ 'package.json': { dependencies: { '@klearnow/klear360': '^12.0.0' } } });
  assert.deepEqual(detectFrameworks(dir), ['react']);
});

test('detects svelte from package.json without matching react', () => {
  const dir = makeProject({
    'package.json': {
      dependencies: { '@klearnow/klear360-svelte': '^0.18.0', '@klearnow/klear360-core': '^0.19.0' },
    },
  });
  assert.deepEqual(detectFrameworks(dir), ['svelte']);
});

test('detects both in a monorepo lockfile', () => {
  const dir = makeProject({
    'package.json': { private: true, workspaces: ['apps/*'] },
    'yarn.lock': [
      '"@klearnow/klear360-svelte@^0.18.0":',
      '  version "0.18.0"',
      '',
      '"@klearnow/klear360@^12.0.0":',
      '  version "12.0.0"',
    ].join('\n'),
  });
  assert.deepEqual(detectFrameworks(dir), ['react', 'svelte']);
});

test('returns nothing for a non-Klear360 project', () => {
  const dir = makeProject({ 'package.json': { dependencies: { react: '^18.0.0' } } });
  assert.deepEqual(detectFrameworks(dir), []);
  assert.deepEqual(detectFrameworks(undefined), []);
});

test('detects from a subdirectory of the project', () => {
  const dir = makeProject({
    'package.json': { dependencies: { '@klearnow/klear360': '^12.0.0' } },
    'src/components/.keep': '',
  });
  assert.deepEqual(detectFrameworks(path.join(dir, 'src', 'components')), ['react']);
});

test('detects from inside a workspace whose own package.json does not list Klear360', () => {
  const dir = makeProject({
    'package.json': { private: true, workspaces: ['apps/*'] },
    'apps/web/package.json': { dependencies: { '@klearnow/klear360-svelte': '^0.18.0' } },
    'apps/api/package.json': { dependencies: { express: '^4.0.0' } },
    'apps/api/src/.keep': '',
  });
  assert.deepEqual(detectFrameworks(path.join(dir, 'apps', 'api', 'src')), ['svelte']);
});

test('nearest package.json with Klear360 wins over the rest of the monorepo', () => {
  const dir = makeProject({
    'package.json': { private: true, workspaces: ['apps/*'] },
    'apps/web/package.json': { dependencies: { '@klearnow/klear360-svelte': '^0.18.0' } },
    'apps/admin/package.json': { dependencies: { '@klearnow/klear360': '^12.0.0' } },
  });
  assert.deepEqual(detectFrameworks(path.join(dir, 'apps', 'web')), ['svelte']);
  assert.deepEqual(detectFrameworks(dir), ['react', 'svelte']);
});

test('workspace package.json files win over transitive lockfile mentions', () => {
  const dir = makeProject({
    'package.json': { private: true, workspaces: { packages: ['apps/*'] } },
    'apps/web/package.json': { dependencies: { '@klearnow/klear360-svelte': '^0.18.0' } },
    // @klearnow/klear360 is pulled in by some shared library, not used directly
    'yarn.lock': [
      '"@klearnow/klear360-svelte@^0.18.0":',
      '  version "0.18.0"',
      '',
      '"@klearnow/klear360@^12.0.0":',
      '  version "12.0.0"',
    ].join('\n'),
  });
  assert.deepEqual(detectFrameworks(dir), ['svelte']);
});

test('reads pnpm-workspace.yaml', () => {
  const dir = makeProject({
    'package.json': { private: true },
    'pnpm-workspace.yaml': 'packages:\n  - \'apps/*\'\n  - "libs/ui"\n',
    'apps/web/package.json': { dependencies: { '@klearnow/klear360': '^12.0.0' } },
    'libs/ui/package.json': { peerDependencies: { '@klearnow/klear360-svelte': '*' } },
  });
  assert.deepEqual(detectFrameworks(dir), ['react', 'svelte']);
});

test('does not walk past the repository root', () => {
  const outer = makeProject({
    'package.json': { dependencies: { '@klearnow/klear360': '^12.0.0' } },
    'repo/.git/HEAD': 'ref: refs/heads/master\n',
    'repo/package.json': { dependencies: { react: '^18.0.0' } },
  });
  assert.deepEqual(detectFrameworks(path.join(outer, 'repo')), []);
});

test('detects from bun.lock', () => {
  const dir = makeProject({
    'package.json': { private: true, workspaces: ['packages/**'] },
    'bun.lock':
      '{\n  "packages": {\n    "@klearnow/klear360": ["@klearnow/klear360@12.0.0", "", {}],\n  }\n}\n',
  });
  assert.deepEqual(detectFrameworks(dir), ['react']);
});

test('lockfile matching needs the whole package name', () => {
  const react = '@klearnow/klear360';
  const svelte = '@klearnow/klear360-svelte';
  // yarn v1, yarn berry, npm, pnpm
  assert.ok(lockfileMentions('"@klearnow/klear360@^12.0.0":', react));
  assert.ok(lockfileMentions('"@klearnow/klear360@npm:^12.0.0":', react));
  assert.ok(lockfileMentions('    "node_modules/@klearnow/klear360": {', react));
  assert.ok(lockfileMentions("      '@klearnow/klear360': 12.0.0", react));
  assert.ok(lockfileMentions('  /@klearnow/klear360@12.0.0:', react));
  assert.ok(lockfileMentions('"@klearnow/klear360-svelte@^0.18.0":', svelte));
  assert.ok(!lockfileMentions('"@klearnow/klear360-svelte@^0.18.0":', react));
  assert.ok(!lockfileMentions('    "node_modules/@klearnow/klear360-core": {', react));
  assert.ok(!lockfileMentions('"@klearnow/klear360@^12.0.0":', svelte));
});

test('nudge names the skill for each framework', () => {
  assert.match(getNudge(['react']), /invoke the blade skill/);
  assert.match(getNudge(['svelte']), /@razorpay\/klear360-svelte.*invoke the klear360-svelte skill/);
  const both = getNudge(['react', 'svelte']);
  assert.match(both, /blade skill for \.tsx\/\.jsx files/);
  assert.match(both, /klear360-svelte skill for \.svelte files/);
});

test('SessionStart hook prints the svelte nudge in a svelte project', () => {
  const dir = makeProject({
    'package.json': { dependencies: { '@klearnow/klear360-svelte': '^0.18.0' } },
  });
  const { hookSpecificOutput } = JSON.parse(runSessionStart(dir));
  assert.equal(hookSpecificOutput.hookEventName, 'SessionStart');
  assert.match(hookSpecificOutput.additionalContext, /klear360-svelte skill/);
});

test('SessionStart hook prints nothing outside Klear360 projects', () => {
  const dir = makeProject({ 'package.json': { dependencies: { react: '^18.0.0' } } });
  assert.equal(runSessionStart(dir), '');
});
