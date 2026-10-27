import React from 'react';
import userEvent from '@testing-library/user-event';
import { BaseFilterChip } from './BaseFilterChip.web';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

/**
 * `FilterChip` folder ships `BaseFilterChip` — a controlled filter trigger (not a toggle chip).
 */
describe('FilterChip (BaseFilterChip)', () => {
  it('renders the label', () => {
    const { getByRole } = renderWithTheme(<BaseFilterChip label="Status" />);
    expect(getByRole('button', { name: /Status/i })).toBeInTheDocument();
  });

  it('reflects unselected state without a value or clear control', () => {
    const { getByRole, queryByLabelText } = renderWithTheme(
      <BaseFilterChip label="Status" testID="status-filter" />,
    );
    expect(getByRole('button', { name: 'Status' })).toBeInTheDocument();
    expect(queryByLabelText('Clear Status value')).not.toBeInTheDocument();
  });

  it('reflects selected state when value is set and fires onClick on trigger click', async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();

    const { container, getByLabelText } = renderWithTheme(
      <BaseFilterChip label="Status" value="Active" onClick={onClick} />,
    );

    expect(getByLabelText('Clear Status value')).toBeInTheDocument();
    const trigger = container.querySelector('[data-compass-component="filter-chip-trigger"]');
    expect(trigger).not.toBeNull();
    await user.click(trigger as HTMLElement);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('does not respond when isDisabled', async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();

    const { container } = renderWithTheme(
      <BaseFilterChip label="Status" value="Active" isDisabled onClick={onClick} />,
    );

    const trigger = container.querySelector(
      '[data-compass-component="filter-chip-trigger"]',
    ) as HTMLButtonElement;
    expect(trigger).toBeDisabled();
    await user.click(trigger);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('activates the trigger with Enter and Space', async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();

    const { getByRole } = renderWithTheme(<BaseFilterChip label="Status" onClick={onClick} />);

    const trigger = getByRole('button', { name: 'Status' });
    trigger.focus();
    await user.keyboard('{Enter}');
    await user.keyboard(' ');
    expect(onClick).toHaveBeenCalledTimes(2);
  });
});
