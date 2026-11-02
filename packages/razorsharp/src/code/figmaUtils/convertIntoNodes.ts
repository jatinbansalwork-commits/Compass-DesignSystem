import type {
  KdesignComponentInstanceNode,
  KdesignFrameNode,
  KdesignGroupNode,
  KdesignNode,
  KdesignTextNode,
  KdesignVectorNode,
} from '../types/Kdesign';

const convertBaseNode = (
  figmaNode: Readonly<SceneNode>,
  kdesignParent: KdesignNode | null,
): KdesignNode => {
  const kdesignNode: KdesignNode = {
    id: figmaNode.id,
    layerName: figmaNode.name,
    type: figmaNode.type,
    parent: kdesignParent,
  };

  return kdesignNode;
};

/**
 * Kdesign component structures aren't simple
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
  kdesignNode: KdesignNode,
): KdesignComponentInstanceNode => {
  const kdesignComponentInstance: KdesignComponentInstanceNode = {
    ...kdesignNode,
    componentProperties: figmaNode.componentProperties,
    type: 'INSTANCE',
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    children: convertIntoKdesignNodes(figmaNode.children, kdesignNode),
    name: getComponentName(figmaNode),
    fills: Array.isArray(figmaNode.fills)
      ? figmaNode.fills.filter((fill) => fill.visible)
      : figmaNode.fills,
    fillStyleId: figmaNode.fillStyleId,
    width: figmaNode.width,
    height: figmaNode.height,
  };
  return kdesignComponentInstance;
};

const convertTextToNode = (figmaNode: Readonly<TextNode>, kdesignNode: KdesignNode): KdesignTextNode => {
  const kdesignTextNode: KdesignTextNode = {
    ...kdesignNode,
    type: 'TEXT',
    characters: figmaNode.characters,
    textStyleId: figmaNode.textStyleId,
  };

  return kdesignTextNode;
};

const convertFrameToNode = (
  figmaNode: Readonly<FrameNode>,
  kdesignNode: KdesignNode,
): KdesignFrameNode => {
  const kdesignFrame: KdesignFrameNode = {
    ...kdesignNode,
    type: 'FRAME',
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    children: convertIntoKdesignNodes(figmaNode.children, kdesignNode),
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
  return kdesignFrame;
};

const convertGroupToNode = (
  figmaNode: Readonly<GroupNode>,
  kdesignNode: KdesignNode,
): KdesignGroupNode => {
  const kdesignGroupNode: KdesignGroupNode = {
    ...kdesignNode,
    type: 'GROUP',
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    children: convertIntoKdesignNodes(figmaNode.children, kdesignNode),
    rotation: figmaNode.rotation,
    layoutAlign: figmaNode.layoutAlign,
    layoutGrow: figmaNode.layoutGrow,
    layoutPositioning: figmaNode.layoutPositioning,
  };
  return kdesignGroupNode;
};

const convertVectorToNode = (
  figmaNode: Readonly<VectorNode>,
  kdesignNode: KdesignNode,
): KdesignVectorNode => {
  const kdesignVectorNode: KdesignVectorNode = {
    ...kdesignNode,
    type: 'VECTOR',
    fills: Array.isArray(figmaNode.fills)
      ? figmaNode.fills.filter((fill) => fill.visible)
      : figmaNode.fills,
    fillStyleId: figmaNode.fillStyleId,
  };
  return kdesignVectorNode;
};

export const convertIntoKdesignNodes = (
  figmaNodes: ReadonlyArray<SceneNode>,
  kdesignParent: KdesignNode | null,
): Array<KdesignNode> => {
  const kdesignNodes: KdesignNode[] = [];
  figmaNodes.forEach((figmaNode) => {
    if (!figmaNode.visible) {
      return;
    }

    let kdesignNode = convertBaseNode(figmaNode, kdesignParent);

    switch (figmaNode.type) {
      case 'INSTANCE':
        kdesignNode = convertInstanceToNode(figmaNode, kdesignNode);
        break;
      case 'TEXT':
        kdesignNode = convertTextToNode(figmaNode, kdesignNode);
        break;
      case 'FRAME':
        kdesignNode = convertFrameToNode(figmaNode, kdesignNode);
        break;
      case 'GROUP':
        kdesignNode = convertGroupToNode(figmaNode, kdesignNode);
        break;
      case 'VECTOR':
        kdesignNode = convertVectorToNode(figmaNode, kdesignNode);
        break;
      default:
        break;
    }

    kdesignNodes.push(kdesignNode);
  });

  return kdesignNodes;
};
