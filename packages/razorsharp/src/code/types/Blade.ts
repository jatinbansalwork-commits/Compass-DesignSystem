export interface BaseNode {
  layerName: string;
  id: string;
  type: SceneNode['type'];
  parent: CompassNode | null;
}

type CompassComponentProperties = {
  [key: string]: { type: ComponentPropertyType; value: string | boolean } | undefined;
};

export interface CompassComponentInstanceNode extends BaseNode {
  componentProperties: CompassComponentProperties;
  type: InstanceNode['type'];
  children: CompassNode[];
  name: string | null;
  fills: InstanceNode['fills'];
  fillStyleId: InstanceNode['fillStyleId'];
  width: InstanceNode['width'];
  height: InstanceNode['height'];
}

export type CompassNode =
  | CompassComponentInstanceNode
  | CompassFrameNode
  | CompassTextNode
  | CompassGroupNode
  | CompassVectorNode
  | CompassRectangleNode
  | BaseNode;

export interface CompassFrameNode extends BaseNode {
  type: FrameNode['type'];
  children: CompassNode[];
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

export interface CompassTextNode extends BaseNode {
  characters: TextNode['characters'];
  type: TextNode['type'];
  textStyleId: TextNode['textStyleId'];
}

export interface CompassGroupNode extends BaseNode {
  type: 'GROUP';
  children: CompassNode[];
  rotation: GroupNode['rotation'];
  layoutAlign: GroupNode['layoutAlign'];
  layoutGrow: GroupNode['layoutGrow'];
  layoutPositioning: GroupNode['layoutPositioning'];
}

export interface CompassVectorNode extends BaseNode {
  type: VectorNode['type'];
  fillStyleId: VectorNode['fillStyleId'];
  fills: VectorNode['fills'];
}

export interface CompassRectangleNode extends BaseNode {
  type: RectangleNode['type'];
}

type JSXType = 'string' | 'boolean' | 'number' | 'instance';

export type JSXValue = {
  type: JSXType;
  value: string;
  isCommented?: boolean;
  comment?: string;
};

export type CompassProps = Record<string, JSXValue>;

export type CompassHelperProps = Record<string, JSXType>;
