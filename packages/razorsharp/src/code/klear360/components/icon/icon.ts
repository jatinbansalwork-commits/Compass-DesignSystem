import { convertStyleNameToKlear360Name, isIconColorToken } from '../../utils/color';
import { component } from '../../utils/component';
import { findNode } from '../../utils/findNode';
import { convertFigmaIconNameToKlear360IconName } from '../../utils/iconUtils';
import { bladeImports } from '../../utils/imports';
import { defaultValues } from './constants';
import type { TransformFunctionReturnType } from '~/code/types/TransformFunction';
import type {
  Klear360ComponentInstanceNode,
  Klear360Node,
  Klear360Props,
  Klear360VectorNode,
} from '~/code/types/Klear360';

const isKlear360VectorNode = (node: Klear360Node): node is Klear360VectorNode => {
  return node.type === 'VECTOR';
};

export const transformIcon = (
  bladeInstance: Klear360ComponentInstanceNode,
): TransformFunctionReturnType => {
  const props: Klear360Props = {};

  const bladeIconName = convertFigmaIconNameToKlear360IconName(
    bladeInstance?.name || 'unidentified-icon',
  );

  // TODO fix mapping of pixels to size
  props.size = {
    value: 'medium',
    type: 'string',
  };

  const vectorNode = findNode(bladeInstance, (node) => node.type === 'VECTOR');
  if (vectorNode && isKlear360VectorNode(vectorNode)) {
    if (vectorNode.fillStyleId !== figma.mixed) {
      const fillStyle = figma.getStyleById(vectorNode.fillStyleId);
      if (fillStyle) {
        const styleName = fillStyle.name;
        const bladeTokenName = convertStyleNameToKlear360Name(styleName);
        const isValidToken = isIconColorToken(bladeTokenName);

        props.color = {
          value: bladeTokenName,
          type: 'string',
          isCommented: !isValidToken,
          comment: isValidToken ? '' : 'Unsupported color token for Icon',
        };
      }
    }
  }

  return {
    component: component(bladeIconName, {
      props,
      defaultValues,
    }),
    imports: bladeImports([bladeIconName]),
  };
};
