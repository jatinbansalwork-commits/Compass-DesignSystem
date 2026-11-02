import KlearnowIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<KlearnowIcon />', () => {
  it('should render KlearnowIcon', () => {
    const { container } = renderWithTheme(
      <KlearnowIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
