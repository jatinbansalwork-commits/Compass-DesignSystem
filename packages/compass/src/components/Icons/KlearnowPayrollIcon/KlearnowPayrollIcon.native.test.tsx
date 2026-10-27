import KlearnowPayrollIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<KlearnowPayrollIcon />', () => {
  it('should render KlearnowPayrollIcon', () => {
    const renderTree = renderWithTheme(
      <KlearnowPayrollIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
