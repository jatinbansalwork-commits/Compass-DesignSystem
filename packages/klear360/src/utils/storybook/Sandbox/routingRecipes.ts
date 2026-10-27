import dedent from 'dedent';
import { getIndexTSX, getReactScriptsJSDependencies } from './baseCode';

const getRouterIndexTSX = (options: {
  colorScheme: string;
  brandColor?: string;
  routerImport: string;
  routerTag: string;
}): string => {
  const base = getIndexTSX({
    themeTokenName: 'klear360Theme',
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
  const klear360RouterLinkV6 = dedent`
    import React from 'react';
    import {
      useHref,
      useLinkClickHandler,
      type LinkProps as RouterLinkProps,
    } from 'react-router-dom';
    import { Link, type LinkProps } from '@klearnow/klear360/components';

    type Klear360RouterLinkProps = LinkProps &
      Pick<RouterLinkProps, 'to' | 'replace' | 'state' | 'target'>;

    export const Klear360RouterLink = React.forwardRef<
      HTMLAnchorElement,
      Klear360RouterLinkProps
    >(function Klear360RouterLink(
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
    import { Box, Heading } from '@klearnow/klear360/components';
    import { Klear360RouterLink } from './Klear360RouterLink';

    const Home = (): React.ReactElement => <Heading size="medium">Home</Heading>;
    const About = (): React.ReactElement => <Heading size="medium">About</Heading>;

    export default function App(): React.ReactElement {
      return (
        <Box display="flex" flexDirection="column" gap="spacing.2">
          <Klear360RouterLink color="primary" to="/">
            Home
          </Klear360RouterLink>
          <Klear360RouterLink color="primary" to="/about">
            About
          </Klear360RouterLink>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </Box>
      );
    }
  `;

  const klear360RouterLinkV5 = dedent`
    import React from 'react';
    import { useHistory, type LinkProps as RouterLinkProps } from 'react-router-dom';
    import { Link, type LinkProps } from '@klearnow/klear360/components';

    type Klear360RouterLinkProps = LinkProps & Pick<RouterLinkProps, 'to'>;

    export const Klear360RouterLink = ({
      to,
      onClick,
      ...rest
    }: Klear360RouterLinkProps): React.ReactElement => {
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
    import { Box, Heading } from '@klearnow/klear360/components';
    import { Klear360RouterLink } from './Klear360RouterLink';

    const Home = (): React.ReactElement => <Heading size="medium">Home</Heading>;
    const About = (): React.ReactElement => <Heading size="medium">About</Heading>;

    export default function App(): React.ReactElement {
      return (
        <Box display="flex" flexDirection="column" gap="spacing.2">
          <Klear360RouterLink color="primary" to="/">
            Home
          </Klear360RouterLink>
          <Klear360RouterLink color="primary" to="/about">
            About
          </Klear360RouterLink>
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
    import { TabItem, type TabItemProps } from '@klearnow/klear360/components';

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
    import { Box, Heading, TabList, Tabs } from '@klearnow/klear360/components';
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
      activeFile: '/Klear360RouterLink.tsx',
      files: {
        '/Klear360RouterLink.tsx': klear360RouterLinkV6,
        '/App.tsx': linkAppV6,
      },
      routerImport: `import { BrowserRouter } from 'react-router-dom';`,
      routerTag: 'BrowserRouter',
      dependencies: { 'react-router-dom': '^6.28.0' },
    },
    'link-v5': {
      activeFile: '/Klear360RouterLink.tsx',
      files: {
        '/Klear360RouterLink.tsx': klear360RouterLinkV5,
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
