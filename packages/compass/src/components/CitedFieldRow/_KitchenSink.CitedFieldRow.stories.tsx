import { composeStories } from '@storybook/react-vite';
import * as citedFieldRowStories from './CitedFieldRow.stories';
import { Box } from '~components/Box';
import { Heading } from '~components/Typography';

const allStories = Object.values(composeStories(citedFieldRowStories));

export const CitedFieldRowKitchenSink = (): JSX.Element => {
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
  title: 'Components/KitchenSink/CitedFieldRow',
  component: CitedFieldRowKitchenSink,
  parameters: {
    chromatic: { disableSnapshot: false },
    options: { showPanel: false },
  },
};
