import KlearnowXIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<KlearnowXIcon />', () => {
  it('should render KlearnowXIcon', () => {
    const renderTree = renderWithTheme(
      <KlearnowXIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
