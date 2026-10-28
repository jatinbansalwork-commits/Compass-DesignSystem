import { composeStories } from '@storybook/react-vite';
import * as resizableSplitStories from './ResizableSplit.stories';
import { Box } from '~components/Box';
import { Heading } from '~components/Typography';

const allStories = Object.values(composeStories(resizableSplitStories));

export const ResizableSplitKitchenSink = (): JSX.Element => {
  return (
    <Box display="flex" flexDirection="column" gap="spacing.4">
      {allStories.map((Story) => {
        return (
          <>
            <Heading>{Story.storyName}</Heading>
            <Story />
          </>
        );
      })}
    </Box>
  );
};

export default {
  title: 'Components/KitchenSink/ResizableSplit',
  component: ResizableSplitKitchenSink,
  parameters: {
    chromatic: { disableSnapshot: false },
    options: { showPanel: false },
  },
};
