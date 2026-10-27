import dedent from 'dedent';
import { getIndexTSX, getReactScriptsJSDependencies } from './baseCode';

const getRouterIndexTSX = (options: {
  colorScheme: string;
  brandColor?: string;
  routerImport: string;
  routerTag: string;
}): string => {
  const base = getIndexTSX({
    themeTokenName: 'compassTheme',
    brandColor: options.brandColor,
    colorScheme: options.colorScheme,
  });

  return base
    .replace(
      'import App from "./App";',
      dedent`
        import App from "./App";
        ${options.routerImport}
      `,
    )
    .replace(
      '<Box \n        backgroundColor="surface.background.gray.subtle"',
      dedent`
        <${options.routerTag}>
        <Box 
        backgroundColor="surface.background.gray.subtle"
      `,
    )
    .replace(
      '      </Box>\n    </LazyMotion>',
      `      </Box>\n    </${options.routerTag}>\n    </LazyMotion>`,
    );
};

export type RoutingRecipeId = 'link-v5' | 'link-v6' | 'tab-v6';

export const getRoutingRecipeSandpackSetup = ({
  recipeId,
  colorScheme,
  brandColor,
}: {
  recipeId: RoutingRecipeId;
  colorScheme: string;
  brandColor?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}): any => {
  const compassRouterLinkV6 = dedent`
    import React from 'react';
    import {
      useHref,
      useLinkClickHandler,
      type LinkProps as RouterLinkProps,
    } from 'react-router-dom';
    import { Link, type LinkProps } from '@klearnow/compass/components';

    type CompassRouterLinkProps = LinkProps &
      Pick<RouterLinkProps, 'to' | 'replace' | 'state' | 'target'>;

    export const CompassRouterLink = React.forwardRef<
      HTMLAnchorElement,
      CompassRouterLinkProps
    >(function CompassRouterLink(
      { onClick, replace = false, state, target, to, ...rest },
      ref,
    ) {
      const href = useHref(to);
      const handleClick = useLinkClickHandler(to, { replace, state, target });

      return (
        <Link
          {...rest}
          href={href}
          ref={ref}
          target={target}
          onClick={(event) => {
            onClick?.(event);
            if (!event.defaultPrevented) {
              handleClick(event);
            }
          }}
        />
      );
    });
  `;

  const linkAppV6 = dedent`
    import React from 'react';
    import { Route, Routes } from 'react-router-dom';
    import { Box, Heading } from '@klearnow/compass/components';
    import { CompassRouterLink } from './CompassRouterLink';

    const Home = (): React.ReactElement => <Heading size="medium">Home</Heading>;
    const About = (): React.ReactElement => <Heading size="medium">About</Heading>;

    export default function App(): React.ReactElement {
      return (
        <Box display="flex" flexDirection="column" gap="spacing.2">
          <CompassRouterLink color="primary" to="/">
            Home
          </CompassRouterLink>
          <CompassRouterLink color="primary" to="/about">
            About
          </CompassRouterLink>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </Box>
      );
    }
  `;

  const compassRouterLinkV5 = dedent`
    import React from 'react';
    import { useHistory, type LinkProps as RouterLinkProps } from 'react-router-dom';
    import { Link, type LinkProps } from '@klearnow/compass/components';

    type CompassRouterLinkProps = LinkProps & Pick<RouterLinkProps, 'to'>;

    export const CompassRouterLink = ({
      to,
      onClick,
      ...rest
    }: CompassRouterLinkProps): React.ReactElement => {
      const history = useHistory();
      const href = typeof to === 'string' ? to : history.createHref(to);

      return (
        <Link
          {...rest}
          href={href}
          onClick={(event) => {
            onClick?.(event);
            event.preventDefault();
            history.push(to);
          }}
        />
      );
    };
  `;

  const linkAppV5 = dedent`
    import React from 'react';
    import { Route, Switch } from 'react-router-dom';
    import { Box, Heading } from '@klearnow/compass/components';
    import { CompassRouterLink } from './CompassRouterLink';

    const Home = (): React.ReactElement => <Heading size="medium">Home</Heading>;
    const About = (): React.ReactElement => <Heading size="medium">About</Heading>;

    export default function App(): React.ReactElement {
      return (
        <Box display="flex" flexDirection="column" gap="spacing.2">
          <CompassRouterLink color="primary" to="/">
            Home
          </CompassRouterLink>
          <CompassRouterLink color="primary" to="/about">
            About
          </CompassRouterLink>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/about" component={About} />
          </Switch>
        </Box>
      );
    }
  `;

  const tabItemLinkV6 = dedent`
    import React from 'react';
    import {
      useHref,
      useLinkClickHandler,
      type LinkProps as RouterLinkProps,
    } from 'react-router-dom';
    import { TabItem, type TabItemProps } from '@klearnow/compass/components';

    type TabItemLinkProps = TabItemProps &
      Pick<RouterLinkProps, 'to' | 'replace' | 'state' | 'target'>;

    export const TabItemLink = React.forwardRef<HTMLAnchorElement, TabItemLinkProps>(
      function TabItemLink({ onClick, replace = false, state, target, to, ...rest }, ref) {
        const href = useHref(to);
        const handleClick = useLinkClickHandler(to, { replace, state, target });

        return (
          <TabItem
            {...rest}
            href={href}
            ref={ref}
            target={target}
            onClick={(event) => {
              onClick?.(event);
              if (!event.defaultPrevented) {
                handleClick(event);
              }
            }}
          />
        );
      },
    );
  `;

  const tabAppV6 = dedent`
    import React from 'react';
    import { Route, Routes, useLocation } from 'react-router-dom';
    import { Box, Heading, TabList, Tabs } from '@klearnow/compass/components';
    import { TabItemLink } from './TabItemLink';

    const Home = (): React.ReactElement => <Heading size="medium">Home</Heading>;
    const Settings = (): React.ReactElement => <Heading size="medium">Settings</Heading>;

    export default function App(): React.ReactElement {
      const { pathname } = useLocation();

      return (
        <Box display="flex" flexDirection="column" gap="spacing.4">
          <Tabs value={pathname} variant="bordered">
            <TabList>
              <TabItemLink value="/" to="/">
                Home
              </TabItemLink>
              <TabItemLink value="/settings" to="/settings">
                Settings
              </TabItemLink>
            </TabList>
          </Tabs>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Box>
      );
    }
  `;

  const recipes: Record<
    RoutingRecipeId,
    {
      activeFile: string;
      files: Record<string, string>;
      routerImport: string;
      routerTag: string;
      dependencies: Record<string, string>;
    }
  > = {
    'link-v6': {
      activeFile: '/CompassRouterLink.tsx',
      files: {
        '/CompassRouterLink.tsx': compassRouterLinkV6,
        '/App.tsx': linkAppV6,
      },
      routerImport: `import { BrowserRouter } from 'react-router-dom';`,
      routerTag: 'BrowserRouter',
      dependencies: { 'react-router-dom': '^6.28.0' },
    },
    'link-v5': {
      activeFile: '/CompassRouterLink.tsx',
      files: {
        '/CompassRouterLink.tsx': compassRouterLinkV5,
        '/App.tsx': linkAppV5,
      },
      routerImport: `import { BrowserRouter } from 'react-router-dom';`,
      routerTag: 'BrowserRouter',
      dependencies: { 'react-router-dom': '5.3.4' },
    },
    'tab-v6': {
      activeFile: '/TabItemLink.tsx',
      files: {
        '/TabItemLink.tsx': tabItemLinkV6,
        '/App.tsx': tabAppV6,
      },
      routerImport: `import { BrowserRouter } from 'react-router-dom';`,
      routerTag: 'BrowserRouter',
      dependencies: { 'react-router-dom': '^6.28.0' },
    },
  };

  const recipe = recipes[recipeId];
  const baseDeps = getReactScriptsJSDependencies();

  return {
    template: 'react-ts',
    files: {
      '/index.tsx': getRouterIndexTSX({
        colorScheme,
        brandColor,
        routerImport: recipe.routerImport,
        routerTag: recipe.routerTag,
      }),
      ...recipe.files,
    },
    customSetup: {
      dependencies: {
        ...baseDeps.dependencies,
        ...recipe.dependencies,
      },
    },
    options: {
      activeFile: recipe.activeFile,
    },
  };
};
