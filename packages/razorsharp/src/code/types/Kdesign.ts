export interface BaseNode {
  layerName: string;
  id: string;
  type: SceneNode['type'];
  parent: KdesignNode | null;
}

type KdesignComponentProperties = {
  [key: string]: { type: ComponentPropertyType; value: string | boolean } | undefined;
};

export interface KdesignComponentInstanceNode extends BaseNode {
  componentProperties: KdesignComponentProperties;
  type: InstanceNode['type'];
  children: KdesignNode[];
  name: string | null;
  fills: InstanceNode['fills'];
  fillStyleId: InstanceNode['fillStyleId'];
  width: InstanceNode['width'];
  height: InstanceNode['height'];
}

export type KdesignNode =
  | KdesignComponentInstanceNode
  | KdesignFrameNode
  | KdesignTextNode
  | KdesignGroupNode
  | KdesignVectorNode
  | KdesignRectangleNode
  | BaseNode;

export interface KdesignFrameNode extends BaseNode {
  type: FrameNode['type'];
  children: KdesignNode[];
  layoutMode: FrameNode['layoutMode'];
  primaryAxisAlignItems: FrameNode['primaryAxisAlignItems'];
  primaryAxisSizingMode: FrameNode['primaryAxisSizingMode'];
  counterAxisAlignItems: FrameNode['counterAxisAlignItems'];
  counterAxisSizingMode: FrameNode['counterAxisSizingMode'];
  paddingLeft: FrameNode['paddingLeft'];
  paddingRight: FrameNode['paddingRight'];
  paddingBottom: FrameNode['paddingBottom'];
  paddingTop: FrameNode['paddingTop'];
  itemSpacing: FrameNode['itemSpacing'];
  width: FrameNode['width'];
  height: FrameNode['height'];
  fills: FrameNode['fills'];
  fillStyleId: FrameNode['fillStyleId'];
  layoutSizingVertical: FrameNode['layoutSizingVertical'];
  layoutSizingHorizontal: FrameNode['layoutSizingHorizontal'];
  inferredAutoLayout: FrameNode['inferredAutoLayout'];
  maxWidth: FrameNode['maxWidth'];
  maxHeight: FrameNode['maxHeight'];
}

export interface KdesignTextNode extends BaseNode {
  characters: TextNode['characters'];
  type: TextNode['type'];
  textStyleId: TextNode['textStyleId'];
}

export interface KdesignGroupNode extends BaseNode {
  type: 'GROUP';
  children: KdesignNode[];
  rotation: GroupNode['rotation'];
  layoutAlign: GroupNode['layoutAlign'];
  layoutGrow: GroupNode['layoutGrow'];
  layoutPositioning: GroupNode['layoutPositioning'];
}

export interface KdesignVectorNode extends BaseNode {
  type: VectorNode['type'];
  fillStyleId: VectorNode['fillStyleId'];
  fills: VectorNode['fills'];
}

export interface KdesignRectangleNode extends BaseNode {
  type: RectangleNode['type'];
}

type JSXType = 'string' | 'boolean' | 'number' | 'instance';

export type JSXValue = {
  type: JSXType;
  value: string;
  isCommented?: boolean;
  comment?: string;
};

export type KdesignProps = Record<string, JSXValue>;

export type KdesignHelperProps = Record<string, JSXType>;
