import React, { useEffect, useState } from 'react';
import { DocsContainer } from '@storybook/addon-docs/blocks';
import type { DocsContainerProps } from '@storybook/addon-docs/blocks';
import { create } from 'storybook/theming';
import { GLOBALS_UPDATED } from 'storybook/internal/core-events';
import { domMax, LazyMotion } from 'framer-motion';
import { Box, Klear360Provider } from '../../src/components';
import { klear360Theme } from '../../src/tokens/theme';
import { getStorybookTheme } from './storybook-theme';
import { getColorSchemeFromGlobals, getResolvedColorScheme } from './storybookColorScheme';

type Klear360DocsContainerProps = DocsContainerProps & {
  redirectIfLegacyVersion: (version: string | undefined) => void;
};

const readGlobalsFromStore = (context: DocsContainerProps['context']): Record<string, unknown> => {
  const store = context.store as {
    userGlobals?: { get?: () => Record<string, unknown>; globals?: Record<string, unknown> };
  };

  return store.userGlobals?.get?.() ?? store.userGlobals?.globals ?? {};
};

export const Klear360DocsContainer = ({
  children,
  context,
  redirectIfLegacyVersion,
  ...rest
}: Klear360DocsContainerProps): React.ReactElement => {
  const [globals, setGlobals] = useState(() => readGlobalsFromStore(context));

  useEffect(() => {
    setGlobals(readGlobalsFromStore(context));

    const onGlobalsUpdated = (changed: { globals?: Record<string, unknown> }) => {
      if (changed.globals) {
        setGlobals(changed.globals);
      }
    };

    context.channel.on(GLOBALS_UPDATED, onGlobalsUpdated);
    return () => context.channel.off(GLOBALS_UPDATED, onGlobalsUpdated);
  }, [context]);

  const colorScheme = getColorSchemeFromGlobals(globals);
  const resolvedScheme = getResolvedColorScheme(globals);
  const docsTheme = create(getStorybookTheme(colorScheme));

  redirectIfLegacyVersion(globals.version as string | undefined);

  return (
    <DocsContainer context={context} theme={docsTheme} {...rest}>
      <LazyMotion strict features={domMax}>
        <Klear360Provider
          key={`docs-${resolvedScheme}`}
          themeTokens={klear360Theme}
          colorScheme={colorScheme}
        >
          <Box
            minHeight="100vh"
            width="100%"
            backgroundColor="surface.background.gray.intense"
            padding="spacing.8"
          >
            {children}
          </Box>
        </Klear360Provider>
      </LazyMotion>
    </DocsContainer>
  );
};
