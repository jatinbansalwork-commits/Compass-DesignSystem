import type {
  CompassNode,
  CompassComponentInstanceNode,
  CompassFrameNode,
  CompassTextNode,
  CompassGroupNode,
} from '../types/Compass';
import type { TransformFunctionReturnType } from '../types/TransformFunction';
// eslint-disable-next-line import/no-cycle
import {
  generateCompassComponentInstanceCode,
  generateCompassFrameCode,
  generateTextNodeCode,
  generateGroupNodeCode,
} from './components';
import { mergeImports } from './utils/imports';

export const generateCompassCode = ({
  bladeNodes,
}: {
  bladeNodes: CompassNode[];
}): TransformFunctionReturnType => {
  let componentCode = '';
  let allImports = {};

  bladeNodes.forEach((bladeNode) => {
    switch (bladeNode.type) {
      case 'INSTANCE': {
        const { component, imports } = generateCompassComponentInstanceCode(
          bladeNode as CompassComponentInstanceNode,
        );
        componentCode += component;
        allImports = mergeImports(allImports, imports ?? {});
        break;
      }
      case 'FRAME': {
        const { component, imports } = generateCompassFrameCode(bladeNode as CompassFrameNode);
        componentCode += component;
        allImports = mergeImports(allImports, imports ?? {});
        break;
      }
      case 'TEXT': {
        const { component, imports } = generateTextNodeCode(bladeNode as CompassTextNode);
        componentCode += component;
        allImports = mergeImports(allImports, imports ?? {});
        break;
      }

      case 'GROUP': {
        const { component, imports } = generateGroupNodeCode(bladeNode as CompassGroupNode);
        componentCode += component;
        allImports = mergeImports(allImports, imports ?? {});
        break;
      }

      default:
        break;
    }
  });

  return { component: componentCode, imports: allImports };
};
