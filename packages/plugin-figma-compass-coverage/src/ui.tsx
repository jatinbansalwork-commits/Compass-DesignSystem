import { Button, Container, render, VerticalSpace } from '@create-figma-plugin/ui';
// import { emit } from '@create-figma-plugin/utilities';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { h } from 'preact';
// import { Button } from '@klearnow/compass';
import { Button as CompassButton } from '@klearnow/compass/components';

const Plugin = (): JSX.Element => {
  return (
    <div>
      <Container space="medium">
        <VerticalSpace space="small" />
        Hello, Worldddd!
        <VerticalSpace space="large" />
        <CompassButton variant="secondary">Click</CompassButton>
        <Button fullWidth>Insert Code</Button>
        <VerticalSpace space="small" />
      </Container>
    </div>
  );
};

export default render(Plugin);
