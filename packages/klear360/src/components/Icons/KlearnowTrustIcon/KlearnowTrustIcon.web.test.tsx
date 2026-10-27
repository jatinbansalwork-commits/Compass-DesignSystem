import KlearnowTrustIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<KlearnowTrustIcon />', () => {
  it('should render KlearnowTrustIcon', () => {
    const { container } = renderWithTheme(
      <KlearnowTrustIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
