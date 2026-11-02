import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ResizableSplit, ResizableSplitPane } from './';
import {
  ResizableSplit as ResizableSplitNative,
  ResizableSplitPane as ResizableSplitPaneNative,
} from './ResizableSplit.native';
import { KdesignProvider } from '~components/KdesignProvider';
import { kdesignTheme } from '~tokens/theme';

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

const mockResizeObserverWithSize = (width: number, height = 500): void => {
  global.ResizeObserver = jest.fn().mockImplementation((callback) => ({
    observe: jest.fn(() => {
      callback([{ contentRect: { width, height } } as ResizeObserverEntry]);
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
    <KdesignProvider themeTokens={kdesignTheme} colorScheme="light">
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
    </KdesignProvider>
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
    mockResizeObserverWithSize(1200);
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

  it('does not call onWidthChange on every pointer move; commits on pointer up', async () => {
    const onWidthChange = jest.fn();
    const onResizeEnd = jest.fn();
    renderSplit({ onWidthChange, onResizeEnd, initialWidth: 400 });
    const handle = screen.getByRole('separator', { name: 'Resize panels' });
    const container = handle.parentElement as HTMLElement;

    container.getBoundingClientRect = jest.fn(
      () =>
        ({
          right: 1200,
          left: 0,
          top: 0,
          bottom: 500,
          width: 1200,
          height: 500,
          x: 0,
          y: 0,
          toJSON: () => ({}),
        }) as DOMRect,
    );
    handle.setPointerCapture = jest.fn();
    handle.releasePointerCapture = jest.fn();

    await act(async () => {
      fireEvent.pointerDown(handle, { button: 0, clientX: 800, pointerId: 1 });
    });
    await act(async () => {
      fireEvent.pointerMove(handle, { buttons: 1, clientX: 780, pointerId: 1 });
      fireEvent.pointerMove(handle, { buttons: 1, clientX: 760, pointerId: 1 });
    });
    expect(onWidthChange).not.toHaveBeenCalled();
    expect(onResizeEnd).not.toHaveBeenCalled();

    await act(async () => {
      fireEvent.pointerUp(handle, { button: 0, clientX: 760, pointerId: 1 });
    });
    expect(onWidthChange).toHaveBeenCalledTimes(1);
    expect(onResizeEnd).toHaveBeenCalledTimes(1);
    expect(onWidthChange).toHaveBeenLastCalledWith(onResizeEnd.mock.calls[0][0]);
  });

  it('supports vertical orientation with ArrowDown keyboard resize', async () => {
    mockResizeObserverWithSize(800, 600);
    const onWidthChange = jest.fn();
    render(
      <KdesignProvider themeTokens={kdesignTheme} colorScheme="light">
        <div style={{ width: 800, height: 600 }}>
          <ResizableSplit
            orientation="vertical"
            width={200}
            minEndWidth={120}
            minStartWidth={120}
            onWidthChange={onWidthChange}
            accessibilityLabel="Vertical resize"
          >
            <ResizableSplitPane>
              <div>Top</div>
            </ResizableSplitPane>
            <ResizableSplitPane>
              <div>Bottom</div>
            </ResizableSplitPane>
          </ResizableSplit>
        </div>
      </KdesignProvider>,
    );
    const handle = screen.getByRole('separator', { name: 'Vertical resize' });
    expect(handle).toHaveAttribute('aria-orientation', 'vertical');
    handle.focus();
    await userEvent.keyboard('{ArrowDown}');
    expect(onWidthChange).toHaveBeenCalledWith(216);
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
