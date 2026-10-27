import { convertStyleNameToCompassName, isIconColorToken } from '../../utils/color';
import { component } from '../../utils/component';
import { findNode } from '../../utils/findNode';
import { convertFigmaIconNameToCompassIconName } from '../../utils/iconUtils';
import { bladeImports } from '../../utils/imports';
import { defaultValues } from './constants';
import type { TransformFunctionReturnType } from '~/code/types/TransformFunction';
import type {
  CompassComponentInstanceNode,
  CompassNode,
  CompassProps,
  CompassVectorNode,
} from '~/code/types/Compass';

const isCompassVectorNode = (node: CompassNode): node is CompassVectorNode => {
  return node.type === 'VECTOR';
};

export const transformIcon = (
  bladeInstance: CompassComponentInstanceNode,
): TransformFunctionReturnType => {
  const props: CompassProps = {};

  const bladeIconName = convertFigmaIconNameToCompassIconName(
    bladeInstance?.name || 'unidentified-icon',
  );

  // TODO fix mapping of pixels to size
  props.size = {
    value: 'medium',
    type: 'string',
  };

  const vectorNode = findNode(bladeInstance, (node) => node.type === 'VECTOR');
  if (vectorNode && isCompassVectorNode(vectorNode)) {
    if (vectorNode.fillStyleId !== figma.mixed) {
      const fillStyle = figma.getStyleById(vectorNode.fillStyleId);
      if (fillStyle) {
        const styleName = fillStyle.name;
        const bladeTokenName = convertStyleNameToCompassName(styleName);
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
