import { opacity } from './opacity';

export type ColorChromaticScale = Readonly<{
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
  1000: string;
  a50: string;
  a100: string;
  a150: string;
  a200: string;
  a400: string;
  a500?: string;
  a600?: string;
  a700?: string;
}>;

export type ColorChromaticScaleExtended = Readonly<{
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
  1000: string;
  a50: string;
  a100: string;
  a150: string;
  a200: string;
  a400: string;
  a500: string;
  a600: string;
  a700: string;
}>;

export type ColorNeutralGrayScale = Readonly<{
  0: string;
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
  1000: string;
  1100: string;
  1200: string;
  1300: string;
  a25: string;
  a50: string;
  a75: string;
  a100: string;
  a200: string;
  a400: string;
  a500?: string;
  a600?: string;
  a700?: string;
}>;

export type ColorNeutralGrayScaleExtended = Readonly<{
  0: string;
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
  1000: string;
  1100: string;
  1200: string;
  1300: string;
  a25: string;
  a50: string;
  a75: string;
  a100: string;
  a200: string;
  a400: string;
  a500: string;
  a600: string;
  a700: string;
}>;

export type ColorBlueGrayLightScale = Readonly<{
  0: string;
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
  1000: string;
  1100: string;
  1200: string;
  1300: string;
  a0: string;
  a1: string;
  a25: string;
  a48: string;
  a50: string;
  a75: string;
  a100: string;
  a200: string;
  a400: string;
  a406: string;
  a500: string;
  a600: string;
  a700: string;
  a906: string;
  a900: string;
  a909: string;
  a912: string;
  a918: string;
  a924: string;
  a932: string;
  a964: string;
  a1072: string;
  a1106: string;
  a1264: string;
  a1288: string;
}>;

export type ColorBlueGrayDarkScale = Readonly<{
  0: string;
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
  1000: string;
  1100: string;
  1200: string;
  1300: string;
  a0: string;
  a1: string;
  a25: string;
  a48: string;
  a50: string;
  a75: string;
  a100: string;
  a200: string;
  a300: string;
  a400: string;
  a500: string;
  a506: string;
  a509: string;
  a512: string;
  a518: string;
  a524: string;
  a532: string;
  a564: string;
  a572: string;
  a888: string;
  a1188: string;
  a1194: string;
  a1312: string;
  a1388: string;
}>;

export type ColorNeutralStaticScale = Readonly<{
  1: string;
  5: string;
  10: string;
  25: string;
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  450: string;
  500: string;
}>;

export type ColorNeutralSolidScale = Readonly<{
  1: string;
  5: string;
  10: string;
  25: string;
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  450: string;
  500: string;
}>;

export type Color = Readonly<{
  chromatic: {
    azure: ColorChromaticScale;
    /** Klearnow brand primary — used for light mode (`onLight`) theme mappings */
    klearnow: ColorChromaticScale;
    brandBlueSapphire: ColorChromaticScale;
    brandGreen: ColorChromaticScale;
    brandRed: ColorChromaticScale;
    brandMarigold: ColorChromaticScale;
    brandPurple: ColorChromaticScale;
    brandGold: ColorChromaticScale;
    brandRose: ColorChromaticScale;
    emerald: ColorChromaticScaleExtended;
    crimson: ColorChromaticScaleExtended;
    cider: ColorChromaticScaleExtended;
    sapphire: ColorChromaticScaleExtended;
    sea: ColorChromaticScale;
    cloud: ColorChromaticScale;
    forest: ColorChromaticScale;
    orchid: ColorChromaticScale;
    magenta: ColorChromaticScale;
    topaz: ColorChromaticScale;
  };
  neutral: {
    blueGrayLight: ColorBlueGrayLightScale;
    blueGrayDark: ColorBlueGrayDarkScale;
    ashGrayLight: ColorNeutralGrayScale;
    ashGrayDark: ColorNeutralGrayScale;
    white: ColorNeutralStaticScale;
    black: ColorNeutralStaticScale;
    whiteSolid: ColorNeutralSolidScale;
    blackSolid: ColorNeutralSolidScale;
  };
}>;

