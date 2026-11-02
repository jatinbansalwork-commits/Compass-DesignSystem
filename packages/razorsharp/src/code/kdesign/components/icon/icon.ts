import { convertStyleNameToKdesignName, isIconColorToken } from '../../utils/color';
import { component } from '../../utils/component';
import { findNode } from '../../utils/findNode';
import { convertFigmaIconNameToKdesignIconName } from '../../utils/iconUtils';
import { kdesignImports } from '../../utils/imports';
import { defaultValues } from './constants';
import type { TransformFunctionReturnType } from '~/code/types/TransformFunction';
import type {
  KdesignComponentInstanceNode,
  KdesignNode,
  KdesignProps,
  KdesignVectorNode,
} from '~/code/types/Kdesign';

const isKdesignVectorNode = (node: KdesignNode): node is KdesignVectorNode => {
  return node.type === 'VECTOR';
};

export const transformIcon = (
  kdesignInstance: KdesignComponentInstanceNode,
): TransformFunctionReturnType => {
  const props: KdesignProps = {};

  const kdesignIconName = convertFigmaIconNameToKdesignIconName(
    kdesignInstance?.name || 'unidentified-icon',
  );

  // TODO fix mapping of pixels to size
  props.size = {
    value: 'medium',
    type: 'string',
  };

  const vectorNode = findNode(kdesignInstance, (node) => node.type === 'VECTOR');
  if (vectorNode && isKdesignVectorNode(vectorNode)) {
    if (vectorNode.fillStyleId !== figma.mixed) {
      const fillStyle = figma.getStyleById(vectorNode.fillStyleId);
      if (fillStyle) {
        const styleName = fillStyle.name;
        const kdesignTokenName = convertStyleNameToKdesignName(styleName);
        const isValidToken = isIconColorToken(kdesignTokenName);

        props.color = {
          value: kdesignTokenName,
          type: 'string',
          isCommented: !isValidToken,
          comment: isValidToken ? '' : 'Unsupported color token for Icon',
        };
      }
    }
  }

  return {
    component: component(kdesignIconName, {
      props,
      defaultValues,
    }),
    imports: kdesignImports([kdesignIconName]),
  };
};
