import type { StoryFn, Meta } from '@storybook/react-vite';
import { Title, Subtitle, Primary, Controls, Stories } from '@storybook/addon-docs/blocks';
import type { ReactElement } from 'react';
import type { BaseSpinnerProps } from './BaseSpinner';
import { BaseSpinner as BaseSpinnerComponent } from './BaseSpinner';
import { getStyledPropsArgTypes } from '~components/Box/BaseBox/storybookArgTypes';

const Page = (): ReactElement => {
  return (
    <>
      <Title />
      <Subtitle>This is the BaseSpinner Internal component.</Subtitle>
      <a
        href="https://klearnow.ai/"
        target="_blank"
        rel="noreferrer noopener"
      >
        View in Figma
      </a>
      <br />
      <br />
      <Title>Example</Title>
      <Subtitle>
        This is the default BaseSpinner. You can change the properties of this spinner using the
        controls in the table below.
      </Subtitle>
      <Primary />
      <Title>Properties</Title>
      <Controls />
      <Stories />
    </>
  );
};

export default {
  title: 'Components/Spinner/BaseSpinner (Internal)',
  component: BaseSpinnerComponent,
  parameters: {
    docs: {
      page: Page,
    },
  },
  tags: ['autodocs'],
  argTypes: getStyledPropsArgTypes(),
} as Meta<BaseSpinnerProps>;

const BaseSpinnerTemplate: StoryFn<typeof BaseSpinnerComponent> = ({ ...args }) => {
  return <BaseSpinnerComponent {...args} />;
};

export const BaseSpinner = BaseSpinnerTemplate.bind({});
BaseSpinner.storyName = 'Default';