export const colors: Color = {
  chromatic: {
    azure: {
      50: `hsla(217, 100%, 98%, ${opacity[1300]})`,
      100: `hsla(218, 100%, 92%, ${opacity[1300]})`,
      200: `hsla(218, 100%, 83%, ${opacity[1300]})`,
      300: `hsla(217, 100%, 73%, ${opacity[1300]})`,
      400: `hsla(218, 100%, 63%, ${opacity[1300]})`,
      500: `hsla(218, 89%, 51%, ${opacity[1300]})`,
      600: `hsla(218, 87%, 43%, ${opacity[1300]})`,
      700: `hsla(218, 89%, 35%, ${opacity[1300]})`,
      800: `hsla(218, 90%, 28%, ${opacity[1300]})`,
      900: `hsla(218, 90%, 20%, ${opacity[1300]})`,
      1000: `hsla(218, 93%, 10%, ${opacity[1300]})`,
      a50: `hsla(218, 89%, 51%, ${opacity[100]})`,
      a100: `hsla(218, 89%, 51%, ${opacity[300]})`,
      a150: `hsla(218, 89%, 51%, ${opacity[400]})`,
      a200: `hsla(218, 89%, 51%, ${opacity[500]})`,
      a400: `hsla(218, 89%, 51%, ${opacity[800]})`,
    },
    klearnow: {
      50: `hsla(0, 0%, 99%, ${opacity[1300]})`,
      100: `hsla(207, 23%, 92%, ${opacity[1300]})`,
      200: `hsla(200, 20%, 79%, ${opacity[1300]})`,
      300: `hsla(199, 24%, 47%, ${opacity[1300]})`,
      400: `hsla(199, 42%, 34%, ${opacity[1300]})`,
      500: `hsla(198, 100%, 18%, ${opacity[1300]})`,
      600: `hsla(198, 100%, 16%, ${opacity[1300]})`,
      700: `hsla(198, 100%, 13%, ${opacity[1300]})`,
      800: `hsla(198, 95%, 7%, ${opacity[1300]})`,
      900: `hsla(206, 85%, 5%, ${opacity[1300]})`,
      1000: `hsla(204, 88%, 3%, ${opacity[1300]})`,
      a50: `hsla(198, 100%, 18%, ${opacity[100]})`,
      a100: `hsla(198, 100%, 18%, ${opacity[300]})`,
      a150: `hsla(198, 100%, 18%, ${opacity[400]})`,
      a200: `hsla(198, 100%, 18%, ${opacity[500]})`,
      a400: `hsla(198, 100%, 18%, ${opacity[800]})`,
    },
    brandBlueSapphire: {
      50: `hsla(0, 0%, 99%, ${opacity[1300]})`,
      100: `hsla(190, 32%, 93%, ${opacity[1300]})`,
      200: `hsla(193, 29%, 81%, ${opacity[1300]})`,
      300: `hsla(195, 31%, 51%, ${opacity[1300]})`,
      400: `hsla(194, 49%, 39%, ${opacity[1300]})`,
      500: `hsla(194, 100%, 24%, ${opacity[1300]})`,
      600: `hsla(195, 100%, 22%, ${opacity[1300]})`,
      700: `hsla(194, 100%, 17%, ${opacity[1300]})`,
      800: `hsla(195, 100%, 10%, ${opacity[1300]})`,
      900: `hsla(199, 100%, 7%, ${opacity[1300]})`,
      1000: `hsla(200, 100%, 5%, ${opacity[1300]})`,
      a50: `hsla(194, 100%, 24%, ${opacity[100]})`,
      a100: `hsla(194, 100%, 24%, ${opacity[300]})`,
      a150: `hsla(194, 100%, 24%, ${opacity[400]})`,
      a200: `hsla(194, 100%, 24%, ${opacity[500]})`,
      a400: `hsla(194, 100%, 24%, ${opacity[800]})`,
    },
    brandGreen: {
      50: `hsla(0, 0%, 99%, ${opacity[1300]})`,
      100: `hsla(140, 43%, 97%, ${opacity[1300]})`,
      200: `hsla(141, 57%, 89%, ${opacity[1300]})`,
      300: `hsla(142, 55%, 68%, ${opacity[1300]})`,
      400: `hsla(142, 58%, 56%, ${opacity[1300]})`,
      500: `hsla(142, 70%, 45%, ${opacity[1300]})`,
      600: `hsla(143, 71%, 38%, ${opacity[1300]})`,
      700: `hsla(142, 71%, 32%, ${opacity[1300]})`,
      800: `hsla(140, 70%, 18%, ${opacity[1300]})`,
      900: `hsla(137, 73%, 14%, ${opacity[1300]})`,
      1000: `hsla(141, 74%, 9%, ${opacity[1300]})`,
      a50: `hsla(143, 71%, 38%, ${opacity[100]})`,
      a100: `hsla(143, 71%, 38%, ${opacity[300]})`,
      a150: `hsla(143, 71%, 38%, ${opacity[400]})`,
      a200: `hsla(143, 71%, 38%, ${opacity[500]})`,
      a400: `hsla(143, 71%, 38%, ${opacity[800]})`,
    },
    brandRed: {
      50: `hsla(0, 0%, 99%, ${opacity[1300]})`,
      100: `hsla(5, 100%, 98%, ${opacity[1300]})`,
      200: `hsla(2, 86%, 92%, ${opacity[1300]})`,
      300: `hsla(4, 92%, 75%, ${opacity[1300]})`,
      400: `hsla(3, 100%, 67%, ${opacity[1300]})`,
      500: `hsla(3, 100%, 60%, ${opacity[1300]})`,
      600: `hsla(3, 70%, 51%, ${opacity[1300]})`,
      700: `hsla(3, 66%, 42%, ${opacity[1300]})`,
      800: `hsla(3, 70%, 24%, ${opacity[1300]})`,
      900: `hsla(0, 75%, 16%, ${opacity[1300]})`,
      1000: `hsla(0, 76%, 11%, ${opacity[1300]})`,
      a50: `hsla(3, 70%, 51%, ${opacity[100]})`,
      a100: `hsla(3, 70%, 51%, ${opacity[300]})`,
      a150: `hsla(3, 70%, 51%, ${opacity[400]})`,
      a200: `hsla(3, 70%, 51%, ${opacity[500]})`,
      a400: `hsla(3, 70%, 51%, ${opacity[800]})`,
    },
    brandMarigold: {
      50: `hsla(0, 0%, 99%, ${opacity[1300]})`,
      100: `hsla(38, 86%, 95%, ${opacity[1300]})`,
      200: `hsla(36, 88%, 86%, ${opacity[1300]})`,
      300: `hsla(35, 88%, 67%, ${opacity[1300]})`,
      400: `hsla(35, 92%, 58%, ${opacity[1300]})`,
      500: `hsla(35, 100%, 48%, ${opacity[1300]})`,
      600: `hsla(35, 99%, 44%, ${opacity[1300]})`,
      700: `hsla(35, 100%, 36%, ${opacity[1300]})`,
      800: `hsla(35, 100%, 20%, ${opacity[1300]})`,
      900: `hsla(34, 100%, 16%, ${opacity[1300]})`,
      1000: `hsla(34, 100%, 12%, ${opacity[1300]})`,
      a50: `hsla(35, 100%, 48%, ${opacity[100]})`,
      a100: `hsla(35, 100%, 48%, ${opacity[300]})`,
      a150: `hsla(35, 100%, 48%, ${opacity[400]})`,
      a200: `hsla(35, 100%, 48%, ${opacity[500]})`,
      a400: `hsla(35, 100%, 48%, ${opacity[800]})`,
    },
    brandPurple: {
      50: `hsla(0, 0%, 99%, ${opacity[1300]})`,
      100: `hsla(264, 16%, 94%, ${opacity[1300]})`,
      200: `hsla(260, 18%, 90%, ${opacity[1300]})`,
      300: `hsla(259, 25%, 65%, ${opacity[1300]})`,
      400: `hsla(258, 29%, 52%, ${opacity[1300]})`,
      500: `hsla(257, 32%, 42%, ${opacity[1300]})`,
      600: `hsla(257, 31%, 34%, ${opacity[1300]})`,
      700: `hsla(245, 29%, 33%, ${opacity[1300]})`,
      800: `hsla(258, 25%, 14%, ${opacity[1300]})`,
      900: `hsla(245, 28%, 15%, ${opacity[1300]})`,
      1000: `hsla(245, 25%, 10%, ${opacity[1300]})`,
      a50: `hsla(257, 32%, 42%, ${opacity[100]})`,
      a100: `hsla(257, 32%, 42%, ${opacity[300]})`,
      a150: `hsla(257, 32%, 42%, ${opacity[400]})`,
      a200: `hsla(257, 32%, 42%, ${opacity[500]})`,
      a400: `hsla(257, 32%, 42%, ${opacity[800]})`,
    },
    brandGold: {
      50: `hsla(60, 11%, 98%, ${opacity[1300]})`,
      100: `hsla(43, 19%, 93%, ${opacity[1300]})`,
      200: `hsla(38, 32%, 85%, ${opacity[1300]})`,
      300: `hsla(38, 39%, 73%, ${opacity[1300]})`,
      400: `hsla(39, 38%, 63%, ${opacity[1300]})`,
      500: `hsla(41, 27%, 45%, ${opacity[1300]})`,
      600: `hsla(41, 27%, 36%, ${opacity[1300]})`,
      700: `hsla(42, 27%, 29%, ${opacity[1300]})`,
      800: `hsla(43, 28%, 21%, ${opacity[1300]})`,
      900: `hsla(43, 27%, 13%, ${opacity[1300]})`,
      1000: `hsla(38, 27%, 8%, ${opacity[1300]})`,
      a50: `hsla(41, 27%, 45%, ${opacity[100]})`,
      a100: `hsla(41, 27%, 45%, ${opacity[300]})`,
      a150: `hsla(41, 27%, 45%, ${opacity[400]})`,
      a200: `hsla(41, 27%, 45%, ${opacity[500]})`,
      a400: `hsla(41, 27%, 45%, ${opacity[800]})`,
    },
    brandRose: {
      50: `hsla(0, 11%, 98%, ${opacity[1300]})`,
      100: `hsla(350, 17%, 93%, ${opacity[1300]})`,
      200: `hsla(341, 25%, 85%, ${opacity[1300]})`,
      300: `hsla(340, 31%, 72%, ${opacity[1300]})`,
      400: `hsla(340, 30%, 61%, ${opacity[1300]})`,
      500: `hsla(343, 30%, 46%, ${opacity[1300]})`,
      600: `hsla(343, 29%, 37%, ${opacity[1300]})`,
      700: `hsla(342, 30%, 29%, ${opacity[1300]})`,
      800: `hsla(343, 30%, 21%, ${opacity[1300]})`,
      900: `hsla(344, 29%, 13%, ${opacity[1300]})`,
      1000: `hsla(345, 30%, 8%, ${opacity[1300]})`,
      a50: `hsla(343, 29%, 37%, ${opacity[100]})`,
      a100: `hsla(343, 29%, 37%, ${opacity[300]})`,
      a150: `hsla(343, 29%, 37%, ${opacity[400]})`,
      a200: `hsla(343, 29%, 37%, ${opacity[500]})`,
      a400: `hsla(343, 29%, 37%, ${opacity[800]})`,
    },
    emerald: {
      50: `hsla(150, 39%, 93%, ${opacity[1300]})`,
      100: `hsla(149, 38%, 86%, ${opacity[1300]})`,
      200: `hsla(150, 38%, 72%, ${opacity[1300]})`,
      300: `hsla(150, 38%, 58%, ${opacity[1300]})`,
      400: `hsla(150, 48%, 44%, ${opacity[1300]})`,
      500: `hsla(153, 100%, 30%, ${opacity[1300]})`,
      600: `hsla(150, 100%, 28%, ${opacity[1300]})`,
      700: `hsla(150, 100%, 23%, ${opacity[1300]})`,
      800: `hsla(150, 100%, 18%, ${opacity[1300]})`,
      900: `hsla(150, 100%, 14%, ${opacity[1300]})`,
      1000: `hsla(150, 100%, 11%, ${opacity[1300]})`,
      a50: `hsla(150, 100%, 28%, ${opacity[100]})`,
      a100: `hsla(150, 100%, 28%, ${opacity[300]})`,
      a150: `hsla(150, 100%, 28%, ${opacity[400]})`,
      a200: `hsla(150, 100%, 28%, ${opacity[500]})`,
      a400: `hsla(150, 100%, 28%, ${opacity[800]})`,
      a500: `hsla(150, 100%, 28%, ${opacity[900]})`,
      a600: `hsla(150, 100%, 28%, ${opacity[1000]})`,
      a700: `hsla(150, 100%, 28%, ${opacity[1100]})`,
    },
    crimson: {
      50: `hsla(5, 75%, 97%, ${opacity[1300]})`,
      100: `hsla(5, 75%, 94%, ${opacity[1300]})`,
      200: `hsla(5, 76%, 85%, ${opacity[1300]})`,
      300: `hsla(5, 77%, 75%, ${opacity[1300]})`,
      400: `hsla(5, 76%, 63%, ${opacity[1300]})`,
      500: `hsla(5, 73%, 53%, ${opacity[1300]})`,
      600: `hsla(4, 85%, 44%, ${opacity[1300]})`,
      700: `hsla(4, 85%, 36%, ${opacity[1300]})`,
      800: `hsla(4, 84%, 30%, ${opacity[1300]})`,
      900: `hsla(3, 84%, 26%, ${opacity[1300]})`,
      1000: `hsla(4, 83%, 21%, ${opacity[1300]})`,
      a50: `hsla(4, 85%, 44%, ${opacity[100]})`,
      a100: `hsla(4, 85%, 44%, ${opacity[300]})`,
      a150: `hsla(4, 85%, 44%, ${opacity[400]})`,
      a200: `hsla(4, 85%, 44%, ${opacity[500]})`,
      a400: `hsla(4, 85%, 44%, ${opacity[800]})`,
      a500: `hsla(4, 85%, 44%, ${opacity[900]})`,
      a600: `hsla(4, 85%, 44%, ${opacity[1000]})`,
      a700: `hsla(4, 85%, 44%, ${opacity[1100]})`,
    },
    cider: {
      50: `hsla(23, 100%, 97%, ${opacity[1300]})`,
      100: `hsla(24, 100%, 92%, ${opacity[1300]})`,
      200: `hsla(25, 100%, 82%, ${opacity[1300]})`,
      300: `hsla(24, 100%, 71%, ${opacity[1300]})`,
      400: `hsla(22, 100%, 63%, ${opacity[1300]})`,
      500: `hsla(23, 92%, 53%, ${opacity[1300]})`,
      600: `hsla(25, 100%, 44%, ${opacity[1300]})`,
      700: `hsla(25, 100%, 39%, ${opacity[1300]})`,
      800: `hsla(25, 100%, 34%, ${opacity[1300]})`,
      900: `hsla(25, 100%, 28%, ${opacity[1300]})`,
      1000: `hsla(25, 100%, 21%, ${opacity[1300]})`,
      a50: `hsla(25, 100%, 44%, ${opacity[100]})`,
      a100: `hsla(25, 100%, 44%, ${opacity[300]})`,
      a150: `hsla(25, 100%, 44%, ${opacity[400]})`,
      a200: `hsla(25, 100%, 44%, ${opacity[500]})`,
      a400: `hsla(25, 100%, 44%, ${opacity[800]})`,
      a500: `hsla(25, 100%, 44%, ${opacity[900]})`,
      a600: `hsla(25, 100%, 44%, ${opacity[1000]})`,
      a700: `hsla(25, 100%, 44%, ${opacity[1100]})`,
    },
    sapphire: {
      50: `hsla(198, 85%, 95%, ${opacity[1300]})`,
      100: `hsla(199, 82%, 89%, ${opacity[1300]})`,
      200: `hsla(200, 83%, 79%, ${opacity[1300]})`,
      300: `hsla(199, 83%, 68%, ${opacity[1300]})`,
      400: `hsla(199, 83%, 58%, ${opacity[1300]})`,
      500: `hsla(198, 100%, 45%, ${opacity[1300]})`,
      600: `hsla(200, 100%, 41%, ${opacity[1300]})`,
      700: `hsla(200, 100%, 33%, ${opacity[1300]})`,
      800: `hsla(199, 100%, 26%, ${opacity[1300]})`,
      900: `hsla(200, 100%, 19%, ${opacity[1300]})`,
      1000: `hsla(199, 100%, 13%, ${opacity[1300]})`,
      a50: `hsla(200, 100%, 41%, ${opacity[100]})`,
      a100: `hsla(200, 100%, 41%, ${opacity[300]})`,
      a150: `hsla(200, 100%, 41%, ${opacity[400]})`,
      a200: `hsla(200, 100%, 41%, ${opacity[500]})`,
      a400: `hsla(200, 100%, 41%, ${opacity[800]})`,
      a500: `hsla(200, 100%, 41%, ${opacity[900]})`,
      a600: `hsla(200, 100%, 41%, ${opacity[1000]})`,
      a700: `hsla(200, 100%, 41%, ${opacity[1100]})`,
    },
    sea: {
      50: `hsla(180, 39%, 95%, ${opacity[1300]})`,
      100: `hsla(180, 42%, 92%, ${opacity[1300]})`,
      200: `hsla(180, 33%, 82%, ${opacity[1300]})`,
      300: `hsla(180, 35%, 70%, ${opacity[1300]})`,
      400: `hsla(180, 30%, 52%, ${opacity[1300]})`,
      500: `hsla(180, 45%, 40%, ${opacity[1300]})`,
      600: `hsla(180, 60%, 30%, ${opacity[1300]})`,
      700: `hsla(180, 55%, 25%, ${opacity[1300]})`,
      800: `hsla(180, 61%, 20%, ${opacity[1300]})`,
      900: `hsla(180, 91%, 13%, ${opacity[1300]})`,
      1000: `hsla(180, 91%, 8%, ${opacity[1300]})`,
      a50: `hsla(180, 60%, 30%, ${opacity[100]})`,
      a100: `hsla(180, 60%, 30%, ${opacity[300]})`,
      a150: `hsla(180, 60%, 30%, ${opacity[400]})`,
      a200: `hsla(180, 60%, 30%, ${opacity[500]})`,
      a400: `hsla(180, 60%, 30%, ${opacity[800]})`,
    },
    cloud: {
      50: `hsla(198, 39%, 95%, ${opacity[1300]})`,
      100: `hsla(201, 39%, 93%, ${opacity[1300]})`,
      200: `hsla(200, 35%, 85%, ${opacity[1300]})`,
      300: `hsla(200, 35%, 70%, ${opacity[1300]})`,
      400: `hsla(200, 30%, 52%, ${opacity[1300]})`,
      500: `hsla(200, 45%, 40%, ${opacity[1300]})`,
      600: `hsla(200, 60%, 30%, ${opacity[1300]})`,
      700: `hsla(201, 55%, 25%, ${opacity[1300]})`,
      800: `hsla(200, 61%, 20%, ${opacity[1300]})`,
      900: `hsla(200, 91%, 13%, ${opacity[1300]})`,
      1000: `hsla(200, 91%, 8%, ${opacity[1300]})`,
      a50: `hsla(200, 60%, 30%, ${opacity[100]})`,
      a100: `hsla(200, 60%, 30%, ${opacity[300]})`,
      a150: `hsla(200, 60%, 30%, ${opacity[400]})`,
      a200: `hsla(200, 60%, 30%, ${opacity[500]})`,
      a400: `hsla(200, 60%, 30%, ${opacity[800]})`,
    },
    forest: {
      50: `hsla(152, 60%, 95%, ${opacity[1300]})`,
      100: `hsla(151, 57%, 91%, ${opacity[1300]})`,
      200: `hsla(150, 59%, 82%, ${opacity[1300]})`,
      300: `hsla(150, 59%, 73%, ${opacity[1300]})`,
      400: `hsla(150, 59%, 55%, ${opacity[1300]})`,
      500: `hsla(155, 100%, 37%, ${opacity[1300]})`,
      600: `hsla(155, 100%, 31%, ${opacity[1300]})`,
      700: `hsla(155, 100%, 27%, ${opacity[1300]})`,
      800: `hsla(155, 100%, 21%, ${opacity[1300]})`,
      900: `hsla(155, 100%, 16%, ${opacity[1300]})`,
      1000: `hsla(155, 100%, 11%, ${opacity[1300]})`,
      a50: `hsla(155, 100%, 31%, ${opacity[100]})`,
      a100: `hsla(155, 100%, 31%, ${opacity[300]})`,
      a150: `hsla(155, 100%, 31%, ${opacity[400]})`,
      a200: `hsla(155, 100%, 31%, ${opacity[500]})`,
      a400: `hsla(155, 100%, 31%, ${opacity[800]})`,
    },
    orchid: {
      50: `hsla(267, 100%, 95%, ${opacity[1300]})`,
      100: `hsla(264, 100%, 89%, ${opacity[1300]})`,
      200: `hsla(263, 100%, 84%, ${opacity[1300]})`,
      300: `hsla(261, 100%, 79%, ${opacity[1300]})`,
      400: `hsla(259, 100%, 74%, ${opacity[1300]})`,
      500: `hsla(258, 93%, 68%, ${opacity[1300]})`,
      600: `hsla(257, 69%, 58%, ${opacity[1300]})`,
      700: `hsla(258, 54%, 48%, ${opacity[1300]})`,
      800: `hsla(257, 58%, 37%, ${opacity[1300]})`,
      900: `hsla(257, 62%, 26%, ${opacity[1300]})`,
      1000: `hsla(257, 65%, 14%, ${opacity[1300]})`,
      a50: `hsla(258, 93%, 68%, ${opacity[100]})`,
      a100: `hsla(258, 93%, 68%, ${opacity[300]})`,
      a150: `hsla(258, 93%, 68%, ${opacity[400]})`,
      a200: `hsla(258, 93%, 68%, ${opacity[500]})`,
      a400: `hsla(258, 93%, 68%, ${opacity[800]})`,
    },
    magenta: {
      50: `hsla(309, 100%, 94%, ${opacity[1300]})`,
      100: `hsla(312, 100%, 87%, ${opacity[1300]})`,
      200: `hsla(316, 100%, 81%, ${opacity[1300]})`,
      300: `hsla(316, 90%, 73%, ${opacity[1300]})`,
      400: `hsla(316, 74%, 64%, ${opacity[1300]})`,
      500: `hsla(317, 60%, 55%, ${opacity[1300]})`,
      600: `hsla(317, 56%, 46%, ${opacity[1300]})`,
      700: `hsla(316, 63%, 36%, ${opacity[1300]})`,
      800: `hsla(316, 70%, 27%, ${opacity[1300]})`,
      900: `hsla(316, 76%, 18%, ${opacity[1300]})`,
      1000: `hsla(318, 80%, 10%, ${opacity[1300]})`,
      a50: `hsla(317, 60%, 55%, ${opacity[100]})`,
      a100: `hsla(317, 60%, 55%, ${opacity[300]})`,
      a150: `hsla(317, 60%, 55%, ${opacity[400]})`,
      a200: `hsla(317, 60%, 55%, ${opacity[500]})`,
      a400: `hsla(317, 60%, 55%, ${opacity[800]})`,
    },
    topaz: {
      50: `hsla(46, 86%, 83%, ${opacity[1300]})`,
      100: `hsla(46, 80%, 68%, ${opacity[1300]})`,
      200: `hsla(46, 75%, 55%, ${opacity[1300]})`,
      300: `hsla(46, 93%, 43%, ${opacity[1300]})`,
      400: `hsla(44, 100%, 37%, ${opacity[1300]})`,
      500: `hsla(41, 100%, 33%, ${opacity[1300]})`,
      600: `hsla(39, 100%, 28%, ${opacity[1300]})`,
      700: `hsla(38, 100%, 24%, ${opacity[1300]})`,
      800: `hsla(37, 100%, 18%, ${opacity[1300]})`,
      900: `hsla(35, 100%, 13%, ${opacity[1300]})`,
      1000: `hsla(33, 100%, 7%, ${opacity[1300]})`,
      a50: `hsla(41, 100%, 33%, ${opacity[100]})`,
      a100: `hsla(41, 100%, 33%, ${opacity[300]})`,
      a150: `hsla(41, 100%, 33%, ${opacity[400]})`,
      a200: `hsla(41, 100%, 33%, ${opacity[500]})`,
      a400: `hsla(41, 100%, 33%, ${opacity[800]})`,
    },
  },
  neutral: {
    blueGrayLight: {
      0: `hsla(0, 0%, 100%, ${opacity[1300]})`,
      50: `hsla(210, 40%, 98%, ${opacity[1300]})`,
      100: `hsla(210, 40%, 96%, ${opacity[1300]})`,
      200: `hsla(204, 8%, 88%, ${opacity[1300]})`,
      300: `hsla(203, 8%, 80%, ${opacity[1300]})`,
      400: `hsla(205, 8%, 71%, ${opacity[1300]})`,
      500: `hsla(203, 8%, 62%, ${opacity[1300]})`,
      600: `hsla(202, 8%, 52%, ${opacity[1300]})`,
      700: `hsla(204, 9%, 42%, ${opacity[1300]})`,
      800: `hsla(206, 9%, 34%, ${opacity[1300]})`,
      900: `hsla(206, 10%, 29%, ${opacity[1300]})`,
      1000: `hsla(205, 10%, 24%, ${opacity[1300]})`,
      1100: `hsla(200, 10%, 18%, ${opacity[1300]})`,
      1200: `hsla(200, 11%, 11%, ${opacity[1300]})`,
      1300: `hsla(216, 56%, 2%, ${opacity[1300]})`,
      a0: `hsla(0, 0%, 100%, ${opacity[0]})`,
      a1: `hsla(0, 0%, 100%, ${opacity[1]})`,
      a25: `hsla(0, 0%, 100%, ${opacity[600]})`,
      a48: `hsla(0, 0%, 100%, ${opacity[1200]})`,
      a50: `hsla(0, 0%, 97%, ${opacity[0]})`,
      a75: `hsla(0, 0%, 97%, ${opacity[600]})`,
      a100: `hsla(0, 0%, 97%, ${opacity[0]})`,
      a200: `hsla(204, 8%, 88%, ${opacity[0]})`,
      a400: `hsla(205, 8%, 71%, ${opacity[0]})`,
      a406: `hsla(205, 8%, 71%, ${opacity[50]})`,
      a500: `hsla(203, 8%, 62%, ${opacity[0]})`,
      a600: `hsla(202, 8%, 52%, ${opacity[0]})`,
      a700: `hsla(204, 9%, 42%, ${opacity[0]})`,
      a906: `hsla(206, 10%, 29%, ${opacity[50]})`,
      a900: `hsla(206, 10%, 29%, ${opacity[0]})`,
      a909: `hsla(206, 10%, 29%, ${opacity[100]})`,
      a912: `hsla(206, 10%, 29%, ${opacity[200]})`,
      a918: `hsla(206, 10%, 29%, ${opacity[300]})`,
      a924: `hsla(206, 10%, 29%, ${opacity[400]})`,
      a932: `hsla(206, 10%, 29%, ${opacity[500]})`,
      a964: `hsla(206, 10%, 29%, ${opacity[800]})`,
      a1072: `hsla(205, 10%, 24%, ${opacity[900]})`,
      a1106: `hsla(200, 10%, 18%, ${opacity[50]})`,
      a1264: `hsla(200, 11%, 11%, ${opacity[800]})`,
      a1288: `hsla(200, 11%, 11%, ${opacity[1100]})`,
    },
    blueGrayDark: {
      0: `hsla(0, 0%, 100%, ${opacity[1300]})`,
      50: `hsla(180, 2%, 92%, ${opacity[1300]})`,
      100: `hsla(210, 2%, 84%, ${opacity[1300]})`,
      200: `hsla(210, 3%, 76%, ${opacity[1300]})`,
      300: `hsla(210, 3%, 69%, ${opacity[1300]})`,
      400: `hsla(210, 3%, 60%, ${opacity[1300]})`,
      500: `hsla(207, 4%, 52%, ${opacity[1300]})`,
      600: `hsla(210, 4%, 47%, ${opacity[1300]})`,
      700: `hsla(206, 4%, 36%, ${opacity[1300]})`,
      800: `hsla(216, 4%, 24%, ${opacity[1300]})`,
      900: `hsla(210, 4%, 20%, ${opacity[1300]})`,
      1000: `hsla(210, 5%, 16%, ${opacity[1300]})`,
      1100: `hsla(210, 6%, 13%, ${opacity[1300]})`,
      1200: `hsla(210, 5%, 8%, ${opacity[1300]})`,
      1300: `hsla(210, 4%, 11%, ${opacity[1300]})`,
      a0: `hsla(0, 0%, 100%, ${opacity[0]})`,
      a1: `hsla(0, 0%, 100%, ${opacity[1]})`,
      a25: `hsla(0, 0%, 100%, ${opacity[600]})`,
      a48: `hsla(0, 0%, 100%, ${opacity[1200]})`,
      a50: `hsla(180, 2%, 92%, ${opacity[0]})`,
      a75: `hsla(180, 2%, 92%, ${opacity[600]})`,
      a100: `hsla(200, 10%, 94%, ${opacity[0]})`,
      a200: `hsla(210, 3%, 76%, ${opacity[0]})`,
      a300: `hsla(210, 3%, 69%, ${opacity[0]})`,
      a400: `hsla(210, 3%, 60%, ${opacity[0]})`,
      a500: `hsla(207, 4%, 52%, ${opacity[0]})`,
      a506: `hsla(207, 4%, 52%, ${opacity[50]})`,
      a509: `hsla(207, 4%, 52%, ${opacity[100]})`,
      a512: `hsla(207, 4%, 52%, ${opacity[200]})`,
      a518: `hsla(207, 4%, 52%, ${opacity[300]})`,
      a524: `hsla(207, 4%, 52%, ${opacity[400]})`,
      a532: `hsla(207, 4%, 52%, ${opacity[500]})`,
      a564: `hsla(207, 4%, 52%, ${opacity[800]})`,
      a572: `hsla(207, 4%, 52%, ${opacity[900]})`,
      a888: `hsla(216, 4%, 24%, ${opacity[1100]})`,
      a1188: `hsla(210, 6%, 13%, ${opacity[1100]})`,
      a1194: `hsla(210, 6%, 13%, ${opacity[1200]})`,
      a1312: `hsla(210, 4%, 11%, ${opacity[200]})`,
      a1388: `hsla(210, 4%, 11%, ${opacity[1100]})`,
    },
    ashGrayLight: {
      0: `hsla(0, 0%, 100%, ${opacity[1300]})`,
      50: `hsla(240, 9%, 98%, ${opacity[1300]})`,
      100: `hsla(210, 9%, 96%, ${opacity[1300]})`,
      200: `hsla(210, 6%, 94%, ${opacity[1300]})`,
      300: `hsla(210, 4%, 89%, ${opacity[1300]})`,
      400: `hsla(214, 7%, 81%, ${opacity[1300]})`,
      500: `hsla(216, 6%, 69%, ${opacity[1300]})`,
      600: `hsla(215, 6%, 60%, ${opacity[1300]})`,
      700: `hsla(214, 6%, 55%, ${opacity[1300]})`,
      800: `hsla(216, 7%, 45%, ${opacity[1300]})`,
      900: `hsla(218, 9%, 36%, ${opacity[1300]})`,
      1000: `hsla(219, 12%, 28%, ${opacity[1300]})`,
      1100: `hsla(214, 15%, 18%, ${opacity[1300]})`,
      1200: `hsla(216, 15%, 13%, ${opacity[1300]})`,
      1300: `hsla(214, 24%, 6%, ${opacity[1300]})`,
      a25: `hsla(214, 6%, 55%, ${opacity[50]})`,
      a50: `hsla(214, 6%, 55%, ${opacity[100]})`,
      a75: `hsla(214, 6%, 55%, ${opacity[200]})`,
      a100: `hsla(214, 6%, 55%, ${opacity[300]})`,
      a200: `hsla(214, 6%, 55%, ${opacity[500]})`,
      a400: `hsla(214, 6%, 55%, ${opacity[500]})`,
    },
    ashGrayDark: {
      0: `hsla(0, 0%, 99%, ${opacity[1300]})`,
      50: `hsla(240, 2%, 92%, ${opacity[1300]})`,
      100: `hsla(240, 1%, 84%, ${opacity[1300]})`,
      200: `hsla(228, 4%, 76%, ${opacity[1300]})`,
      300: `hsla(227, 4%, 60%, ${opacity[1300]})`,
      400: `hsla(229, 4%, 50%, ${opacity[1300]})`,
      500: `hsla(233, 4%, 40%, ${opacity[1300]})`,
      600: `hsla(233, 5%, 32%, ${opacity[1300]})`,
      700: `hsla(230, 6%, 22%, ${opacity[1300]})`,
      800: `hsla(230, 6%, 19%, ${opacity[1300]})`,
      900: `hsla(230, 7%, 17%, ${opacity[1300]})`,
      1000: `hsla(230, 8%, 15%, ${opacity[1300]})`,
      1100: `hsla(231, 12%, 12%, ${opacity[1300]})`,
      1200: `hsla(231, 17%, 8%, ${opacity[1300]})`,
      1300: `hsla(240, 5%, 4%, ${opacity[1300]})`,
      a25: `hsla(228, 4%, 76%, ${opacity[50]})`,
      a50: `hsla(228, 4%, 76%, ${opacity[100]})`,
      a75: `hsla(228, 4%, 76%, ${opacity[200]})`,
      a100: `hsla(228, 4%, 76%, ${opacity[300]})`,
      a200: `hsla(228, 4%, 76%, ${opacity[500]})`,
      a400: `hsla(228, 4%, 76%, ${opacity[500]})`,
    },
    white: {
      1: `hsla(0, 0%, 100%, ${opacity[1]})`,
      5: `hsla(0, 0%, 100%, ${opacity[50]})`,
      10: `hsla(0, 0%, 100%, ${opacity[100]})`,
      25: `hsla(0, 0%, 100%, ${opacity[200]})`,
      50: `hsla(0, 0%, 100%, ${opacity[300]})`,
      100: `hsla(0, 0%, 100%, ${opacity[500]})`,
      200: `hsla(0, 0%, 100%, ${opacity[600]})`,
      300: `hsla(0, 0%, 100%, ${opacity[800]})`,
      400: `hsla(0, 0%, 100%, ${opacity[1000]})`,
      450: `hsla(0, 0%, 100%, ${opacity[1100]})`,
      500: `hsla(0, 0%, 100%, ${opacity[1300]})`,
    },
    black: {
      1: `hsla(0, 0%, 0%, ${opacity[1]})`,
      5: `hsla(0, 0%, 0%, ${opacity[50]})`,
      10: `hsla(0, 0%, 0%, ${opacity[100]})`,
      25: `hsla(0, 0%, 0%, ${opacity[200]})`,
      50: `hsla(0, 0%, 0%, ${opacity[300]})`,
      100: `hsla(0, 0%, 0%, ${opacity[500]})`,
      200: `hsla(0, 0%, 0%, ${opacity[700]})`,
      300: `hsla(0, 0%, 0%, ${opacity[900]})`,
      400: `hsla(0, 0%, 0%, ${opacity[1000]})`,
      450: `hsla(0, 0%, 0%, ${opacity[1100]})`,
      500: `hsla(0, 0%, 0%, ${opacity[1300]})`,
    },
    whiteSolid: {
      1: `hsla(210, 3%, 12%, ${opacity[1300]})`,
      5: `hsla(210, 2%, 16%, ${opacity[1300]})`,
      10: `hsla(210, 2%, 19%, ${opacity[1300]})`,
      25: `hsla(210, 2%, 21%, ${opacity[1300]})`,
      50: `hsla(210, 1%, 27%, ${opacity[1300]})`,
      100: `hsla(210, 1%, 39%, ${opacity[1300]})`,
      200: `hsla(210, 0%, 54%, ${opacity[1300]})`,
      300: `hsla(210, 0%, 68%, ${opacity[1300]})`,
      400: `hsla(210, 0%, 82%, ${opacity[1300]})`,
      450: `hsla(210, 0%, 89%, ${opacity[1300]})`,
      500: `hsla(0, 0%, 100%, ${opacity[1300]})`,
    },
    blackSolid: {
      1: `hsla(0, 0%, 96%, ${opacity[1300]})`,
      5: `hsla(0, 0%, 91%, ${opacity[1300]})`,
      10: `hsla(0, 0%, 88%, ${opacity[1300]})`,
      25: `hsla(0, 0%, 85%, ${opacity[1300]})`,
      50: `hsla(0, 0%, 79%, ${opacity[1300]})`,
      100: `hsla(0, 0%, 66%, ${opacity[1300]})`,
      200: `hsla(0, 0%, 42%, ${opacity[1300]})`,
      300: `hsla(0, 0%, 27%, ${opacity[1300]})`,
      400: `hsla(0, 0%, 19%, ${opacity[1300]})`,
      450: `hsla(0, 0%, 12%, ${opacity[1300]})`,
      500: `hsla(0, 0%, 0%, ${opacity[1300]})`,
    },
  },
};
