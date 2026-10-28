import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ResizableSplit, ResizableSplitPane } from './';
import {
  ResizableSplit as ResizableSplitNative,
  ResizableSplitPane as ResizableSplitPaneNative,
} from './ResizableSplit.native';
import { CompassProvider } from '~components/CompassProvider';
import { compassTheme } from '~tokens/theme';

jest.mock('react-native', () => {
  const ReactMock = require('react');
  return {
    View: ({
      children,
      style,
    }: {
      children?: React.ReactNode;
      style?: React.CSSProperties;
    }): React.ReactElement =>
      ReactMock.createElement('div', { 'data-testid': 'rn-view', style }, children),
    Text: ({ children }: { children?: React.ReactNode }): React.ReactElement =>
      ReactMock.createElement('span', null, children),
  };
});

const defaultResizeObserver = global.ResizeObserver;

const mockResizeObserverWithWidth = (width: number): void => {
  global.ResizeObserver = jest.fn().mockImplementation((callback) => ({
    observe: jest.fn(() => {
      callback([{ contentRect: { width, height: 500 } } as ResizeObserverEntry]);
    }),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  }));
};

const StatefulSplit = ({
  initialWidth = 400,
  onWidthChange,
  onResizeEnd,
}: {
  initialWidth?: number;
  onWidthChange?: (width: number | null) => void;
  onResizeEnd?: (width: number) => void;
}): React.ReactElement => {
  const [width, setWidth] = React.useState<number | null>(initialWidth);
  return (
    <CompassProvider themeTokens={compassTheme} colorScheme="light">
      <div style={{ width: 1200, height: 500 }}>
        <ResizableSplit
          width={width}
          onWidthChange={(next) => {
            setWidth(next);
            onWidthChange?.(next);
          }}
          onResizeEnd={onResizeEnd}
          accessibilityLabel="Resize panels"
        >
          <ResizableSplitPane>
            <div>Start pane</div>
          </ResizableSplitPane>
          <ResizableSplitPane>
            <div>End pane</div>
          </ResizableSplitPane>
        </ResizableSplit>
      </div>
    </CompassProvider>
  );
};

const renderSplit = (
  props: {
    initialWidth?: number;
    onWidthChange?: (width: number | null) => void;
    onResizeEnd?: (width: number) => void;
  } = {},
): ReturnType<typeof render> => render(<StatefulSplit {...props} />);

describe('ResizableSplit (web)', () => {
  beforeEach(() => {
    mockResizeObserverWithWidth(1200);
  });

  afterEach(() => {
    global.ResizeObserver = defaultResizeObserver;
  });

  it('renders without crashing with two pane children', () => {
    renderSplit();
    expect(screen.getByText('Start pane')).toBeInTheDocument();
    expect(screen.getByText('End pane')).toBeInTheDocument();
  });

  it('handle is focusable', () => {
    renderSplit();
    const handle = screen.getByRole('separator', { name: 'Resize panels' });
    handle.focus();
    expect(handle).toHaveFocus();
  });

  it('Arrow Right moves the split handle', async () => {
    const onWidthChange = jest.fn();
    renderSplit({ onWidthChange, initialWidth: 400 });
    const handle = screen.getByRole('separator', { name: 'Resize panels' });
    const before = handle.getAttribute('aria-valuetext');
    handle.focus();
    await userEvent.keyboard('{ArrowRight}');
    const after = handle.getAttribute('aria-valuetext');
    expect(onWidthChange).toHaveBeenCalledWith(416);
    expect(after).not.toBe(before);
  });

  it('fires onResizeEnd when handle is moved via keyboard', async () => {
    const onResizeEnd = jest.fn();
    renderSplit({ onResizeEnd, initialWidth: 400 });
    const handle = screen.getByRole('separator', { name: 'Resize panels' });
    handle.focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(onResizeEnd).toHaveBeenCalledWith(416);
  });

  it('handle has correct APG separator ARIA role and attributes', () => {
    renderSplit();
    const handle = screen.getByRole('separator', { name: 'Resize panels' });
    expect(handle).toHaveAttribute('aria-orientation', 'horizontal');
    expect(handle).toHaveAttribute('aria-valuemin', '0');
    expect(handle).toHaveAttribute('aria-valuemax', '100');
    expect(handle).toHaveAttribute('aria-valuenow');
    expect(handle).toHaveAttribute('aria-valuetext');
  });
});

describe('ResizableSplit (native)', () => {
  it('stacks panes vertically without a separator', () => {
    render(
      <ResizableSplitNative
        width={null}
        onWidthChange={() => undefined}
        accessibilityLabel="Resize panels"
      >
        <ResizableSplitPaneNative>
          <span>Start pane</span>
        </ResizableSplitPaneNative>
        <ResizableSplitPaneNative>
          <span>End pane</span>
        </ResizableSplitPaneNative>
      </ResizableSplitNative>,
    );
    expect(screen.getByText('Start pane')).toBeInTheDocument();
    expect(screen.getByText('End pane')).toBeInTheDocument();
    expect(screen.queryByRole('separator')).not.toBeInTheDocument();
    expect(screen.getAllByTestId('rn-view').length).toBeGreaterThanOrEqual(1);
  });
});
