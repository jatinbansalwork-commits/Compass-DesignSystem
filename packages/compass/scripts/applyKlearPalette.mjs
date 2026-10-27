import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import tinycolor from 'tinycolor2';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const colorsPath = path.join(__dirname, '../src/tokens/global/colors.ts');
let src = fs.readFileSync(colorsPath, 'utf8');

const opacityKeys = {
  a50: 100,
  a100: 300,
  a150: 400,
  a200: 500,
  a400: 800,
};

const hexToHsla = (hex, alphaToken = 'opacity[1300]') => {
  const { h, s, l } = tinycolor(hex).toHsl();
  return `hsla(${Math.round(h)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%, \${${alphaToken}})`;
};

const scaleBlock = (name, steps, baseHex) => {
  const lines = [`    ${name}: {`];
  for (const [k, hex] of Object.entries(steps)) {
    lines.push(`      ${k}: \`${hexToHsla(hex)}\`,`);
  }
  for (const [ak, ok] of Object.entries(opacityKeys)) {
    lines.push(`      ${ak}: \`${hexToHsla(baseHex, `opacity[${ok}]`)}\`,`);
  }
  lines.push('    },');
  return lines.join('\n');
};

const klearnow = scaleBlock(
  'klearnow',
  {
    50: '#FDFDFD',
    100: '#E7ECF0',
    200: '#C0CED5',
    300: '#5B8396',
    400: '#32647B',
    500: '#003F5B',
    600: '#003952',
    700: '#002E42',
    800: '#011A25',
    900: '#020F19',
    1000: '#010A10',
  },
  '#003F5B',
);

const brandScales = [
  scaleBlock(
    'brandBlueSapphire',
    {
      50: '#FCFCFC',
      100: '#E6F0F2',
      200: '#C0D6DC',
      300: '#5D96A9',
      400: '#337E95',
      500: '#005E7A',
      600: '#005571',
      700: '#004458',
      800: '#002734',
      900: '#001A26',
      1000: '#001018',
    },
    '#005E7A',
  ),
  scaleBlock(
    'brandGreen',
    {
      50: '#FDFDFD',
      100: '#F5FBF7',
      200: '#D3F3DE',
      300: '#7FDAA1',
      400: '#4CD07D',
      500: '#22C45D',
      600: '#1CA650',
      700: '#178A42',
      800: '#0E4F24',
      900: '#0A3F19',
      1000: '#062912',
    },
    '#1CA650',
  ),
  scaleBlock(
    'brandRed',
    {
      50: '#FDFDFD',
      100: '#FFF5F4',
      200: '#FCD9D8',
      300: '#FA8E87',
      400: '#FF6158',
      500: '#FF3D33',
      600: '#D9332B',
      700: '#B22A24',
      800: '#661612',
      900: '#470A0A',
      1000: '#330707',
    },
    '#D9332B',
  ),
  scaleBlock(
    'brandMarigold',
    {
      50: '#FDFDFD',
      100: '#FDF4E5',
      200: '#FBE3BE',
      300: '#F5B860',
      400: '#F7A633',
      500: '#F69000',
      600: '#E08201',
      700: '#B86A00',
      800: '#663C00',
      900: '#522F00',
      1000: '#3D2300',
    },
    '#F69000',
  ),
  scaleBlock(
    'brandPurple',
    {
      50: '#FDFDFD',
      100: '#EFEDF2',
      200: '#E4E1EA',
      300: '#9E90BC',
      400: '#7660A8',
      500: '#5D498E',
      600: '#4B3C71',
      700: '#3F3B6B',
      800: '#1F1A2B',
      900: '#1E1C32',
      1000: '#141320',
    },
    '#5D498E',
  ),
  scaleBlock(
    'brandGold',
    {
      50: '#FBFBFA',
      100: '#F0EEE9',
      200: '#E6DDCE',
      300: '#D5C19F',
      400: '#C4AA7B',
      500: '#907D53',
      600: '#766644',
      700: '#5D5135',
      800: '#433B26',
      900: '#2A2518',
      1000: '#1A160F',
    },
    '#907D53',
  ),
  scaleBlock(
    'brandRose',
    {
      50: '#FBFAFA',
      100: '#F0EAEB',
      200: '#E2CFD5',
      300: '#CEA2B1',
      400: '#BA7E92',
      500: '#975266',
      600: '#7B4353',
      700: '#603441',
      800: '#45252E',
      900: '#2A171C',
      1000: '#1A0E11',
    },
    '#7B4353',
  ),
].join('\n');

if (!src.includes('brandBlueSapphire:')) {
  src = src.replace(
    '    klearnow: ColorChromaticScale;\n    emerald:',
    `    klearnow: ColorChromaticScale;
    brandBlueSapphire: ColorChromaticScale;
    brandGreen: ColorChromaticScale;
    brandRed: ColorChromaticScale;
    brandMarigold: ColorChromaticScale;
    brandPurple: ColorChromaticScale;
    brandGold: ColorChromaticScale;
    brandRose: ColorChromaticScale;
    emerald:`,
  );
}

src = src.replace(/    klearnow: \{[\s\S]*?\n    \},/, klearnow);

if (!src.includes('brandBlueSapphire: {')) {
  src = src.replace(`${klearnow}`, `${klearnow}\n${brandScales}`);
}

const blueGraySteps = {
  0: '#FFFFFF',
  50: '#F8F9FA',
  100: '#F7F8FA',
  200: '#E1E3E7',
  300: '#A4ACBA',
  400: '#7F8EA1',
  500: '#64728C',
  600: '#536376',
  700: '#465162',
  800: '#272D36',
  900: '#1F252B',
  1000: '#272D36',
  1100: '#38404D',
  1200: '#212529',
  1300: '#1F252B',
};

for (const [key, hex] of Object.entries(blueGraySteps)) {
  const hsl = hexToHsla(hex);
  const lineRe = new RegExp(`      ${key}: \`hsla\\([^)]+\`,`);
  src = src.replace(lineRe, `      ${key}: \`${hsl}\`,`);
}

fs.writeFileSync(colorsPath, src);

const themeFiles = [
  path.join(__dirname, '../src/tokens/theme/klear360Theme.ts'),
  path.join(__dirname, '../src/tokens/theme/klear360NeutralTheme.ts'),
];

const onLightReplacements = [
  ['globalColors.chromatic.emerald', 'globalColors.chromatic.brandGreen'],
  ['globalColors.chromatic.crimson', 'globalColors.chromatic.brandRed'],
  ['globalColors.chromatic.cider', 'globalColors.chromatic.brandMarigold'],
  ['globalColors.chromatic.sapphire', 'globalColors.chromatic.brandBlueSapphire'],
  ['globalColors.chromatic.orchid', 'globalColors.chromatic.brandPurple'],
  ['globalColors.chromatic.topaz', 'globalColors.chromatic.brandGold'],
  ['globalColors.chromatic.magenta', 'globalColors.chromatic.brandRose'],
];

for (const file of themeFiles) {
  let text = fs.readFileSync(file, 'utf8');
  const start = text.indexOf('  onLight: {');
  const end = text.indexOf('  onDark: {');
  if (start === -1 || end === -1) continue;
  let onLight = text.slice(start, end);
  for (const [from, to] of onLightReplacements) {
    onLight = onLight.split(from).join(to);
  }
  fs.writeFileSync(file, text.slice(0, start) + onLight + text.slice(end));
}

console.log('Applied Klear palette to colors.ts and onLight theme mappings.');
