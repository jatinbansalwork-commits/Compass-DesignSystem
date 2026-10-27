/**
 * Context about this approach:
 *
 * Q. Why not use `npm publish --registry https://registry.npmjs.org` instead of creating .npmrc?
 *
 * -> It doesn't support any clean way of providing access token and only works for already logged in users
 *
 * Q. Why not change actual `.npmrc`, drop github package registry and move to NPM only?
 *
 * -> `.npmrc` doesn't support multiple registries on one scope.
 *  Internal users may have `@klearnow` scope pointing at GitHub Packages; publish scripts target npmjs.org for public packages.
 *
 * Checkout description of this PR for more context -> https://github.com/klearnow/compass/pull/757
 *
 */

const fs = require('fs');
const path = require('path');
const execa = require('execa');

const publishedPackages = JSON.parse(process.env.PUBLISHED_PACKAGES || '[]');
const MONOREPO_ROOT = path.join(__dirname, '..');
const NPMRC_PATH = path.join(MONOREPO_ROOT, '.npmrc');

// Point the @klearnow scope at the npm registry. If NODE_AUTH_TOKEN is available
// (set by setup-node), include it so npm can authenticate for packages that are
// not yet configured as OIDC trusted publishers on npmjs.com. This is required
// for first-time publishes of new scoped packages where OIDC trust hasn't been
// established yet — without the token, npm returns E404.
let npmRcContent = `@klearnow:registry=https://registry.npmjs.org/\n`;
if (process.env.NODE_AUTH_TOKEN) {
  npmRcContent += `//registry.npmjs.org/:_authToken=${process.env.NODE_AUTH_TOKEN}\n`;
}

fs.writeFileSync(NPMRC_PATH, npmRcContent);

// Helper function to get package path from package name
function getPackagePath(packageName) {
  // Remove the scope part and get just the package name
  const packageNameWithoutScope = packageName.replace('@klearnow/', '');
  // Assume the package is in the packages directory with the same name
  return `packages/${packageNameWithoutScope}`;
}

try {
  // Now you can use the array of objects
  for (const pkg of publishedPackages) {
    const packagePath = getPackagePath(pkg.name);
    console.log(`[compass]: Publishing ${pkg.name}@${pkg.version} on NPM ✨`);

    execa.commandSync('npm publish', {
      cwd: path.join(MONOREPO_ROOT, packagePath),
      stdio: 'inherit',
    });
  }
} finally {
  // Clean up the .npmrc file
  fs.rmSync(NPMRC_PATH, { force: true });
}
