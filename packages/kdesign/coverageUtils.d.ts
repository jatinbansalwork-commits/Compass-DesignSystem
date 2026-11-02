/* eslint-disable @typescript-eslint/no-explicit-any */
export function getKdesignCoverage(): {
  kdesignCoverage: number;
  totalNodes: number;
  kdesignNodes: number;
};

export function assertKdesignCoverage({
  page,
  expect,
  threshold,
}: {
  page: any;
  expect: any;
  threshold?: number;
}): Promise<void>;
