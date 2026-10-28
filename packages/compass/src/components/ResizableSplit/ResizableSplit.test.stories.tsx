import React from 'react';
import type { StoryFn } from '@storybook/react-vite';
import { within, userEvent, expect } from 'storybook/test';
import { ResizableSplit, ResizableSplitPane } from './';
import { Box } from '~components/Box';
import { Text } from '~components/Typography';

const SplitFixture = ({
  accessibilityLabel,
}: {
  accessibilityLabel: string;
}): React.ReactElement => {
  const [width, setWidth] = React.useState<number | null>(null);

  return (
    <Box
      height="400px"
      borderWidth="thin"
      borderStyle="solid"
      borderColor="surface.border.gray.muted"
    >
      <ResizableSplit
        width={width}
        onWidthChange={setWidth}
        accessibilityLabel={accessibilityLabel}
      >
        <ResizableSplitPane>
          <Box padding="spacing.4">
            <Text>Start pane</Text>
          </Box>
        </ResizableSplitPane>
        <ResizableSplitPane>
          <Box padding="spacing.4">
            <Text>End pane</Text>
          </Box>
        </ResizableSplitPane>
      </ResizableSplit>
    </Box>
  );
};

export const TestKeyboardArrowKeys: StoryFn = (): React.ReactElement => (
  <SplitFixture accessibilityLabel="Resize panels with arrow keys" />
);

TestKeyboardArrowKeys.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const handle = canvas.getByRole('separator', { name: 'Resize panels with arrow keys' });
  const before = handle.getAttribute('aria-valuetext');
  handle.focus();
  await userEvent.keyboard('{ArrowRight}');
  await expect(handle.getAttribute('aria-valuetext')).not.toBe(before);
};

export const TestKeyboardHomeEnd: StoryFn = (): React.ReactElement => (
  <SplitFixture accessibilityLabel="Resize panels with Home and End" />
);

TestKeyboardHomeEnd.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const handle = canvas.getByRole('separator', { name: 'Resize panels with Home and End' });
  handle.focus();
  await userEvent.keyboard('{Home}');
  const afterHome = handle.getAttribute('aria-valuetext');
  await userEvent.keyboard('{End}');
  await expect(handle.getAttribute('aria-valuetext')).not.toBe(afterHome);
};

export const TestDoubleClickReset: StoryFn = (): React.ReactElement => (
  <SplitFixture accessibilityLabel="Resize panels with double-click reset" />
);

TestDoubleClickReset.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const handle = canvas.getByRole('separator', { name: 'Resize panels with double-click reset' });
  handle.focus();
  await userEvent.keyboard('{ArrowRight}');
  const afterArrow = handle.getAttribute('aria-valuetext');
  await userEvent.dblClick(handle);
  await expect(handle.getAttribute('aria-valuetext')).not.toBe(afterArrow);
};

export default {
  title: 'Components/Interaction Tests/ResizableSplit',
  component: ResizableSplit,
  parameters: {
    controls: { disable: true },
    a11y: { disable: true },
    essentials: { disable: true },
  },
};
