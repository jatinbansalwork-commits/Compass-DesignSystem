import styled from 'styled-components';
import { create } from 'storybook/theming';
import { lightThemeConfig } from './storybook-theme';
import { CompassDocsContainer } from './CompassDocsContainer';
import { getColorSchemeFromGlobals, getResolvedColorScheme } from './storybookColorScheme';
import { Box, CompassProvider } from '../../src/components';
import { compassTheme } from '../../src/tokens/theme';
import ErrorBoundary from './ErrorBoundary';
import { INTERNAL_STORY_ADDON_PARAM } from './constants';
import React from 'react';
import { MINIMAL_VIEWPORTS } from 'storybook/viewport';
import './global.css';
import { domMax, LazyMotion } from 'framer-motion';

const theme = create(lightThemeConfig);

const LEGACY_STORYBOOK_URL =
  'https://kdesigns.dev.klearnow.com/storybook/?path=/docs/introduction--docs';

const redirectIfLegacyVersion = (version: string | undefined): void => {
  if (version === '10' && window.top) {
    window.top.location.href = LEGACY_STORYBOOK_URL;
  }
};

export const parameters = {
  // disable snapshot by default and then enable it only for kitchen sink
  chromatic: {
    disableSnapshot: true,
    pauseAnimationAtEnd: true,
  },
  previewTabs: {
    'storybook/docs/panel': { index: 0 },
    canvas: { title: 'Stories', index: 1 },
  },
  backgrounds: {
    grid: {
      disable: true,
    },
    disabled: true,
  },
  viewport: {
    options: {
      ...MINIMAL_VIEWPORTS,
      iPhone6: {
        name: 'iPhone 6',
        styles: {
          height: '667px',
          width: '375px',
        },
        type: 'mobile',
      },
    },
  },
  // on development setting it to undefined so that on 'live reload' it won't switch
  // to docs panel while developing the component
  viewMode: process.env.NODE_ENV === 'development' ? undefined : 'docs',
  options: {
    storySort: {
      method: 'alphabetical',
      order: [
        'Guides',
        ['Klear for AI Agents', 'Installation', '*'],
        'Tokens',
        [
          'Colors',
          'Typography',
          'Elevation',
          'Border',
          'Spacing',
          'Breakpoints',
          'Motion',
          'CSS Variables',
        ],
        'Utils',
        [
          'makeBorderSize',
          'makeMotionTime',
          'makeSize',
          'makeSpace',
          'makeTypographySize',
          'useTheme',
        ],
        'Components',
        [
          '*',
          [
            'Table',
            ['Guide', 'Examples', 'Experience', 'Features', 'Parts', '*'],
          ],
          'Interaction Tests',
          'KitchenSink',
        ],
        'Patterns',
        ['ListView'],
        'Motion',
        [
          'Introduction to Motion',
          'Fade',
          'Move',
          'Slide',
          '*',
          'AnimateInteractions',
          'Stagger',
          'Recipes',
        ],
      ],
    },
  },
  docs: {
    container: ({ children, context, ...rest }) => (
      <CompassDocsContainer
        context={context}
        redirectIfLegacyVersion={redirectIfLegacyVersion}
        {...rest}
      >
        {children}
      </CompassDocsContainer>
    ),
    theme,
    components: {
      summary: styled.summary`
        font-family: ${theme.fontBase};
        color: ${theme.textColor};
        font-size: 14px;
        cursor: pointer;
      `,
      a: styled.a`
        color: ${theme.colorPrimary};
        font-weight: 500;
      `,
      // Setting font-weight back to 600 in headings since storybook tries to override it
      ...(['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const).reduce<Record<`h${number}`, string>>(
        (headingOverride, headingLevel) => {
          headingOverride[headingLevel] = styled[headingLevel]`
            & a {
              font-weight: 600;
            }
          `;

          return headingOverride;
        },
        {},
      ),
    },
  },
};

const hasFullPageExampleStories = (context) =>
  context.kind.includes('/Dropdown/With Select') ||
  context.kind.includes('/Dropdown/With Button') ||
  context.kind.includes('/Dropdown/With AutoComplete') ||
  context.kind.includes('/Carousel') ||
  context.kind.includes('/TopNav') ||
  context.kind.includes('/Examples') ||
  context.kind.includes('/SideNav');

const StoryCanvas = ({
  context,
  children,
}: {
  context: { viewMode: string; kind: string };
  children: React.ReactNode;
}): React.ReactElement => {
  const isFullPage = hasFullPageExampleStories(context);
  return (
    <Box
      width="100%"
      height={context.viewMode === 'story' ? '100vh' : '100%'}
      overflow="auto"
      padding={isFullPage ? 'spacing.0' : 'spacing.8'}
      backgroundColor="surface.background.gray.intense"
      borderRadius={context.viewMode === 'story' ? 'none' : 'medium'}
    >
      {children}
    </Box>
  );
};

export const decorators = [
  (Story, context) => {
    redirectIfLegacyVersion(context.globals.version);

    return (
      <ErrorBoundary>
        {/* strict in LazyMotion keeps Compass on lightweight `m` instead of heavy `motion` */}
        <LazyMotion strict features={domMax}>
          <CompassProvider
            key={`story-${getResolvedColorScheme(context.globals)}`}
            themeTokens={compassTheme}
            colorScheme={getColorSchemeFromGlobals(context.globals)}
          >
            <StoryCanvas context={context}>
              <Story />
            </StoryCanvas>
          </CompassProvider>
        </LazyMotion>
      </ErrorBoundary>
    );
  },
];

export const globalTypes = {
  version: {
    name: 'Compass Documentation Version',
    description: 'Version of the Compass',
    defaultValue: '1.1',
    toolbar: {
      icon: 'time',
      title: ' v1.1 - Compass',
      // Array of plain string values or MenuItem shape (see below)
      items: [
        { value: '10', title: ' v10 - Old' },
        { value: '1.1', title: ' v1.1 - Compass', default: true },
      ],
      dynamicTitle: true,
      // Property that specifies if the name of the item will be displayed
      showName: false,
    },
  },
  colorScheme: {
    name: 'Color Scheme',
    description: 'Color Scheme for Compass',
    defaultValue: 'light',
    toolbar: {
      icon: 'eye',
      // Array of plain string values or MenuItem shape (see below)
      items: [
        { value: 'light', title: 'Light' },
        { value: 'dark', title: 'Dark' },
        { value: 'system', title: 'System' },
      ],
      // Property that specifies if the name of the item will be displayed
      showName: true,
    },
  },
};

export const initialGlobals = {
  [INTERNAL_STORY_ADDON_PARAM]: false,
};
