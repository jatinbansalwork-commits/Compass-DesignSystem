/**
 * Yarn/npm aliases for @klearnow/i18nify-* may not create node_modules/@klearnow.
 * Storybook/Vite need these symlinks to the installed @razorpay packages.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const pkgRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const scopeDir = path.join(pkgRoot, 'node_modules/@klearnow');

const links = [
  ['i18nify-js', '../@razorpay/i18nify-js'],
  ['i18nify-react', '../@razorpay/i18nify-react'],
];

fs.mkdirSync(scopeDir, { recursive: true });
for (const [name, target] of links) {
  const linkPath = path.join(scopeDir, name);
  try {
    fs.rmSync(linkPath, { recursive: true, force: true });
  } catch {
    /* ignore */
  }
  fs.symlinkSync(target, linkPath);
}
