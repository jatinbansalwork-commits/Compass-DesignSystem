/* eslint-disable no-undef */
const calculateKdesignCoverage = (shouldHighlightNodes, includeNavbars = true) => {
  const kdesignElementExceptions = [
    // table library adds a div internally which we want to skip
    '[data-kdesign-component="table-cell"] > div',
    '[data-kdesign-component="table-header-cell"] > div',
    '[data-kdesign-component="table-footer-cell"] > div',
  ];

  /**
   * Checks if DOM node is hidden or not
   */
  const isElementHidden = (element) => {
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
   * Checks if DOM element is empty or not
   */
  const isElementEmpty = (element) => {
    if (!element) return true;
    if (!element.childNodes.length) {
      return true;
    }
    return false;
  };

  /**
   * Checks if DOM node is a media element or not
   */
  const isMediaElement = (element) => {
    const mediaTags = ['img', 'video', 'audio', 'source', 'picture'];
    return mediaTags.includes(element.tagName.toLowerCase());
  };

  /**
   * Checks if element is inside sidenav or topnav
   */
  const isInsideNavElement = (element) => {
    const SIDENAV_NAME = 'sidenav';
    const TOPNAV_NAME = 'top-nav';
    const currentKdesignComponent = element.getAttribute('data-kdesign-component');
    if (currentKdesignComponent === SIDENAV_NAME || currentKdesignComponent === TOPNAV_NAME) {
      return true;
    }

    if (
      element.closest(`[data-kdesign-component=${SIDENAV_NAME}]`) ||
      element.closest(`[data-kdesign-component=${TOPNAV_NAME}]`)
    ) {
      return true;
    }

    return false;
  };

  /**
   * Checks if element should be ignored for design consistency calculations
   */
  const shouldIgnoreElement = (element) => {
    // Ignore everything that is inside nav
    if (isInsideNavElement(element)) {
      return true;
    }

    // Ignore Box component
    const componentsToIgnore = ['box'];
    const currentKdesignComponent = element.getAttribute('data-kdesign-component');
    if (currentKdesignComponent && componentsToIgnore.includes(currentKdesignComponent)) {
      return true;
    }

    return false;
  };

  const allDomElements = document.querySelectorAll('body *');

  const kdesignNodeElements = [];
  const totalNodeElements = [];
  const nonKdesignNodeElements = [];

  allDomElements.forEach((elm) => {
    if (isElementHidden(elm)) return;
    if (isElementEmpty(elm)) return;
    if (isMediaElement(elm)) return;

    // skip svg nodes but not kdesign icons
    const closestSvgNode = elm.closest('svg');
    // if this is a kdesign icon then add it
    if (elm.tagName.toLocaleLowerCase() === 'svg' && elm.hasAttribute('data-kdesign-component')) {
      // Skip if includeNavbars is false and element should be ignored
      if (!includeNavbars && shouldIgnoreElement(elm)) {
        return;
      }
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

    if (kdesignElementExceptions.some((exception) => elm.matches(exception))) {
      return;
    }

    // Skip if includeNavbars is false and element should be ignored
    if (!includeNavbars && shouldIgnoreElement(elm)) {
      return;
    }

    totalNodeElements.push(elm);

    // If element has data-kdesign-component add it
    if (elm.hasAttribute('data-kdesign-component')) {
      kdesignNodeElements.push(elm);
    } else {
      nonKdesignNodeElements.push(elm);
    }
  });

  const totalNodes = totalNodeElements.length;
  const kdesignNodes = kdesignNodeElements.length;

  let kdesignCoverage = Number(((kdesignNodes / totalNodes) * 100).toFixed(2));

  // NaN guard
  if (totalNodes === 0) {
    kdesignCoverage = 0;
  }

  if (shouldHighlightNodes) {
    nonKdesignNodeElements.forEach((node) => {
      node.style.outline = '1px solid rgba(255, 0, 0, 0.5)';
    });
  } else {
    nonKdesignNodeElements.forEach((node) => {
      node.style.outline = 'initial';
    });
  }

  return {
    kdesignCoverage,
    totalNodes,
    kdesignNodes,
  };
};

export { calculateKdesignCoverage };
