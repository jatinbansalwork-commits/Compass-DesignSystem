import React from 'react';
import type { StoryFn } from '@storybook/react-vite';
import { within, userEvent, expect, fn } from 'storybook/test';
import { CitedFieldRow } from './';
import { CitedFieldRowInlineInput } from './citedFieldRowStoryHelpers';
import { Card, CardBody } from '~components/Card';
import { Box } from '~components/Box';

const onCiteClick = fn();

export const TestCiteChipClick: StoryFn = (): React.ReactElement => (
  <Box maxWidth="480px">
    <Card overflow="hidden">
      <CardBody padding="spacing.0">
        <CitedFieldRow
          label="MBOL"
          value="MEDUXYZ123456"
          source={{ label: 'BOL p1', accessibilityLabel: 'View MBOL on BOL, page 1' }}
          onCiteClick={onCiteClick}
        />
      </CardBody>
    </Card>
  </Box>
);

TestCiteChipClick.play = async ({ canvasElement }) => {
  onCiteClick.mockClear();
  const canvas = within(canvasElement);
  const chip = canvas.getByRole('button', { name: 'View MBOL on BOL, page 1' });
  await userEvent.click(chip);
  await expect(onCiteClick).toHaveBeenCalledTimes(1);
};

export const TestEditableControl: StoryFn = (): React.ReactElement => {
  const [mbol, setMbol] = React.useState('MEDUXYZ123456');

  return (
    <Box maxWidth="480px">
      <Card overflow="hidden">
        <CardBody padding="spacing.0">
          <CitedFieldRow
            label="MBOL"
            isEditable
            control={<CitedFieldRowInlineInput label="MBOL" value={mbol} onChange={setMbol} />}
          />
        </CardBody>
      </Card>
    </Box>
  );
};

TestEditableControl.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const input = canvas.getByRole('textbox', { name: 'MBOL' });
  await userEvent.clear(input);
  await userEvent.type(input, 'NEWVALUE');
  await expect(input).toHaveValue('NEWVALUE');
};

export default {
  title: 'Components/Interaction Tests/CitedFieldRow',
  component: CitedFieldRow,
  parameters: {
    controls: { disable: true },
    a11y: { disable: true },
    essentials: { disable: true },
  },
};
