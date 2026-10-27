// Which Klear360 packages a project uses, and which skill documents each one.
import fs from 'fs';
import path from 'path';

const DEPENDENCY_FIELDS = ['dependencies', 'devDependencies', 'peerDependencies'];

export const FRAMEWORKS = {
  react: {
    packageNames: ['@klearnow/klear360', '@klearnow/klear360'],
    skill: 'blade',
    fileTypes: '.tsx/.jsx',
  },
  svelte: {
    packageNames: ['@klearnow/klear360-svelte'],
    skill: 'klear360-svelte',
    fileTypes: '.svelte',
  },
};

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&');

// Matches the package as a whole name, so '@klearnow/klear360' does not match
// '@klearnow/klear360-svelte' or '@klearnow/klear360-core'. Covers yarn v1
// (`"@klearnow/klear360@^12"`, `@klearnow/klear360@^12`), yarn berry
// (`"@klearnow/klear360@npm:^12"`), npm (`"node_modules/@klearnow/klear360"`,
// `"@klearnow/klear360": "^12"`) and pnpm (`/@klearnow/klear360@12.0.0`,
// `'@klearnow/klear360': 12.0.0`).
export const lockfileMentions = (content, packageName) =>
  new RegExp(`(^|["'\\s/,])${escapeRegExp(packageName)}(["']?\\s*:|@)`, 'm').test(content);

const LOCKFILES = ['yarn.lock', 'package-lock.json', 'pnpm-lock.yaml', 'bun.lock'];

const readFile = (file) => {
  try {
    return fs.readFileSync(file, 'utf8');
  } catch {
    return null;
  }
};

const readPackageJSON = (dir) => {
  try {
    return JSON.parse(readFile(path.join(dir, 'package.json')));
  } catch {
    return null;
  }
};

const packageNamesFor = (framework) => FRAMEWORKS[framework].packageNames;

const primaryPackageName = (framework) => packageNamesFor(framework)[0];

const directFrameworks = (pkg, found) => {
  for (const [framework, { packageNames }] of Object.entries(FRAMEWORKS)) {
    if (
      packageNames.some((packageName) =>
        DEPENDENCY_FIELDS.some((field) => pkg?.[field]?.[packageName]),
      )
    ) {
      found.add(framework);
    }
  }
};

const workspacePatterns = (dir, pkg) => {
  const fromPackage = Array.isArray(pkg?.workspaces) ? pkg.workspaces : pkg?.workspaces?.packages;
  if (Array.isArray(fromPackage)) return fromPackage;
  const yaml = readFile(path.join(dir, 'pnpm-workspace.yaml'));
  if (!yaml) return [];
  const block = yaml.split(/^packages:\s*$/m)[1] ?? '';
  return [...block.matchAll(/^\s+-\s+['"]?([^'"#\n]+?)['"]?\s*$/gm)].map((match) => match[1]);
};

// Supports literal paths and a trailing `/*`, which covers almost every
// workspace config. Anything else (`**`, negations) is skipped and the
// lockfile fallback handles it.
const workspaceDirs = (root, patterns) =>
  patterns.flatMap((pattern) => {
    const clean = pattern.replace(/^\.\//, '').replace(/\/$/, '');
    if (clean.startsWith('!') || clean.includes('**')) return [];
    if (!clean.endsWith('/*')) return clean.includes('*') ? [] : [path.join(root, clean)];
    const parent = path.join(root, clean.slice(0, -2));
    try {
      return fs
        .readdirSync(parent, { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .map((entry) => path.join(parent, entry.name));
    } catch {
      return [];
    }
  });

const toList = (found) => Object.keys(FRAMEWORKS).filter((framework) => found.has(framework));

// Returns the Klear360 frameworks a project depends on: ['react'], ['svelte'] or
// ['react', 'svelte'] for a monorepo with both. Walks up from cwd so sessions
// started in a subdirectory or workspace still resolve. Declared dependencies
// win over the lockfile, because a lockfile also lists transitive packages: a
// Svelte app whose shared library pulls in @klearnow/klear360 must not be told it
// uses React. Stops at the repository root so a parent folder never leaks in.
export const detectFrameworks = (cwd) => {
  if (!cwd) return [];
  for (let dir = path.resolve(cwd); ; dir = path.dirname(dir)) {
    const found = new Set();
    const pkg = readPackageJSON(dir);
    directFrameworks(pkg, found);
    if (found.size > 0) return toList(found);

    const patterns = workspacePatterns(dir, pkg);
    for (const workspace of workspaceDirs(dir, patterns)) {
      directFrameworks(readPackageJSON(workspace), found);
    }
    if (found.size > 0) return toList(found);

    const lockfiles = LOCKFILES.map((lock) => readFile(path.join(dir, lock))).filter(Boolean);
    for (const content of lockfiles) {
      for (const [framework, { packageNames }] of Object.entries(FRAMEWORKS)) {
        if (packageNames.some((packageName) => lockfileMentions(content, packageName))) {
          found.add(framework);
        }
      }
    }
    // A lockfile or workspace config marks the project root.
    if (lockfiles.length > 0 || patterns.length > 0) return toList(found);

    const parent = path.dirname(dir);
    if (parent === dir || fs.existsSync(path.join(dir, '.git'))) return [];
  }
};

export const getNudge = (frameworks) => {
  if (frameworks.length === 1) {
    const { skill } = FRAMEWORKS[frameworks[0]];
    const packageName = primaryPackageName(frameworks[0]);
    return `This project uses Klear360 (${packageName}). Before writing or reviewing UI code, invoke the ${skill} skill and read the component docs it points to.`;
  }
  const perFramework = frameworks
    .map((framework) => {
      const { skill, fileTypes } = FRAMEWORKS[framework];
      const packageName = primaryPackageName(framework);
      return `the ${skill} skill for ${fileTypes} files that use ${packageName}`;
    })
    .join(' and ');
  return `This project uses more than one Klear360 package. Before writing or reviewing UI code, invoke ${perFramework}, then read the component docs it points to. Do not mix APIs between them.`;
};
