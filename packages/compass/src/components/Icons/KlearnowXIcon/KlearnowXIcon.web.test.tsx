import KlearnowXIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<KlearnowXIcon />', () => {
  it('should render KlearnowXIcon', () => {
    const { container } = renderWithTheme(
      <KlearnowXIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
