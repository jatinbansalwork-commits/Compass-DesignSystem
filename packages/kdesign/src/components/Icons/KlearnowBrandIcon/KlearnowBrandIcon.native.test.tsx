import KlearnowIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<KlearnowIcon />', () => {
  it('should render KlearnowIcon', () => {
    const renderTree = renderWithTheme(
      <KlearnowIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
