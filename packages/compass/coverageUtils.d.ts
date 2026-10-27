/* eslint-disable @typescript-eslint/no-explicit-any */
export function getCompassCoverage(): {
  compassCoverage: number;
  totalNodes: number;
  bladeNodes: number;
};

export function assertCompassCoverage({
  page,
  expect,
  threshold,
}: {
  page: any;
  expect: any;
  threshold?: number;
}): Promise<void>;
