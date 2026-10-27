import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import tinycolor from 'tinycolor2';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const colorsPath = path.join(__dirname, '../src/tokens/global/colors.ts');
let src = fs.readFileSync(colorsPath, 'utf8');

const hexToHsla = (hex, alphaToken = 'opacity[1300]') => {
  const { h, s, l } = tinycolor(hex).toHsl();
  return `hsla(${Math.round(h)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%, \${${alphaToken}})`;
};

/** Dark surfaces & text — derived from indigo 800–900 + bluegray 900 scale */
const blueGrayDarkSteps = {
  0: '#FFFFFF',
  50: '#E8EEF2',
  100: '#C0CED5',
  200: '#A4ACBA',
  300: '#7F8EA1',
  400: '#64728C',
  500: '#536376',
  600: '#465162',
  700: '#38404D',
  800: '#272D36',
  900: '#1F252B',
  1000: '#172028',
  1100: '#131B22',
  1200: '#0C1419',
  1300: '#020F19',
};

for (const [key, hex] of Object.entries(blueGrayDarkSteps)) {
  const hsl = hexToHsla(hex);
  const lineRe = new RegExp(`      ${key}: \`hsla\\([^)]+\`,`, 'g');
  const sectionStart = src.indexOf('    blueGrayDark: {');
  const sectionEnd = src.indexOf('    ashGrayLight: {');
  const before = src.slice(0, sectionStart);
  const section = src.slice(sectionStart, sectionEnd);
  const after = src.slice(sectionEnd);
  src = before + section.replace(lineRe, `      ${key}: \`${hsl}\`,`) + after;
}

fs.writeFileSync(colorsPath, src);

const themeFiles = [
  path.join(__dirname, '../src/tokens/theme/klear360Theme.ts'),
  path.join(__dirname, '../src/tokens/theme/klear360NeutralTheme.ts'),
];

const onDarkReplacements = [
  ['globalColors.chromatic.azure', 'globalColors.chromatic.klearnow'],
  ['globalColors.chromatic.emerald', 'globalColors.chromatic.brandGreen'],
  ['globalColors.chromatic.crimson', 'globalColors.chromatic.brandRed'],
  ['globalColors.chromatic.cider', 'globalColors.chromatic.brandMarigold'],
  ['globalColors.chromatic.sapphire', 'globalColors.chromatic.brandBlueSapphire'],
  ['globalColors.chromatic.orchid', 'globalColors.chromatic.brandPurple'],
  ['globalColors.chromatic.topaz', 'globalColors.chromatic.brandGold'],
  ['globalColors.chromatic.magenta', 'globalColors.chromatic.brandRose'],
];

const onDarkPrimaryFixes = [
  [
    'default: globalColors.chromatic.klearnow[400]',
    'default: globalColors.chromatic.klearnow[300]',
  ],
  [
    'highlighted: globalColors.chromatic.klearnow[500]',
    'highlighted: globalColors.chromatic.klearnow[400]',
  ],
  [
    'normal: globalColors.chromatic.klearnow[300]',
    'normal: globalColors.chromatic.klearnow[200]',
  ],
];

for (const file of themeFiles) {
  let text = fs.readFileSync(file, 'utf8');
  const start = text.indexOf('  onDark: {');
  if (start === -1) continue;
  let onDark = text.slice(start);
  for (const [from, to] of onDarkReplacements) {
    onDark = onDark.split(from).join(to);
  }
  for (const [from, to] of onDarkPrimaryFixes) {
    onDark = onDark.split(from).join(to);
  }
  // Info / links on dark: slightly brighter sapphire
  onDark = onDark.replace(
    'default: globalColors.chromatic.brandBlueSapphire[600]',
    'default: globalColors.chromatic.brandBlueSapphire[400]',
  );
  onDark = onDark.replace(
    'highlighted: globalColors.chromatic.brandBlueSapphire[700]',
    'highlighted: globalColors.chromatic.brandBlueSapphire[300]',
  );
  onDark = onDark.replace(
    'intense: globalColors.chromatic.brandBlueSapphire[700]',
    'intense: globalColors.chromatic.brandBlueSapphire[600]',
  );
  fs.writeFileSync(file, text.slice(0, start) + onDark);
}

console.log('Applied dark palette (onDark + blueGrayDark).');
