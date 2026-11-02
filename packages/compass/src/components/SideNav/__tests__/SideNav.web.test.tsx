import userEvent from '@testing-library/user-event';
import { SideNavExample, SideNavFlyoutL3Example, SideNavL4NestingErrorExample } from './SideNavExample';
import renderWithTheme from '~utils/testing/renderWithTheme';
import assertAccessible from '~utils/testing/assertAccessible';

// Test cases are limited here since SideNav gets flaky in unit tests with all the complexity
// Major functionality tests are added in Interaction tests

describe('SideNav', () => {
  test('should render', () => {
    const { container } = renderWithTheme(<SideNavExample />);
    expect(container).toMatchSnapshot();
  });

  test('should supports styled-props', () => {
    const { getByRole } = renderWithTheme(
      // Have to pass display="block" otherwise component ignores media query style and selects base display value which is none
      <SideNavExample position="absolute" zIndex={1234} display="block" />,
    );
    expect(getByRole('navigation')).toHaveStyle('z-index: 1234; position: absolute');
  });

  test('should throw error on more than 3 level nesting', () => {
    const mockConsoleError = jest.spyOn(console, 'error').mockImplementation();
    expect(() => renderWithTheme(<SideNavL4NestingErrorExample />)).toThrow(
      '[Compass: SideNavLink]: SideNav only supports nesting upto L3 but L4 nesting was found. Check the nesting of your SideNavLevel items',
    );
    mockConsoleError.mockRestore();
  });

  test('should keep L1 expanded through navigation when isExpanded is true', async () => {
    const user = userEvent.setup();
    const { getByRole } = renderWithTheme(
      <SideNavExample display="block" isExpanded={true} initialEntries={['/home']} />,
    );

    await user.click(getByRole('link', { name: 'L2 Trigger' }));
    expect(getByRole('link', { name: 'L2 Item' })).toBeVisible();
    await user.click(getByRole('link', { name: 'Gateway' }));
    expect(getByRole('link', { name: 'Gateway' })).toHaveAttribute('aria-current', 'page');
    expect(getByRole('link', { name: 'Gateway' })).toBeVisible();
  });

  test('should render L3 flyout branch trigger for flyout variant', () => {
    const { getByRole } = renderWithTheme(
      <SideNavFlyoutL3Example display="block" initialEntries={['/l2-item']} />,
    );

    expect(getByRole('button', { name: 'L3 Trigger' })).toHaveAttribute('data-sidenav-branch');
  });

  test('should keep L3 Item selected based on URL', () => {
    const { getByRole } = renderWithTheme(
      <SideNavExample display="block" initialEntries={['/l3-item']} />,
    );

    expect(getByRole('link', { name: 'L3 Item' })).toHaveAttribute('aria-current', 'page');
  });

  test('should pass general a11y', async () => {
    const { container } = renderWithTheme(<SideNavExample display="block" />);

    await assertAccessible(container);
  });

  test('it should support passing data-analytics attribute', () => {
    const { getByRole } = renderWithTheme(<SideNavExample display="block" />);

    expect(getByRole('navigation')).toHaveAttribute('data-analytics-side-nav', 'demo-item');
    expect(getByRole('link', { name: 'Home' })).toHaveAttribute('data-analytics-nav-link', 'home');
  });
});
