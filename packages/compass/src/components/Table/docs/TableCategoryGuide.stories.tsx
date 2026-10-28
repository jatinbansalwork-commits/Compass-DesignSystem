import React from 'react';
import type { Meta, StoryFn } from '@storybook/react-vite';
import { Box } from '~components/Box';
import { Code, Heading, Text } from '~components/Typography';

const meta: Meta = {
  title: 'Components/Table/Guide',
  tags: ['autodocs'],
  parameters: {
    viewMode: 'docs',
    chromatic: { disableSnapshot: true },
    docs: {
      description: {
        component:
          'How Table stories are organized in Storybook — start here if you are new to the component or looking for a specific pattern.',
      },
    },
  },
};

const Section = ({
  title,
  paths,
}: {
  title: string;
  paths: { label: string; path: string; hint?: string }[];
}): React.ReactElement => (
  <Box paddingBottom="spacing.4">
    <Heading size="small">{title}</Heading>
    <Box
      display="flex"
      flexDirection="column"
      gap="spacing.1"
      paddingLeft="spacing.5"
      marginTop="spacing.2"
    >
      {paths.map(({ label, path, hint }) => (
        <Box key={path}>
          <Text as="span" size="medium">
            <Text as="span" weight="semibold">
              {label}
            </Text>
            {' — '}
            <Text as="span" color="surface.text.gray.muted">
              {path}
            </Text>
            {hint ? (
              <>
                {' '}
                <Text as="span" color="surface.text.gray.muted">
                  ({hint})
                </Text>
              </>
            ) : null}
          </Text>
        </Box>
      ))}
    </Box>
  </Box>
);

export const HowTableStoriesAreOrganized: StoryFn = () => (
  <Box
    backgroundColor="surface.background.gray.intense"
    padding="spacing.6"
    maxWidth="720px"
    overflow="auto"
  >
    <Heading marginBottom="spacing.2">Table in Storybook</Heading>
    <Text color="surface.text.gray.muted" marginBottom="spacing.6">
      Compass <Text as="span" weight="semibold">Table</Text> is composable: you build headers, body,
      and footer from small parts. Optional{' '}
      <Text as="span" weight="semibold">
        Experience
      </Text>{' '}
      add-ons (CompassDataTable) add Prime-style toolbar UX without changing your filter/sort rules.
    </Text>

    <Section
      title="1. Start here"
      paths={[
        {
          label: 'Guide',
          path: 'Components → Table → Guide',
          hint: 'this page',
        },
        {
          label: 'Overview / props',
          path: 'Components → Table',
          hint: 'controls playground for Table props',
        },
        {
          label: 'Common recipes',
          path: 'Components → Table → Examples',
          hint: 'sort, selection, sticky, loading, editable cells',
        },
      ]}
    />

    <Section
      title="2. Parts (API playgrounds)"
      paths={[
        {
          label: 'Building blocks',
          path: 'Components → Table → Parts → …',
          hint: 'Header, Row, Cell, Toolbar, Pagination, etc.',
        },
      ]}
    />

    <Section
      title="3. Features (behavior)"
      paths={[
        {
          label: 'Filtering, grouping, nesting, spanning',
          path: 'Components → Table → Features → …',
        },
        {
          label: 'Virtualized, striped rows, hover actions',
          path: 'Components → Table → Features → …',
        },
      ]}
    />

    <Section
      title="4. Focused examples"
      paths={[
        { label: 'Pagination', path: 'Components → Table → Examples → Pagination' },
        { label: 'Sticky columns', path: 'Components → Table → Examples → Sticky Columns' },
        { label: 'Footer totals', path: 'Components → Table → Examples → Footer Totals' },
        { label: 'Keyboard navigation', path: 'Components → Table → Examples → Keyboard Navigation' },
        { label: 'Persisted sort', path: 'Components → Table → Examples → Persisted Sort' },
        { label: 'Deep nested grouping', path: 'Components → Table → Examples → Deep Nested Grouping' },
        {
          label: 'Combined sticky + filter + pagination',
          path: 'Components → Table → Examples → Combined Features',
        },
        {
          label: 'Edge cases (selection across pages, empty states, multi-sort)',
          path: 'Components → Table → Examples → Edge Cases',
        },
      ]}
    />

    <Section
      title="5. Experience layer (CompassDataTable)"
      paths={[
        {
          label: '01 Toolbar & export',
          path: 'Components → Table → Experience → CompassDataTable → 01 …',
        },
        {
          label: '02 Filters, columns & selection',
          path: 'Components → Table → Experience → CompassDataTable → 02 …',
        },
        {
          label: '03 Layout & keyboard',
          path: 'Components → Table → Experience → CompassDataTable → 03 …',
        },
      ]}
    />

    <Box marginTop="spacing.4" paddingTop="spacing.4" borderTopWidth="1px" borderTopStyle="solid">
      <Text size="small" color="surface.text.gray.muted">
        Agent and product references: compass-plugin <Code size="small">references/components/Table.md</Code>.
        Use Parts when wiring one subcomponent; use Features when exploring one capability end to end.
      </Text>
    </Box>
  </Box>
);

HowTableStoriesAreOrganized.parameters = {
  docs: {
    disable: false,
  },
};

export default meta;
