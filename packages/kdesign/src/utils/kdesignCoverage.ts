const getKdesignCoverage = (): {
  kdesignCoverage: number;
  totalNodes: number;
  kdesignNodes: number;
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

  const kdesignNodeElements = [];
  const totalNodeElements = [];

  allDomElements.forEach((elm) => {
    if (isElementHidden(elm)) return;
    if (isElementEmpty(elm)) return;
    if (isMediaElement(elm)) return;

    // skip svg nodes but not kdesign icons
    const closestSvgNode = elm.closest('svg');
    // if this is a kdesign icon then add it
    if (elm.tagName.toLocaleLowerCase() === 'svg' && elm.hasAttribute('data-kdesign-component')) {
      kdesignNodeElements.push(elm);
      totalNodeElements.push(elm);
      return;
    }
    // if it's a svg node inside a kdesign icon then skip it
    if (closestSvgNode?.getAttribute('data-kdesign-component') === 'icon') {
      return;
    }
    // if it's a svg node but not a kdesign icon then skip it
    if (closestSvgNode && !elm.hasAttribute('data-kdesign-component')) {
      return;
    }

    totalNodeElements.push(elm);

    // If element has data-kdesign-component add it
    if (elm.hasAttribute('data-kdesign-component')) {
      kdesignNodeElements.push(elm);
    }
  });

  const totalNodes = totalNodeElements.length;
  const kdesignNodes = kdesignNodeElements.length;
  let kdesignCoverage = Number(((kdesignNodes / totalNodes) * 100).toFixed(2));
  // NaN guard
  if (totalNodes === 0) {
    kdesignCoverage = 0;
  }

  return {
    kdesignCoverage,
    totalNodes,
    kdesignNodes,
  };
};

const assertKdesignCoverage = async ({
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
  const { kdesignCoverage } = await page.evaluate((coverageFnStr: string) => {
    // eslint-disable-next-line @typescript-eslint/no-implied-eval, no-new-func
    const calculateKdesignCoverage = new Function(`return (${coverageFnStr})()`);
    return calculateKdesignCoverage();
  }, getKdesignCoverage.toString());

  expect(kdesignCoverage).toBeGreaterThanOrEqual(threshold);
};

module.exports = { getKdesignCoverage, assertKdesignCoverage };
