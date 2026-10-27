import KlearnowTrustIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<KlearnowTrustIcon />', () => {
  it('should render KlearnowTrustIcon', () => {
    const renderTree = renderWithTheme(
      <KlearnowTrustIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
