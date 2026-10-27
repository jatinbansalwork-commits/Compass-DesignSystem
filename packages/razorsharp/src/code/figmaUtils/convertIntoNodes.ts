import type {
  CompassComponentInstanceNode,
  CompassFrameNode,
  CompassGroupNode,
  CompassNode,
  CompassTextNode,
  CompassVectorNode,
} from '../types/Compass';

const convertBaseNode = (
  figmaNode: Readonly<SceneNode>,
  bladeParent: CompassNode | null,
): CompassNode => {
  const bladeNode: CompassNode = {
    id: figmaNode.id,
    layerName: figmaNode.name,
    type: figmaNode.type,
    parent: bladeParent,
  };

  return bladeNode;
};

/**
 * Compass component structures aren't simple
 * In case of icons, name of the component can be found in the main component property
 * In case of other components, use the parent's name instead
 * @param figmaNode
 * @returns name of the component in figma
 */
const getComponentName = (figmaNode: Readonly<InstanceNode>): string | null => {
  return figmaNode.mainComponent?.parent?.name ?? figmaNode.mainComponent?.name ?? null;
};

const convertInstanceToNode = (
  figmaNode: Readonly<InstanceNode>,
  bladeNode: CompassNode,
): CompassComponentInstanceNode => {
  const bladeComponentInstance: CompassComponentInstanceNode = {
    ...bladeNode,
    componentProperties: figmaNode.componentProperties,
    type: 'INSTANCE',
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    children: convertIntoCompassNodes(figmaNode.children, bladeNode),
    name: getComponentName(figmaNode),
    fills: Array.isArray(figmaNode.fills)
      ? figmaNode.fills.filter((fill) => fill.visible)
      : figmaNode.fills,
    fillStyleId: figmaNode.fillStyleId,
    width: figmaNode.width,
    height: figmaNode.height,
  };
  return bladeComponentInstance;
};

const convertTextToNode = (figmaNode: Readonly<TextNode>, bladeNode: CompassNode): CompassTextNode => {
  const bladeTextNode: CompassTextNode = {
    ...bladeNode,
    type: 'TEXT',
    characters: figmaNode.characters,
    textStyleId: figmaNode.textStyleId,
  };

  return bladeTextNode;
};

const convertFrameToNode = (
  figmaNode: Readonly<FrameNode>,
  bladeNode: CompassNode,
): CompassFrameNode => {
  const bladeFrame: CompassFrameNode = {
    ...bladeNode,
    type: 'FRAME',
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    children: convertIntoCompassNodes(figmaNode.children, bladeNode),
    counterAxisAlignItems: figmaNode.counterAxisAlignItems,
    counterAxisSizingMode: figmaNode.counterAxisSizingMode,
    primaryAxisAlignItems: figmaNode.primaryAxisAlignItems,
    primaryAxisSizingMode: figmaNode.primaryAxisSizingMode,
    paddingTop: figmaNode.paddingTop,
    paddingRight: figmaNode.paddingRight,
    paddingLeft: figmaNode.paddingLeft,
    paddingBottom: figmaNode.paddingBottom,
    layoutMode: figmaNode.layoutMode,
    itemSpacing: figmaNode.itemSpacing,
    height: figmaNode.height,
    width: figmaNode.width,
    fills: Array.isArray(figmaNode.fills)
      ? figmaNode.fills.filter((fill) => fill.visible)
      : figmaNode.fills,
    fillStyleId: figmaNode.fillStyleId,
    layoutSizingHorizontal: figmaNode.layoutSizingHorizontal,
    layoutSizingVertical: figmaNode.layoutSizingVertical,
    inferredAutoLayout: figmaNode.inferredAutoLayout,
    maxHeight: figmaNode.maxHeight,
    maxWidth: figmaNode.maxWidth,
  };
  return bladeFrame;
};

const convertGroupToNode = (
  figmaNode: Readonly<GroupNode>,
  bladeNode: CompassNode,
): CompassGroupNode => {
  const bladeGroupNode: CompassGroupNode = {
    ...bladeNode,
    type: 'GROUP',
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    children: convertIntoCompassNodes(figmaNode.children, bladeNode),
    rotation: figmaNode.rotation,
    layoutAlign: figmaNode.layoutAlign,
    layoutGrow: figmaNode.layoutGrow,
    layoutPositioning: figmaNode.layoutPositioning,
  };
  return bladeGroupNode;
};

const convertVectorToNode = (
  figmaNode: Readonly<VectorNode>,
  bladeNode: CompassNode,
): CompassVectorNode => {
  const bladeVectorNode: CompassVectorNode = {
    ...bladeNode,
    type: 'VECTOR',
    fills: Array.isArray(figmaNode.fills)
      ? figmaNode.fills.filter((fill) => fill.visible)
      : figmaNode.fills,
    fillStyleId: figmaNode.fillStyleId,
  };
  return bladeVectorNode;
};

export const convertIntoCompassNodes = (
  figmaNodes: ReadonlyArray<SceneNode>,
  bladeParent: CompassNode | null,
): Array<CompassNode> => {
  const bladeNodes: CompassNode[] = [];
  figmaNodes.forEach((figmaNode) => {
    if (!figmaNode.visible) {
      return;
    }

    let bladeNode = convertBaseNode(figmaNode, bladeParent);

    switch (figmaNode.type) {
      case 'INSTANCE':
        bladeNode = convertInstanceToNode(figmaNode, bladeNode);
        break;
      case 'TEXT':
        bladeNode = convertTextToNode(figmaNode, bladeNode);
        break;
      case 'FRAME':
        bladeNode = convertFrameToNode(figmaNode, bladeNode);
        break;
      case 'GROUP':
        bladeNode = convertGroupToNode(figmaNode, bladeNode);
        break;
      case 'VECTOR':
        bladeNode = convertVectorToNode(figmaNode, bladeNode);
        break;
      default:
        break;
    }

    bladeNodes.push(bladeNode);
  });

  return bladeNodes;
};
