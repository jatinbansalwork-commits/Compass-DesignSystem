const buildGridTemplateColumns = (
  minStartWidth: number,
  handleWidth: number,
  endWidth: number,
): string => `minmax(${minStartWidth}px, 1fr) ${handleWidth}px ${endWidth}px`;

export { buildGridTemplateColumns };
