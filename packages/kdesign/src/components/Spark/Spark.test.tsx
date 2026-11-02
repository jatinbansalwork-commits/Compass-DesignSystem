import React from 'react';
import userEvent from '@testing-library/user-event';
import { Klearsense as Spark } from './index';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

jest.mock('./KlearGlass/KlearGlass', () => {
  const mockReact = require('react');
  const MockKlearGlass = mockReact.forwardRef((props: Record<string, unknown>, ref: unknown) =>
    mockReact.createElement('div', { ...props, ref, 'data-testid': 'klearsense-mock' }),
  );
  MockKlearGlass.displayName = 'KlearGlass';
  return { KlearGlass: MockKlearGlass };
});

describe('Spark (Klearsense)', () => {
  it('renders without crashing', () => {
    const { container } = renderWithTheme(<Spark width={120} height={80} preset="default" />);
    expect(container.firstChild).toBeTruthy();
  });

  it('exposes a decorative container without focusable controls', () => {
    const { container } = renderWithTheme(<Spark width={120} height={80} preset="default" />);
    const root = container.firstChild as HTMLElement;
    expect(root.tagName).toBe('DIV');
    expect(root).not.toHaveAttribute('role', 'button');
    expect(root.querySelector('button, a[href], input, textarea, select')).toBeNull();
    expect(root).not.toHaveAttribute('aria-hidden', 'true');
  });

  it('does not introduce tab stops inside the spark surface', async () => {
    const user = userEvent.setup();
    renderWithTheme(<Spark width={120} height={80} preset="default" />);
    await user.tab();
    expect(document.activeElement?.tagName).not.toBe('DIV');
  });
});
