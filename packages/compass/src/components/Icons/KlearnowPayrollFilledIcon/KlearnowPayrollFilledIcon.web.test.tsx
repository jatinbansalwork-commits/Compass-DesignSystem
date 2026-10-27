import KlearnowPayrollFilledIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<KlearnowPayrollFilledIcon />', () => {
  it('should render KlearnowPayrollFilledIcon', () => {
    const { container } = renderWithTheme(
      <KlearnowPayrollFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
