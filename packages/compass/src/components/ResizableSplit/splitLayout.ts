import type { ResizableSplitOrientation } from './types';

const buildHorizontalGridTemplate = (
  minStartSize: number,
  handleTrackSize: number,
  endSize: number,
): string => `minmax(${minStartSize}px, 1fr) ${handleTrackSize}px ${endSize}px`;

const buildVerticalGridTemplate = (
  minStartSize: number,
  handleTrackSize: number,
  endSize: number,
): string => `minmax(${minStartSize}px, 1fr) ${handleTrackSize}px ${endSize}px`;

const buildSplitGridTemplate = ({
  orientation,
  minStartSize,
  handleTrackSize,
  endSize,
}: {
  orientation: ResizableSplitOrientation;
  minStartSize: number;
  handleTrackSize: number;
  endSize: number;
}): { gridTemplateColumns?: string; gridTemplateRows?: string } => {
  const track = buildHorizontalGridTemplate(minStartSize, handleTrackSize, endSize);

  if (orientation === 'vertical') {
    return {
      gridTemplateColumns: '1fr',
      gridTemplateRows: buildVerticalGridTemplate(minStartSize, handleTrackSize, endSize),
    };
  }

  return {
    gridTemplateColumns: track,
    gridTemplateRows: '1fr',
  };
};

/** @deprecated Use `buildSplitGridTemplate`. */
const buildGridTemplateColumns = buildHorizontalGridTemplate;

export { buildSplitGridTemplate, buildHorizontalGridTemplate, buildGridTemplateColumns };
