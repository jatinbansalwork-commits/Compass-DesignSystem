import type {
  Klear360ComponentInstanceNode,
  Klear360FrameNode,
  Klear360GroupNode,
  Klear360Node,
  Klear360TextNode,
  Klear360VectorNode,
} from '../types/Klear360';

const convertBaseNode = (
  figmaNode: Readonly<SceneNode>,
  bladeParent: Klear360Node | null,
): Klear360Node => {
  const bladeNode: Klear360Node = {
    id: figmaNode.id,
    layerName: figmaNode.name,
    type: figmaNode.type,
    parent: bladeParent,
  };

  return bladeNode;
};

/**
 * Klear360 component structures aren't simple
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
  bladeNode: Klear360Node,
): Klear360ComponentInstanceNode => {
  const bladeComponentInstance: Klear360ComponentInstanceNode = {
    ...bladeNode,
    componentProperties: figmaNode.componentProperties,
    type: 'INSTANCE',
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    children: convertIntoKlear360Nodes(figmaNode.children, bladeNode),
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

const convertTextToNode = (figmaNode: Readonly<TextNode>, bladeNode: Klear360Node): Klear360TextNode => {
  const bladeTextNode: Klear360TextNode = {
    ...bladeNode,
    type: 'TEXT',
    characters: figmaNode.characters,
    textStyleId: figmaNode.textStyleId,
  };

  return bladeTextNode;
};

const convertFrameToNode = (
  figmaNode: Readonly<FrameNode>,
  bladeNode: Klear360Node,
): Klear360FrameNode => {
  const bladeFrame: Klear360FrameNode = {
    ...bladeNode,
    type: 'FRAME',
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    children: convertIntoKlear360Nodes(figmaNode.children, bladeNode),
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
  bladeNode: Klear360Node,
): Klear360GroupNode => {
  const bladeGroupNode: Klear360GroupNode = {
    ...bladeNode,
    type: 'GROUP',
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    children: convertIntoKlear360Nodes(figmaNode.children, bladeNode),
    rotation: figmaNode.rotation,
    layoutAlign: figmaNode.layoutAlign,
    layoutGrow: figmaNode.layoutGrow,
    layoutPositioning: figmaNode.layoutPositioning,
  };
  return bladeGroupNode;
};

const convertVectorToNode = (
  figmaNode: Readonly<VectorNode>,
  bladeNode: Klear360Node,
): Klear360VectorNode => {
  const bladeVectorNode: Klear360VectorNode = {
    ...bladeNode,
    type: 'VECTOR',
    fills: Array.isArray(figmaNode.fills)
      ? figmaNode.fills.filter((fill) => fill.visible)
      : figmaNode.fills,
    fillStyleId: figmaNode.fillStyleId,
  };
  return bladeVectorNode;
};

export const convertIntoKlear360Nodes = (
  figmaNodes: ReadonlyArray<SceneNode>,
  bladeParent: Klear360Node | null,
): Array<Klear360Node> => {
  const bladeNodes: Klear360Node[] = [];
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
