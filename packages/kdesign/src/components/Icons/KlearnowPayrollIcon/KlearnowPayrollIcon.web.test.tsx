import KlearnowPayrollIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<KlearnowPayrollIcon />', () => {
  it('should render KlearnowPayrollIcon', () => {
    const { container } = renderWithTheme(
      <KlearnowPayrollIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
