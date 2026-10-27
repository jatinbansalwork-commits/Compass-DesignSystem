const getCompassCoverage = (): {
  compassCoverage: number;
  totalNodes: number;
  bladeNodes: number;
} => {
  /**
   * Checks if DOM node is hidden or not
   */
  const isElementHidden = (element: Element): boolean => {
    if (element.parentElement && isElementHidden(element.parentElement)) {
      return true;
    }
    if (!(element instanceof HTMLElement)) {
      return false;
    }
    if (element.hidden) {
      return true;
    }
    const style = getComputedStyle(element);
    return style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0';
  };

  /**
   * Checks if DOM node is a media element or not
   */
  const isMediaElement = (element: Element): boolean => {
    const mediaTags = ['img', 'video', 'audio', 'source', 'picture'];
    return mediaTags.includes(element.tagName.toLowerCase());
  };

  /**
   * Checks if DOM element is empty or not
   */
  const isElementEmpty = (element: Element): boolean => {
    if (!element) return true;
    if (!element.childNodes.length) {
      return true;
    }
    return false;
  };

  const allDomElements = document.querySelectorAll('body *');

  const bladeNodeElements = [];
  const totalNodeElements = [];

  allDomElements.forEach((elm) => {
    if (isElementHidden(elm)) return;
    if (isElementEmpty(elm)) return;
    if (isMediaElement(elm)) return;

    // skip svg nodes but not blade icons
    const closestSvgNode = elm.closest('svg');
    // if this is a blade icon then add it
    if (elm.tagName.toLocaleLowerCase() === 'svg' && elm.hasAttribute('data-compass-component')) {
      bladeNodeElements.push(elm);
      totalNodeElements.push(elm);
      return;
    }
    // if it's a svg node inside a blade icon then skip it
    if (closestSvgNode?.getAttribute('data-compass-component') === 'icon') {
      return;
    }
    // if it's a svg node but not a blade icon then skip it
    if (closestSvgNode && !elm.hasAttribute('data-compass-component')) {
      return;
    }

    totalNodeElements.push(elm);

    // If element has data-compass-component add it
    if (elm.hasAttribute('data-compass-component')) {
      bladeNodeElements.push(elm);
    }
  });

  const totalNodes = totalNodeElements.length;
  const bladeNodes = bladeNodeElements.length;
  let compassCoverage = Number(((bladeNodes / totalNodes) * 100).toFixed(2));
  // NaN guard
  if (totalNodes === 0) {
    compassCoverage = 0;
  }

  return {
    compassCoverage,
    totalNodes,
    bladeNodes,
  };
};

const assertCompassCoverage = async ({
  page,
  expect,
  threshold = 70,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  page: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  expect: any;
  threshold: number;
}): Promise<void> => {
  const { compassCoverage } = await page.evaluate((coverageFnStr: string) => {
    // eslint-disable-next-line @typescript-eslint/no-implied-eval, no-new-func
    const calculateCompassCoverage = new Function(`return (${coverageFnStr})()`);
    return calculateCompassCoverage();
  }, getCompassCoverage.toString());

  expect(compassCoverage).toBeGreaterThanOrEqual(threshold);
};

module.exports = { getCompassCoverage, assertCompassCoverage };
