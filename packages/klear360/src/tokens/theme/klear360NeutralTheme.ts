/** Same a700 optional-token handling as klear360Theme.ts (Track A build fix). */
import type { ThemeTokens, ColorsWithModes } from './theme';
import {
  border,
  backdropBlur,
  breakpoints,
  colors as globalColors,
  motion,
  spacing,
  typography,
  elevation,
  opacity,
} from '~tokens/global';

const colors: ColorsWithModes = {
  onLight: {
    surface: {
      background: {
        gray: {
          subtle: globalColors.neutral.blueGrayLight[100],
          moderate: globalColors.neutral.blueGrayLight[50],
          intense: globalColors.neutral.blueGrayLight[0],
        },
        primary: {
          faint: globalColors.chromatic.klearnow[50],
          subtle: globalColors.chromatic.klearnow[100],
          moderate: globalColors.chromatic.klearnow[500],
          intense: globalColors.chromatic.klearnow[600],
          strong: globalColors.chromatic.klearnow[900],
        },
        sea: {
          subtle: globalColors.chromatic.sea[50],
          intense: globalColors.chromatic.sea[800],
        },
        cloud: {
          subtle: globalColors.chromatic.cloud[50],
          intense: globalColors.chromatic.cloud[800],
        },
        accent: {
          intense: globalColors.chromatic.forest[500],
        },
      },
      border: {
        gray: {
          normal: globalColors.neutral.blueGrayLight[300],
          subtle: globalColors.neutral.blueGrayLight[200],
          muted: globalColors.neutral.blueGrayLight.a912,
        },
        primary: {
          normal: globalColors.chromatic.klearnow[500],
          muted: globalColors.chromatic.klearnow.a100,
        },
      },
      text: {
        gray: {
          normal: globalColors.neutral.blueGrayLight[1300],
          subtle: globalColors.neutral.blueGrayLight[1100],
          muted: globalColors.neutral.blueGrayLight[700],
          disabled: globalColors.neutral.blueGrayLight.a932,
        },
        primary: {
          normal: globalColors.chromatic.klearnow[500],
        },
        onSea: {
          onSubtle: globalColors.chromatic.forest[800],
          onIntense: globalColors.chromatic.forest[200],
        },
        onCloud: {
          onSubtle: globalColors.chromatic.klearnow[600],
          onIntense: globalColors.chromatic.klearnow[200],
        },
        staticWhite: {
          normal: globalColors.neutral.white[500],
          subtle: globalColors.neutral.white[450],
          muted: globalColors.neutral.white[200],
          disabled: globalColors.neutral.white[100],
        },
        staticBlack: {
          normal: globalColors.neutral.black[500],
          subtle: globalColors.neutral.black[300],
          muted: globalColors.neutral.black[200],
          disabled: globalColors.neutral.black[100],
        },
      },
      icon: {
        gray: {
          normal: globalColors.neutral.blueGrayLight[1300],
          subtle: globalColors.neutral.blueGrayLight[1100],
          muted: globalColors.neutral.blueGrayLight[700],
          disabled: globalColors.neutral.blueGrayLight.a932,
        },
        primary: {
          normal: globalColors.chromatic.klearnow[500],
        },
        onSea: {
          onSubtle: globalColors.chromatic.forest[600],
          onIntense: globalColors.chromatic.forest[400],
        },
        onCloud: {
          onSubtle: globalColors.chromatic.klearnow[400],
          onIntense: globalColors.chromatic.klearnow[300],
        },
        staticWhite: {
          normal: globalColors.neutral.white[500],
          subtle: globalColors.neutral.white[450],
          muted: globalColors.neutral.white[200],
          disabled: globalColors.neutral.white[100],
        },
        staticBlack: {
          normal: globalColors.neutral.black[500],
          subtle: globalColors.neutral.black[300],
          muted: globalColors.neutral.black[200],
          disabled: globalColors.neutral.black[100],
        },
      },
    },
    feedback: {
      background: {
        positive: {
          subtle: globalColors.chromatic.brandGreen.a50,
          intense: globalColors.chromatic.brandGreen[600],
        },
        negative: {
          subtle: globalColors.chromatic.brandRed.a50,
          intense: globalColors.chromatic.brandRed[600],
        },
        notice: {
          subtle: globalColors.chromatic.brandMarigold.a50,
          intense: globalColors.chromatic.brandMarigold[600],
        },
        information: {
          subtle: globalColors.chromatic.brandBlueSapphire.a50,
          intense: globalColors.chromatic.brandBlueSapphire[600],
        },
        neutral: {
          subtle: globalColors.neutral.blueGrayLight.a909,
          intense: globalColors.neutral.blueGrayLight[1100],
        },
      },
      border: {
        positive: {
          subtle: globalColors.chromatic.brandGreen.a100,
          intense: globalColors.chromatic.brandGreen[700],
        },
        negative: {
          subtle: globalColors.chromatic.brandRed.a100,
          intense: globalColors.chromatic.brandRed[700],
        },
        notice: {
          subtle: globalColors.chromatic.brandMarigold.a100,
          intense: globalColors.chromatic.brandMarigold[700],
        },
        information: {
          subtle: globalColors.chromatic.brandBlueSapphire.a100,
          intense: globalColors.chromatic.brandBlueSapphire[700],
        },
        neutral: {
          subtle: globalColors.neutral.blueGrayLight.a918,
          intense: globalColors.neutral.blueGrayLight[900],
        },
      },
      text: {
        positive: {
          subtle: globalColors.chromatic.brandGreen[100],
          intense: globalColors.chromatic.brandGreen[700],
        },
        negative: {
          subtle: globalColors.chromatic.brandRed[100],
          intense: globalColors.chromatic.brandRed[600],
        },
        notice: {
          subtle: globalColors.chromatic.brandMarigold[100],
          intense: globalColors.chromatic.brandMarigold[700],
        },
        information: {
          subtle: globalColors.chromatic.brandBlueSapphire[100],
          intense: globalColors.chromatic.brandBlueSapphire[700],
        },
        neutral: {
          subtle: globalColors.neutral.blueGrayLight[500],
          intense: globalColors.neutral.blueGrayLight[1100],
        },
      },
      icon: {
        positive: {
          subtle: globalColors.chromatic.brandGreen[100],
          intense: globalColors.chromatic.brandGreen[700],
        },
        negative: {
          subtle: globalColors.chromatic.brandRed[100],
          intense: globalColors.chromatic.brandRed[600],
        },
        notice: {
          subtle: globalColors.chromatic.brandMarigold[100],
          intense: globalColors.chromatic.brandMarigold[700],
        },
        information: {
          subtle: globalColors.chromatic.brandBlueSapphire[100],
          intense: globalColors.chromatic.brandBlueSapphire[700],
        },
        neutral: {
          subtle: globalColors.neutral.blueGrayLight[500],
          intense: globalColors.neutral.blueGrayLight[1100],
        },
      },
    },
    interactive: {
      background: {
        positive: {
          default: globalColors.chromatic.brandGreen[600],
          highlighted: globalColors.chromatic.brandGreen[700],
          disabled: globalColors.chromatic.brandGreen.a50,
          faded: globalColors.chromatic.brandGreen.a50,
          fadedHighlighted: globalColors.chromatic.brandGreen.a100,
        },
        negative: {
          default: globalColors.chromatic.brandRed[600],
          highlighted: globalColors.chromatic.brandRed[700],
          disabled: globalColors.chromatic.brandRed.a50,
          faded: globalColors.chromatic.brandRed.a50,
          fadedHighlighted: globalColors.chromatic.brandRed.a100,
        },
        notice: {
          default: globalColors.chromatic.brandMarigold[600],
          highlighted: globalColors.chromatic.brandMarigold[700],
          disabled: globalColors.chromatic.brandMarigold.a50,
          faded: globalColors.chromatic.brandMarigold.a50,
          fadedHighlighted: globalColors.chromatic.brandMarigold.a100,
        },
        information: {
          default: globalColors.chromatic.brandBlueSapphire[600],
          highlighted: globalColors.chromatic.brandBlueSapphire[700],
          disabled: globalColors.chromatic.brandBlueSapphire.a50,
          faded: globalColors.chromatic.brandBlueSapphire.a50,
          fadedHighlighted: globalColors.chromatic.brandBlueSapphire.a100,
        },
        neutral: {
          default: globalColors.neutral.black[500],
          highlighted: globalColors.neutral.blackSolid[450],
          disabledSolid: globalColors.neutral.blackSolid[100],
          disabled: globalColors.neutral.black[50],
          faded: globalColors.neutral.blueGrayLight.a912,
          fadedHighlighted: globalColors.neutral.blueGrayLight.a918,
        },
        gray: {
          default: globalColors.neutral.blueGrayLight.a906,
          highlighted: globalColors.neutral.blueGrayLight.a912,
          disabled: globalColors.neutral.blueGrayLight.a906,
          faded: globalColors.neutral.blueGrayLight.a906,
          fadedHighlighted: globalColors.neutral.blueGrayLight.a909,
          ghost: globalColors.neutral.blueGrayLight.a0,
        },
        primary: {
          default: globalColors.chromatic.klearnow[500],
          highlighted: globalColors.chromatic.klearnow[600],
          disabled: globalColors.chromatic.klearnow.a100,
          faded: globalColors.chromatic.klearnow.a50,
          fadedHighlighted: globalColors.chromatic.klearnow.a100,
        },
        staticBlack: {
          default: globalColors.neutral.black[500],
          highlighted: globalColors.neutral.black[500],
          disabled: globalColors.neutral.black[200],
          faded: globalColors.neutral.black[50],
          fadedHighlighted: globalColors.neutral.black[100],
          ghost: globalColors.neutral.black[1],
        },
        staticWhite: {
          default: globalColors.neutral.white[500],
          highlighted: globalColors.neutral.white[400],
          disabled: globalColors.neutral.white[50],
          faded: globalColors.neutral.white[50],
          fadedHighlighted: globalColors.neutral.white[100],
          ghost: globalColors.neutral.white[1],
        },
      },
      border: {
        positive: {
          default: globalColors.chromatic.brandGreen[600],
          highlighted: globalColors.chromatic.brandGreen[700],
          disabled: globalColors.chromatic.brandGreen.a100,
          faded: globalColors.chromatic.brandGreen.a100,
        },
        negative: {
          default: globalColors.chromatic.brandRed[600],
          highlighted: globalColors.chromatic.brandRed[700],
          disabled: globalColors.chromatic.brandRed.a100,
          faded: globalColors.chromatic.brandRed.a100,
        },
        notice: {
          default: globalColors.chromatic.brandMarigold[600],
          highlighted: globalColors.chromatic.brandMarigold[700],
          disabled: globalColors.chromatic.brandMarigold.a100,
          faded: globalColors.chromatic.brandMarigold.a100,
        },
        information: {
          default: globalColors.chromatic.brandBlueSapphire[600],
          highlighted: globalColors.chromatic.brandBlueSapphire[700],
          disabled: globalColors.chromatic.brandBlueSapphire.a100,
          faded: globalColors.chromatic.brandBlueSapphire.a100,
        },
        neutral: {
          default: globalColors.neutral.black[500],
          highlighted: globalColors.neutral.black[450],
          disabled: globalColors.neutral.blueGrayLight[300],
          faded: globalColors.neutral.blueGrayLight.a912,
        },
        gray: {
          default: globalColors.neutral.blueGrayLight[200],
          highlighted: globalColors.neutral.blueGrayLight[400],
          disabled: globalColors.neutral.blueGrayLight[200],
          faded: globalColors.neutral.blueGrayLight.a918,
        },
        primary: {
          default: globalColors.neutral.black[500],
          highlighted: globalColors.neutral.black[450],
          disabled: globalColors.neutral.black[100],
          faded: globalColors.neutral.black[100],
        },
        staticWhite: {
          default: globalColors.neutral.white[500],
          highlighted: globalColors.neutral.white[400],
          disabled: globalColors.neutral.white[100],
          faded: globalColors.neutral.white[50],
          fadedHighlighted: globalColors.neutral.white[100],
        },
        staticBlack: {
          default: globalColors.neutral.black[500],
          highlighted: globalColors.neutral.black[500],
          disabled: globalColors.neutral.black[100],
          faded: globalColors.neutral.black[100],
          fadedHighlighted: globalColors.neutral.black[50],
        },
      },
      text: {
        positive: {
          normal: globalColors.chromatic.brandGreen[700],
          subtle: globalColors.chromatic.brandGreen[600],
          muted: globalColors.chromatic.brandGreen[400],
          disabled: globalColors.chromatic.brandGreen.a200,
        },
        negative: {
          normal: globalColors.chromatic.brandRed[600],
          subtle: globalColors.chromatic.brandRed[500],
          muted: globalColors.chromatic.brandRed[400],
          disabled: globalColors.chromatic.brandRed.a200,
        },
        notice: {
          normal: globalColors.chromatic.brandMarigold[700],
          subtle: globalColors.chromatic.brandMarigold[600],
          muted: globalColors.chromatic.brandMarigold[400],
          disabled: globalColors.chromatic.brandMarigold.a200,
        },
        information: {
          normal: globalColors.chromatic.brandBlueSapphire[700],
          subtle: globalColors.chromatic.brandBlueSapphire[600],
          muted: globalColors.chromatic.brandBlueSapphire[400],
          disabled: globalColors.chromatic.brandBlueSapphire.a200,
        },
        neutral: {
          normal: globalColors.neutral.blueGrayLight[1300],
          subtle: globalColors.neutral.blueGrayLight[1100],
          muted: globalColors.neutral.blueGrayLight[700],
          disabled: globalColors.neutral.blueGrayLight.a932,
        },
        gray: {
          normal: globalColors.neutral.blueGrayLight[1300],
          subtle: globalColors.neutral.blueGrayLight[1100],
          muted: globalColors.neutral.blueGrayLight[700],
          disabled: globalColors.neutral.blueGrayLight.a932,
        },
        primary: {
          normal: globalColors.neutral.black[500],
          subtle: globalColors.neutral.black[450],
          muted: globalColors.neutral.black[400],
          disabled: globalColors.neutral.black[200],
        },
        onPrimary: {
          normal: globalColors.neutral.white[500],
          subtle: globalColors.neutral.white[400],
          muted: globalColors.neutral.white[300],
          disabled: globalColors.neutral.white[100],
        },
        onNeutral: {
          normal: globalColors.neutral.white[500],
          subtle: globalColors.neutral.white[400],
          muted: globalColors.neutral.white[300],
          disabled: globalColors.neutral.white[100],
        },
        staticWhite: {
          normal: globalColors.neutral.white[500],
          subtle: globalColors.neutral.white[400],
          muted: globalColors.neutral.white[300],
          disabled: globalColors.neutral.white[100],
        },
        staticBlack: {
          normal: globalColors.neutral.black[500],
          subtle: globalColors.neutral.black[400],
          muted: globalColors.neutral.black[300],
          disabled: globalColors.neutral.black[100],
        },
      },
      icon: {
        positive: {
          normal: globalColors.chromatic.brandGreen[700],
          subtle: globalColors.chromatic.brandGreen[600],
          muted: globalColors.chromatic.brandGreen[400],
          disabled: globalColors.chromatic.brandGreen.a200,
        },
        negative: {
          normal: globalColors.chromatic.brandRed[600],
          subtle: globalColors.chromatic.brandRed[500],
          muted: globalColors.chromatic.brandRed[400],
          disabled: globalColors.chromatic.brandRed.a200,
        },
        notice: {
          normal: globalColors.chromatic.brandMarigold[700],
          subtle: globalColors.chromatic.brandMarigold[600],
          muted: globalColors.chromatic.brandMarigold[400],
          disabled: globalColors.chromatic.brandMarigold.a200,
        },
        information: {
          normal: globalColors.chromatic.brandBlueSapphire[700],
          subtle: globalColors.chromatic.brandBlueSapphire[600],
          muted: globalColors.chromatic.brandBlueSapphire[400],
          disabled: globalColors.chromatic.brandBlueSapphire.a200,
        },
        neutral: {
          normal: globalColors.neutral.blueGrayLight[1300],
          subtle: globalColors.neutral.blueGrayLight[1100],
          muted: globalColors.neutral.blueGrayLight[700],
          disabled: globalColors.neutral.blueGrayLight.a932,
        },
        gray: {
          normal: globalColors.neutral.blueGrayLight[1300],
          subtle: globalColors.neutral.blueGrayLight[1100],
          muted: globalColors.neutral.blueGrayLight[700],
          disabled: globalColors.neutral.blueGrayLight.a932,
        },
        primary: {
          normal: globalColors.neutral.black[500],
          subtle: globalColors.neutral.black[450],
          muted: globalColors.neutral.black[400],
          disabled: globalColors.neutral.black[200],
        },
        onPrimary: {
          normal: globalColors.neutral.white[500],
          subtle: globalColors.neutral.white[400],
          muted: globalColors.neutral.white[300],
          disabled: globalColors.neutral.white[100],
        },
        onNeutral: {
          normal: globalColors.neutral.white[500],
          subtle: globalColors.neutral.white[400],
          muted: globalColors.neutral.white[300],
          disabled: globalColors.neutral.white[100],
        },
        staticWhite: {
          normal: globalColors.neutral.white[500],
          subtle: globalColors.neutral.white[400],
          muted: globalColors.neutral.white[300],
          disabled: globalColors.neutral.white[100],
        },
        staticBlack: {
          normal: globalColors.neutral.black[500],
          subtle: globalColors.neutral.black[400],
          muted: globalColors.neutral.black[300],
          disabled: globalColors.neutral.black[100],
        },
      },
    },
    overlay: {
      background: {
        moderate: globalColors.neutral.blueGrayLight.a918,
        subtle: globalColors.neutral.black[200],
      },
    },
    popup: {
      background: {
        // @deprecated
        subtle: globalColors.neutral.blueGrayLight[0],
        // @deprecated
        intense: globalColors.neutral.blueGrayLight[1000],
        gray: {
          subtle: globalColors.neutral.blueGrayLight[0],
          moderate: globalColors.neutral.blueGrayLight.a48,
          intense: globalColors.neutral.black[300],
        },
        positive: {
          moderate:
            globalColors.chromatic.brandGreen.a700 ?? globalColors.chromatic.brandGreen.a400,
        },
        negative: {
          moderate: globalColors.chromatic.brandRed.a700 ?? globalColors.chromatic.brandRed.a400,
        },
        notice: {
          moderate:
            globalColors.chromatic.brandMarigold.a700 ?? globalColors.chromatic.brandMarigold.a400,
        },
        information: {
          moderate:
            globalColors.chromatic.brandBlueSapphire.a700 ??
            globalColors.chromatic.brandBlueSapphire.a400,
        },
        neutral: {
          moderate: globalColors.neutral.blueGrayLight.a1288,
        },
      },
      border: {
        // @deprecated
        subtle: globalColors.neutral.blueGrayLight.a100,
        // @deprecated
        intense: globalColors.neutral.blueGrayLight[900],
        gray: {
          subtle: globalColors.neutral.blueGrayLight.a909,
          moderate: globalColors.neutral.blueGrayLight[100],
          intense: globalColors.neutral.blueGrayLight[1000],
        },
        positive: {
          moderate: globalColors.chromatic.brandGreen[600],
        },
        negative: {
          moderate: globalColors.chromatic.brandRed[600],
        },
        notice: {
          moderate: globalColors.chromatic.brandMarigold[600],
        },
        information: {
          moderate: globalColors.chromatic.brandBlueSapphire[600],
        },
        neutral: {
          moderate: globalColors.neutral.blueGrayLight[1100],
        },
      },
    },
    data: {
      background: {
        categorical: {
          blue: {
            faint: globalColors.chromatic.klearnow[100],
            subtle: globalColors.chromatic.klearnow[200],
            moderate: globalColors.chromatic.klearnow[300],
            intense: globalColors.chromatic.klearnow[400],
            strong: globalColors.chromatic.klearnow[500],
          },
          green: {
            faint: globalColors.chromatic.brandGreen[100],
            subtle: globalColors.chromatic.brandGreen[200],
            moderate: globalColors.chromatic.brandGreen[300],
            intense: globalColors.chromatic.brandGreen[400],
            strong: globalColors.chromatic.brandGreen[500],
          },
          red: {
            faint: globalColors.chromatic.brandRed[100],
            subtle: globalColors.chromatic.brandRed[200],
            moderate: globalColors.chromatic.brandRed[300],
            intense: globalColors.chromatic.brandRed[400],
            strong: globalColors.chromatic.brandRed[500],
          },
          orange: {
            faint: globalColors.chromatic.brandMarigold[100],
            subtle: globalColors.chromatic.brandMarigold[200],
            moderate: globalColors.chromatic.brandMarigold[300],
            intense: globalColors.chromatic.brandMarigold[400],
            strong: globalColors.chromatic.brandMarigold[500],
          },
          skyBlue: {
            faint: globalColors.chromatic.brandBlueSapphire[100],
            subtle: globalColors.chromatic.brandBlueSapphire[200],
            moderate: globalColors.chromatic.brandBlueSapphire[300],
            intense: globalColors.chromatic.brandBlueSapphire[400],
            strong: globalColors.chromatic.brandBlueSapphire[500],
          },
          purple: {
            faint: globalColors.chromatic.brandPurple[100],
            subtle: globalColors.chromatic.brandPurple[200],
            moderate: globalColors.chromatic.brandPurple[300],
            intense: globalColors.chromatic.brandPurple[400],
            strong: globalColors.chromatic.brandPurple[500],
          },
          pink: {
            faint: globalColors.chromatic.brandRose[100],
            subtle: globalColors.chromatic.brandRose[200],
            moderate: globalColors.chromatic.brandRose[300],
            intense: globalColors.chromatic.brandRose[400],
            strong: globalColors.chromatic.brandRose[500],
          },
          gold: {
            faint: globalColors.chromatic.brandGold[50],
            subtle: globalColors.chromatic.brandGold[100],
            moderate: globalColors.chromatic.brandGold[200],
            intense: globalColors.chromatic.brandGold[300],
            strong: globalColors.chromatic.brandGold[400],
          },
          gray: {
            faint: globalColors.neutral.blueGrayLight[0],
            subtle: globalColors.neutral.blueGrayLight[50],
            moderate: globalColors.neutral.blueGrayLight[100],
            intense: globalColors.neutral.blueGrayLight[400],
            strong: globalColors.neutral.blueGrayLight[700],
          },
        },
        sequential: {
          blue: {
            50: globalColors.chromatic.klearnow[50],
            100: globalColors.chromatic.klearnow[100],
            200: globalColors.chromatic.klearnow[200],
            300: globalColors.chromatic.klearnow[300],
            400: globalColors.chromatic.klearnow[400],
            500: globalColors.chromatic.klearnow[500],
            600: globalColors.chromatic.klearnow[600],
            700: globalColors.chromatic.klearnow[700],
            800: globalColors.chromatic.klearnow[800],
            900: globalColors.chromatic.klearnow[900],
            1000: globalColors.chromatic.klearnow[1000],
          },
          green: {
            50: globalColors.chromatic.brandGreen[50],
            100: globalColors.chromatic.brandGreen[100],
            200: globalColors.chromatic.brandGreen[200],
            300: globalColors.chromatic.brandGreen[300],
            400: globalColors.chromatic.brandGreen[400],
            500: globalColors.chromatic.brandGreen[500],
            600: globalColors.chromatic.brandGreen[600],
            700: globalColors.chromatic.brandGreen[700],
            800: globalColors.chromatic.brandGreen[800],
            900: globalColors.chromatic.brandGreen[900],
            1000: globalColors.chromatic.brandGreen[1000],
          },
          red: {
            50: globalColors.chromatic.brandRed[50],
            100: globalColors.chromatic.brandRed[100],
            200: globalColors.chromatic.brandRed[200],
            300: globalColors.chromatic.brandRed[300],
            400: globalColors.chromatic.brandRed[400],
            500: globalColors.chromatic.brandRed[500],
            600: globalColors.chromatic.brandRed[600],
            700: globalColors.chromatic.brandRed[700],
            800: globalColors.chromatic.brandRed[800],
            900: globalColors.chromatic.brandRed[900],
            1000: globalColors.chromatic.brandRed[1000],
          },
          orange: {
            50: globalColors.chromatic.brandMarigold[50],
            100: globalColors.chromatic.brandMarigold[100],
            200: globalColors.chromatic.brandMarigold[200],
            300: globalColors.chromatic.brandMarigold[300],
            400: globalColors.chromatic.brandMarigold[400],
            500: globalColors.chromatic.brandMarigold[500],
            600: globalColors.chromatic.brandMarigold[600],
            700: globalColors.chromatic.brandMarigold[700],
            800: globalColors.chromatic.brandMarigold[800],
            900: globalColors.chromatic.brandMarigold[900],
            1000: globalColors.chromatic.brandMarigold[1000],
          },
          skyBlue: {
            50: globalColors.chromatic.brandBlueSapphire[50],
            100: globalColors.chromatic.brandBlueSapphire[100],
            200: globalColors.chromatic.brandBlueSapphire[200],
            300: globalColors.chromatic.brandBlueSapphire[300],
            400: globalColors.chromatic.brandBlueSapphire[400],
            500: globalColors.chromatic.brandBlueSapphire[500],
            600: globalColors.chromatic.brandBlueSapphire[600],
            700: globalColors.chromatic.brandBlueSapphire[700],
            800: globalColors.chromatic.brandBlueSapphire[800],
            900: globalColors.chromatic.brandBlueSapphire[900],
            1000: globalColors.chromatic.brandBlueSapphire[1000],
          },
          purple: {
            50: globalColors.chromatic.brandPurple[50],
            100: globalColors.chromatic.brandPurple[100],
            200: globalColors.chromatic.brandPurple[200],
            300: globalColors.chromatic.brandPurple[300],
            400: globalColors.chromatic.brandPurple[400],
            500: globalColors.chromatic.brandPurple[500],
            600: globalColors.chromatic.brandPurple[600],
            700: globalColors.chromatic.brandPurple[700],
            800: globalColors.chromatic.brandPurple[800],
            900: globalColors.chromatic.brandPurple[900],
            1000: globalColors.chromatic.brandPurple[1000],
          },
          pink: {
            50: globalColors.chromatic.brandRose[50],
            100: globalColors.chromatic.brandRose[100],
            200: globalColors.chromatic.brandRose[200],
            300: globalColors.chromatic.brandRose[300],
            400: globalColors.chromatic.brandRose[400],
            500: globalColors.chromatic.brandRose[500],
            600: globalColors.chromatic.brandRose[600],
            700: globalColors.chromatic.brandRose[700],
            800: globalColors.chromatic.brandRose[800],
            900: globalColors.chromatic.brandRose[900],
            1000: globalColors.chromatic.brandRose[1000],
          },
          gold: {
            50: globalColors.chromatic.brandGold[50],
            100: globalColors.chromatic.brandGold[100],
            200: globalColors.chromatic.brandGold[200],
            300: globalColors.chromatic.brandGold[300],
            400: globalColors.chromatic.brandGold[400],
            500: globalColors.chromatic.brandGold[500],
            600: globalColors.chromatic.brandGold[600],
            700: globalColors.chromatic.brandGold[700],
            800: globalColors.chromatic.brandGold[800],
            900: globalColors.chromatic.brandGold[900],
            1000: globalColors.chromatic.brandGold[1000],
          },
          gray: {
            0: globalColors.neutral.blueGrayLight[0],
            50: globalColors.neutral.blueGrayLight[50],
            100: globalColors.neutral.blueGrayLight[100],
            200: globalColors.neutral.blueGrayLight[200],
            300: globalColors.neutral.blueGrayLight[300],
            400: globalColors.neutral.blueGrayLight[400],
            500: globalColors.neutral.blueGrayLight[500],
            600: globalColors.neutral.blueGrayLight[600],
            700: globalColors.neutral.blueGrayLight[700],
            800: globalColors.neutral.blueGrayLight[800],
            900: globalColors.neutral.blueGrayLight[900],
            1000: globalColors.neutral.blueGrayLight[1000],
          },
        },
      },
    },
    transparent: `hsla(0, 0%, 100%, ${opacity[0]})`,
  },
  onDark: {
    surface: {
      background: {
        gray: {
          subtle: globalColors.neutral.blueGrayDark[1300],
          moderate: globalColors.neutral.blueGrayDark[1200],
          intense: globalColors.neutral.blueGrayDark[1100],
        },
        primary: {
          faint: 'transparent',
          subtle: globalColors.chromatic.klearnow.a200,
          moderate: 'transparent',
          intense: globalColors.chromatic.klearnow[500],
          strong: 'transparent',
        },
        sea: {
          subtle: globalColors.chromatic.sea[900],
          intense: globalColors.chromatic.sea[100],
        },
        cloud: {
          subtle: globalColors.chromatic.cloud[900],
          intense: globalColors.chromatic.cloud[100],
        },
        accent: {
          intense: 'transparent',
        },
      },
      border: {
        gray: {
          normal: globalColors.neutral.blueGrayDark[600],
          subtle: globalColors.neutral.blueGrayDark[800],
          muted: globalColors.neutral.blueGrayDark.a518,
        },
        primary: {
          normal: globalColors.chromatic.klearnow[500],
          muted: globalColors.chromatic.klearnow.a200,
        },
      },
      text: {
        gray: {
          normal: globalColors.neutral.blueGrayDark[0],
          subtle: globalColors.neutral.blueGrayDark[300],
          muted: globalColors.neutral.blueGrayDark[500],
          disabled: globalColors.neutral.blueGrayDark.a564,
        },
        primary: {
          normal: globalColors.chromatic.klearnow[200],
        },
        onSea: {
          onSubtle: globalColors.chromatic.forest[200],
          onIntense: globalColors.chromatic.forest[800],
        },
        onCloud: {
          onSubtle: globalColors.chromatic.klearnow[200],
          onIntense: globalColors.chromatic.klearnow[600],
        },
        staticWhite: {
          normal: globalColors.neutral.white[500],
          subtle: globalColors.neutral.white[450],
          muted: globalColors.neutral.white[200],
          disabled: globalColors.neutral.white[100],
        },
        staticBlack: {
          normal: globalColors.neutral.black[500],
          subtle: globalColors.neutral.black[300],
          muted: globalColors.neutral.black[200],
          disabled: globalColors.neutral.black[100],
        },
      },
      icon: {
        gray: {
          normal: globalColors.neutral.blueGrayDark[0],
          subtle: globalColors.neutral.blueGrayDark[300],
          muted: globalColors.neutral.blueGrayDark[500],
          disabled: globalColors.neutral.blueGrayDark.a532,
        },
        primary: {
          normal: globalColors.chromatic.klearnow[200],
        },
        onSea: {
          onSubtle: globalColors.chromatic.forest[400],
          onIntense: globalColors.chromatic.forest[600],
        },
        onCloud: {
          onSubtle: globalColors.chromatic.klearnow[300],
          onIntense: globalColors.chromatic.klearnow[400],
        },
        staticWhite: {
          normal: globalColors.neutral.white[500],
          subtle: globalColors.neutral.white[450],
          muted: globalColors.neutral.white[200],
          disabled: globalColors.neutral.white[100],
        },
        staticBlack: {
          normal: globalColors.neutral.black[500],
          subtle: globalColors.neutral.black[300],
          muted: globalColors.neutral.black[200],
          disabled: globalColors.neutral.black[100],
        },
      },
    },
    feedback: {
      background: {
        positive: {
          subtle: globalColors.chromatic.brandGreen.a100,
          intense: globalColors.chromatic.brandGreen[700],
        },
        negative: {
          subtle: globalColors.chromatic.brandRed.a100,
          intense: globalColors.chromatic.brandRed[700],
        },
        notice: {
          subtle: globalColors.chromatic.brandMarigold.a100,
          intense: globalColors.chromatic.brandMarigold[700],
        },
        information: {
          subtle: globalColors.chromatic.brandBlueSapphire.a100,
          intense: globalColors.chromatic.brandBlueSapphire[600],
        },
        neutral: {
          subtle: globalColors.neutral.blueGrayDark.a509,
          intense: globalColors.neutral.blueGrayDark[800],
        },
      },
      border: {
        positive: {
          subtle: globalColors.chromatic.brandGreen.a200,
          intense: globalColors.chromatic.brandGreen[800],
        },
        negative: {
          subtle: globalColors.chromatic.brandRed.a200,
          intense: globalColors.chromatic.brandRed[800],
        },
        notice: {
          subtle: globalColors.chromatic.brandMarigold.a200,
          intense: globalColors.chromatic.brandMarigold[800],
        },
        information: {
          subtle: globalColors.chromatic.brandBlueSapphire.a200,
          intense: globalColors.chromatic.brandBlueSapphire[800],
        },
        neutral: {
          subtle: globalColors.neutral.blueGrayDark.a518,
          intense: globalColors.neutral.blueGrayDark[800],
        },
      },
      text: {
        positive: {
          subtle: globalColors.chromatic.brandGreen[50],
          intense: globalColors.chromatic.brandGreen[400],
        },
        negative: {
          subtle: globalColors.chromatic.brandRed[50],
          intense: globalColors.chromatic.brandRed[400],
        },
        notice: {
          subtle: globalColors.chromatic.brandMarigold[50],
          intense: globalColors.chromatic.brandMarigold[400],
        },
        information: {
          subtle: globalColors.chromatic.brandBlueSapphire[50],
          intense: globalColors.chromatic.brandBlueSapphire[400],
        },
        neutral: {
          subtle: globalColors.neutral.blueGrayDark[500],
          intense: globalColors.neutral.blueGrayDark[300],
        },
      },
      icon: {
        positive: {
          subtle: globalColors.chromatic.brandGreen[50],
          intense: globalColors.chromatic.brandGreen[400],
        },
        negative: {
          subtle: globalColors.chromatic.brandRed[50],
          intense: globalColors.chromatic.brandRed[400],
        },
        notice: {
          subtle: globalColors.chromatic.brandMarigold[50],
          intense: globalColors.chromatic.brandMarigold[400],
        },
        information: {
          subtle: globalColors.chromatic.brandBlueSapphire[50],
          intense: globalColors.chromatic.brandBlueSapphire[400],
        },
        neutral: {
          subtle: globalColors.neutral.blueGrayDark[500],
          intense: globalColors.neutral.blueGrayDark[300],
        },
      },
    },
    interactive: {
      background: {
        positive: {
          default: globalColors.chromatic.brandGreen[600],
          highlighted: globalColors.chromatic.brandGreen[700],
          disabled: globalColors.chromatic.brandGreen.a100,
          faded: globalColors.chromatic.brandGreen.a150,
          fadedHighlighted: globalColors.chromatic.brandGreen.a200,
        },
        negative: {
          default: globalColors.chromatic.brandRed[600],
          highlighted: globalColors.chromatic.brandRed[700],
          disabled: globalColors.chromatic.brandRed.a100,
          faded: globalColors.chromatic.brandRed.a150,
          fadedHighlighted: globalColors.chromatic.brandRed.a200,
        },
        notice: {
          default: globalColors.chromatic.brandMarigold[600],
          highlighted: globalColors.chromatic.brandMarigold[700],
          disabled: globalColors.chromatic.brandMarigold.a100,
          faded: globalColors.chromatic.brandMarigold.a150,
          fadedHighlighted: globalColors.chromatic.brandMarigold.a200,
        },
        information: {
          default: globalColors.chromatic.brandBlueSapphire[400],
          highlighted: globalColors.chromatic.brandBlueSapphire[300],
          disabled: globalColors.chromatic.brandBlueSapphire.a100,
          faded: globalColors.chromatic.brandBlueSapphire.a150,
          fadedHighlighted: globalColors.chromatic.brandBlueSapphire.a200,
        },
        neutral: {
          default: globalColors.neutral.white[500],
          highlighted: globalColors.neutral.whiteSolid[450],
          disabledSolid: globalColors.neutral.whiteSolid[100],
          disabled: globalColors.neutral.white[50],
          faded: globalColors.neutral.blueGrayDark.a518,
          fadedHighlighted: globalColors.neutral.blueGrayDark.a524,
        },
        gray: {
          default: globalColors.neutral.blueGrayDark.a512,
          highlighted: globalColors.neutral.blueGrayDark.a532,
          disabled: globalColors.neutral.blueGrayDark.a509,
          faded: globalColors.neutral.blueGrayDark.a509,
          fadedHighlighted: globalColors.neutral.blueGrayDark.a518,
          ghost: globalColors.neutral.blueGrayDark.a1388,
        },
        primary: {
          default: globalColors.chromatic.klearnow[300],
          highlighted: globalColors.chromatic.klearnow[400],
          disabled: globalColors.chromatic.klearnow.a150,
          faded: globalColors.chromatic.klearnow.a150,
          fadedHighlighted: globalColors.chromatic.klearnow.a200,
        },
        staticBlack: {
          default: globalColors.neutral.black[500],
          highlighted: globalColors.neutral.black[500],
          disabled: globalColors.neutral.black[200],
          faded: globalColors.neutral.black[50],
          fadedHighlighted: globalColors.neutral.black[100],
          ghost: globalColors.neutral.black[1],
        },
        staticWhite: {
          default: globalColors.neutral.white[500],
          highlighted: globalColors.neutral.white[400],
          disabled: globalColors.neutral.white[50],
          faded: globalColors.neutral.white[50],
          fadedHighlighted: globalColors.neutral.white[100],
          ghost: globalColors.neutral.white[1],
        },
      },
      border: {
        positive: {
          default: globalColors.chromatic.brandGreen[600],
          highlighted: globalColors.chromatic.brandGreen[700],
          disabled: globalColors.chromatic.brandGreen.a100,
          faded: globalColors.chromatic.brandGreen.a100,
        },
        negative: {
          default: globalColors.chromatic.brandRed[600],
          highlighted: globalColors.chromatic.brandRed[700],
          disabled: globalColors.chromatic.brandRed.a100,
          faded: globalColors.chromatic.brandRed.a100,
        },
        notice: {
          default: globalColors.chromatic.brandMarigold[600],
          highlighted: globalColors.chromatic.brandMarigold[700],
          disabled: globalColors.chromatic.brandMarigold.a100,
          faded: globalColors.chromatic.brandMarigold.a100,
        },
        information: {
          default: globalColors.chromatic.brandBlueSapphire[600],
          highlighted: globalColors.chromatic.brandBlueSapphire[700],
          disabled: globalColors.chromatic.brandBlueSapphire.a100,
          faded: globalColors.chromatic.brandBlueSapphire.a100,
        },
        neutral: {
          default: globalColors.neutral.white[500],
          highlighted: globalColors.neutral.white[450],
          disabled: globalColors.neutral.blueGrayDark[800],
          faded: globalColors.neutral.blueGrayDark.a518,
        },
        gray: {
          default: globalColors.neutral.blueGrayDark[800],
          highlighted: globalColors.neutral.blueGrayDark[700],
          disabled: globalColors.neutral.blueGrayDark[1000],
          faded: globalColors.neutral.blueGrayDark.a518,
        },
        primary: {
          default: globalColors.chromatic.klearnow[300],
          highlighted: globalColors.chromatic.klearnow[600],
          disabled: globalColors.chromatic.klearnow.a200,
          faded: globalColors.chromatic.klearnow.a150,
        },
        staticWhite: {
          default: globalColors.neutral.white[500],
          highlighted: globalColors.neutral.white[400],
          disabled: globalColors.neutral.white[100],
          faded: globalColors.neutral.white[50],
          fadedHighlighted: globalColors.neutral.white[100],
        },
        staticBlack: {
          default: globalColors.neutral.black[500],
          highlighted: globalColors.neutral.black[500],
          disabled: globalColors.neutral.black[100],
          faded: globalColors.neutral.black[100],
          fadedHighlighted: globalColors.neutral.black[50],
        },
      },
      text: {
        positive: {
          normal: globalColors.chromatic.brandGreen[400],
          subtle: globalColors.chromatic.brandGreen[500],
          muted: globalColors.chromatic.brandGreen[700],
          disabled: globalColors.chromatic.brandGreen.a200,
        },
        negative: {
          normal: globalColors.chromatic.brandRed[400],
          subtle: globalColors.chromatic.brandRed[500],
          muted: globalColors.chromatic.brandRed[700],
          disabled: globalColors.chromatic.brandRed.a200,
        },
        notice: {
          normal: globalColors.chromatic.brandMarigold[400],
          subtle: globalColors.chromatic.brandMarigold[500],
          muted: globalColors.chromatic.brandMarigold[700],
          disabled: globalColors.chromatic.brandMarigold.a200,
        },
        information: {
          normal: globalColors.chromatic.brandBlueSapphire[400],
          subtle: globalColors.chromatic.brandBlueSapphire[500],
          muted: globalColors.chromatic.brandBlueSapphire[700],
          disabled: globalColors.chromatic.brandBlueSapphire.a200,
        },
        neutral: {
          normal: globalColors.neutral.blueGrayDark[0],
          subtle: globalColors.neutral.blueGrayDark[300],
          muted: globalColors.neutral.blueGrayDark[500],
          disabled: globalColors.neutral.blueGrayDark.a532,
        },
        gray: {
          normal: globalColors.neutral.blueGrayDark[0],
          subtle: globalColors.neutral.blueGrayDark[300],
          muted: globalColors.neutral.blueGrayDark[500],
          disabled: globalColors.neutral.blueGrayDark.a532,
        },
        primary: {
          normal: globalColors.chromatic.klearnow[200],
          subtle: globalColors.chromatic.klearnow[400],
          muted: globalColors.chromatic.klearnow[600],
          disabled: globalColors.chromatic.klearnow.a400,
        },
        onPrimary: {
          normal: globalColors.neutral.white[500],
          subtle: globalColors.neutral.white[400],
          muted: globalColors.neutral.white[300],
          disabled: globalColors.neutral.white[100],
        },
        onNeutral: {
          normal: globalColors.neutral.black[500],
          subtle: globalColors.neutral.black[400],
          muted: globalColors.neutral.black[300],
          disabled: globalColors.neutral.black[100],
        },
        staticWhite: {
          normal: globalColors.neutral.white[500],
          subtle: globalColors.neutral.white[400],
          muted: globalColors.neutral.white[300],
          disabled: globalColors.neutral.white[100],
        },
        staticBlack: {
          normal: globalColors.neutral.black[500],
          subtle: globalColors.neutral.black[400],
          muted: globalColors.neutral.black[300],
          disabled: globalColors.neutral.black[100],
        },
      },
      icon: {
        positive: {
          normal: globalColors.chromatic.brandGreen[400],
          subtle: globalColors.chromatic.brandGreen[500],
          muted: globalColors.chromatic.brandGreen[700],
          disabled: globalColors.chromatic.brandGreen.a200,
        },
        negative: {
          normal: globalColors.chromatic.brandRed[400],
          subtle: globalColors.chromatic.brandRed[500],
          muted: globalColors.chromatic.brandRed[700],
          disabled: globalColors.chromatic.brandRed.a200,
        },
        notice: {
          normal: globalColors.chromatic.brandMarigold[400],
          subtle: globalColors.chromatic.brandMarigold[500],
          muted: globalColors.chromatic.brandMarigold[700],
          disabled: globalColors.chromatic.brandMarigold.a200,
        },
        information: {
          normal: globalColors.chromatic.brandBlueSapphire[400],
          subtle: globalColors.chromatic.brandBlueSapphire[500],
          muted: globalColors.chromatic.brandBlueSapphire[700],
          disabled: globalColors.chromatic.brandBlueSapphire.a200,
        },
        neutral: {
          normal: globalColors.neutral.blueGrayDark[0],
          subtle: globalColors.neutral.blueGrayDark[300],
          muted: globalColors.neutral.blueGrayDark[500],
          disabled: globalColors.neutral.blueGrayDark.a532,
        },
        gray: {
          normal: globalColors.neutral.blueGrayDark[0],
          subtle: globalColors.neutral.blueGrayDark[300],
          muted: globalColors.neutral.blueGrayDark[500],
          disabled: globalColors.neutral.blueGrayDark.a532,
        },
        primary: {
          normal: globalColors.chromatic.klearnow[200],
          subtle: globalColors.chromatic.klearnow[400],
          muted: globalColors.chromatic.klearnow[600],
          disabled: globalColors.chromatic.klearnow.a400,
        },
        onPrimary: {
          normal: globalColors.neutral.white[500],
          subtle: globalColors.neutral.white[400],
          muted: globalColors.neutral.white[300],
          disabled: globalColors.neutral.white[100],
        },
        onNeutral: {
          normal: globalColors.neutral.black[500],
          subtle: globalColors.neutral.black[400],
          muted: globalColors.neutral.black[300],
          disabled: globalColors.neutral.black[100],
        },
        staticWhite: {
          normal: globalColors.neutral.white[500],
          subtle: globalColors.neutral.white[400],
          muted: globalColors.neutral.white[300],
          disabled: globalColors.neutral.white[100],
        },
        staticBlack: {
          normal: globalColors.neutral.black[500],
          subtle: globalColors.neutral.black[400],
          muted: globalColors.neutral.black[300],
          disabled: globalColors.neutral.black[100],
        },
      },
    },
    overlay: {
      background: {
        moderate: globalColors.neutral.blueGrayDark.a518,
        subtle: globalColors.neutral.black[400],
      },
    },
    popup: {
      background: {
        // @deprecated
        subtle: globalColors.neutral.blueGrayDark[1000],
        // @deprecated
        intense: globalColors.neutral.blueGrayDark[700],
        gray: {
          subtle: globalColors.neutral.blueGrayDark[1300],
          moderate: globalColors.neutral.blueGrayDark.a1188,
          intense: globalColors.neutral.black[300],
        },
        positive: {
          moderate:
            globalColors.chromatic.brandGreen.a700 ?? globalColors.chromatic.brandGreen.a400,
        },
        negative: {
          moderate: globalColors.chromatic.brandRed.a700 ?? globalColors.chromatic.brandRed.a400,
        },
        notice: {
          moderate:
            globalColors.chromatic.brandMarigold.a700 ?? globalColors.chromatic.brandMarigold.a400,
        },
        information: {
          moderate:
            globalColors.chromatic.brandBlueSapphire.a700 ??
            globalColors.chromatic.brandBlueSapphire.a400,
        },
        neutral: {
          moderate: globalColors.neutral.blueGrayDark.a888,
        },
      },
      border: {
        // @deprecated
        subtle: globalColors.neutral.blueGrayDark.a100,
        // @deprecated
        intense: globalColors.neutral.blueGrayDark.a100,
        gray: {
          subtle: globalColors.neutral.blueGrayDark.a512,
          moderate: globalColors.neutral.blueGrayDark[800],
          intense: globalColors.neutral.blueGrayDark[1000],
        },
        positive: {
          moderate: globalColors.chromatic.brandGreen[600],
        },
        negative: {
          moderate: globalColors.chromatic.brandRed[600],
        },
        notice: {
          moderate: globalColors.chromatic.brandMarigold[600],
        },
        information: {
          moderate: globalColors.chromatic.brandBlueSapphire[600],
        },
        neutral: {
          moderate: globalColors.neutral.blueGrayDark[800],
        },
      },
    },
    data: {
      background: {
        categorical: {
          blue: {
            faint: globalColors.chromatic.klearnow[800],
            subtle: globalColors.chromatic.klearnow[700],
            moderate: globalColors.chromatic.klearnow[600],
            intense: globalColors.chromatic.klearnow[500],
            strong: globalColors.chromatic.klearnow[400],
          },
          green: {
            faint: globalColors.chromatic.brandGreen[800],
            subtle: globalColors.chromatic.brandGreen[700],
            moderate: globalColors.chromatic.brandGreen[600],
            intense: globalColors.chromatic.brandGreen[500],
            strong: globalColors.chromatic.brandGreen[400],
          },
          red: {
            faint: globalColors.chromatic.brandRed[800],
            subtle: globalColors.chromatic.brandRed[700],
            moderate: globalColors.chromatic.brandRed[600],
            intense: globalColors.chromatic.brandRed[500],
            strong: globalColors.chromatic.brandRed[400],
          },
          orange: {
            faint: globalColors.chromatic.brandMarigold[800],
            subtle: globalColors.chromatic.brandMarigold[700],
            moderate: globalColors.chromatic.brandMarigold[600],
            intense: globalColors.chromatic.brandMarigold[500],
            strong: globalColors.chromatic.brandMarigold[400],
          },
          skyBlue: {
            faint: globalColors.chromatic.brandBlueSapphire[800],
            subtle: globalColors.chromatic.brandBlueSapphire[700],
            moderate: globalColors.chromatic.brandBlueSapphire[600],
            intense: globalColors.chromatic.brandBlueSapphire[500],
            strong: globalColors.chromatic.brandBlueSapphire[400],
          },
          purple: {
            faint: globalColors.chromatic.brandPurple[800],
            subtle: globalColors.chromatic.brandPurple[700],
            moderate: globalColors.chromatic.brandPurple[600],
            intense: globalColors.chromatic.brandPurple[500],
            strong: globalColors.chromatic.brandPurple[400],
          },
          pink: {
            faint: globalColors.chromatic.brandRose[800],
            subtle: globalColors.chromatic.brandRose[700],
            moderate: globalColors.chromatic.brandRose[600],
            intense: globalColors.chromatic.brandRose[500],
            strong: globalColors.chromatic.brandRose[400],
          },
          gold: {
            faint: globalColors.chromatic.brandGold[700],
            subtle: globalColors.chromatic.brandGold[600],
            moderate: globalColors.chromatic.brandGold[500],
            intense: globalColors.chromatic.brandGold[400],
            strong: globalColors.chromatic.brandGold[300],
          },
          gray: {
            faint: globalColors.neutral.blueGrayDark[1200],
            subtle: globalColors.neutral.blueGrayDark[1000],
            moderate: globalColors.neutral.blueGrayDark[900],
            intense: globalColors.neutral.blueGrayDark[300],
            strong: globalColors.neutral.blueGrayDark[600],
          },
        },
        sequential: {
          blue: {
            50: globalColors.chromatic.klearnow[1000],
            100: globalColors.chromatic.klearnow[900],
            200: globalColors.chromatic.klearnow[800],
            300: globalColors.chromatic.klearnow[700],
            400: globalColors.chromatic.klearnow[600],
            500: globalColors.chromatic.klearnow[500],
            600: globalColors.chromatic.klearnow[400],
            700: globalColors.chromatic.klearnow[300],
            800: globalColors.chromatic.klearnow[200],
            900: globalColors.chromatic.klearnow[100],
            1000: globalColors.chromatic.klearnow[50],
          },
          green: {
            50: globalColors.chromatic.brandGreen[1000],
            100: globalColors.chromatic.brandGreen[900],
            200: globalColors.chromatic.brandGreen[800],
            300: globalColors.chromatic.brandGreen[700],
            400: globalColors.chromatic.brandGreen[600],
            500: globalColors.chromatic.brandGreen[500],
            600: globalColors.chromatic.brandGreen[400],
            700: globalColors.chromatic.brandGreen[300],
            800: globalColors.chromatic.brandGreen[200],
            900: globalColors.chromatic.brandGreen[100],
            1000: globalColors.chromatic.brandGreen[50],
          },
          red: {
            50: globalColors.chromatic.brandRed[1000],
            100: globalColors.chromatic.brandRed[900],
            200: globalColors.chromatic.brandRed[800],
            300: globalColors.chromatic.brandRed[700],
            400: globalColors.chromatic.brandRed[600],
            500: globalColors.chromatic.brandRed[500],
            600: globalColors.chromatic.brandRed[400],
            700: globalColors.chromatic.brandRed[300],
            800: globalColors.chromatic.brandRed[200],
            900: globalColors.chromatic.brandRed[100],
            1000: globalColors.chromatic.brandRed[50],
          },
          orange: {
            50: globalColors.chromatic.brandMarigold[1000],
            100: globalColors.chromatic.brandMarigold[900],
            200: globalColors.chromatic.brandMarigold[800],
            300: globalColors.chromatic.brandMarigold[700],
            400: globalColors.chromatic.brandMarigold[600],
            500: globalColors.chromatic.brandMarigold[500],
            600: globalColors.chromatic.brandMarigold[400],
            700: globalColors.chromatic.brandMarigold[300],
            800: globalColors.chromatic.brandMarigold[200],
            900: globalColors.chromatic.brandMarigold[100],
            1000: globalColors.chromatic.brandMarigold[50],
          },
          skyBlue: {
            50: globalColors.chromatic.brandBlueSapphire[1000],
            100: globalColors.chromatic.brandBlueSapphire[900],
            200: globalColors.chromatic.brandBlueSapphire[800],
            300: globalColors.chromatic.brandBlueSapphire[700],
            400: globalColors.chromatic.brandBlueSapphire[600],
            500: globalColors.chromatic.brandBlueSapphire[500],
            600: globalColors.chromatic.brandBlueSapphire[400],
            700: globalColors.chromatic.brandBlueSapphire[300],
            800: globalColors.chromatic.brandBlueSapphire[200],
            900: globalColors.chromatic.brandBlueSapphire[100],
            1000: globalColors.chromatic.brandBlueSapphire[50],
          },
          purple: {
            50: globalColors.chromatic.brandPurple[1000],
            100: globalColors.chromatic.brandPurple[900],
            200: globalColors.chromatic.brandPurple[800],
            300: globalColors.chromatic.brandPurple[700],
            400: globalColors.chromatic.brandPurple[600],
            500: globalColors.chromatic.brandPurple[500],
            600: globalColors.chromatic.brandPurple[400],
            700: globalColors.chromatic.brandPurple[300],
            800: globalColors.chromatic.brandPurple[200],
            900: globalColors.chromatic.brandPurple[100],
            1000: globalColors.chromatic.brandPurple[50],
          },
          pink: {
            50: globalColors.chromatic.brandRose[1000],
            100: globalColors.chromatic.brandRose[900],
            200: globalColors.chromatic.brandRose[800],
            300: globalColors.chromatic.brandRose[700],
            400: globalColors.chromatic.brandRose[600],
            500: globalColors.chromatic.brandRose[500],
            600: globalColors.chromatic.brandRose[400],
            700: globalColors.chromatic.brandRose[300],
            800: globalColors.chromatic.brandRose[200],
            900: globalColors.chromatic.brandRose[100],
            1000: globalColors.chromatic.brandRose[50],
          },
          gold: {
            50: globalColors.chromatic.brandGold[1000],
            100: globalColors.chromatic.brandGold[900],
            200: globalColors.chromatic.brandGold[800],
            300: globalColors.chromatic.brandGold[700],
            400: globalColors.chromatic.brandGold[600],
            500: globalColors.chromatic.brandGold[500],
            600: globalColors.chromatic.brandGold[400],
            700: globalColors.chromatic.brandGold[300],
            800: globalColors.chromatic.brandGold[200],
            900: globalColors.chromatic.brandGold[100],
            1000: globalColors.chromatic.brandGold[50],
          },
          gray: {
            0: globalColors.neutral.blueGrayDark[1300],
            50: globalColors.neutral.blueGrayDark[1200],
            100: globalColors.neutral.blueGrayDark[1100],
            200: globalColors.neutral.blueGrayDark[1000],
            300: globalColors.neutral.blueGrayDark[900],
            400: globalColors.neutral.blueGrayDark[800],
            500: globalColors.neutral.blueGrayDark[800],
            600: globalColors.neutral.blueGrayDark[700],
            700: globalColors.neutral.blueGrayDark[600],
            800: globalColors.neutral.blueGrayDark[500],
            900: globalColors.neutral.blueGrayDark[400],
            1000: globalColors.neutral.blueGrayDark[300],
          },
        },
      },
    },
    transparent: `hsla(210, 6%, 13%, ${opacity[0]})`,
  },
};

const klear360NeutralTheme: ThemeTokens = {
  name: 'klear360NeutralTheme',
  border,
  backdropBlur,
  breakpoints,
  colors,
  motion,
  spacing,
  elevation,
  typography,
};

export default klear360NeutralTheme;
