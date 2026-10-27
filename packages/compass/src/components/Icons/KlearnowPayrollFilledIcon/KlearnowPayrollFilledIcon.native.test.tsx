import KlearnowPayrollFilledIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<KlearnowPayrollFilledIcon />', () => {
  it('should render KlearnowPayrollFilledIcon', () => {
    const renderTree = renderWithTheme(
      <KlearnowPayrollFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
