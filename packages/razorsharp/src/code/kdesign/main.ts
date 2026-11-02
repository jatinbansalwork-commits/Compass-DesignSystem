import type {
  KdesignNode,
  KdesignComponentInstanceNode,
  KdesignFrameNode,
  KdesignTextNode,
  KdesignGroupNode,
} from '../types/Kdesign';
import type { TransformFunctionReturnType } from '../types/TransformFunction';
// eslint-disable-next-line import/no-cycle
import {
  generateKdesignComponentInstanceCode,
  generateKdesignFrameCode,
  generateTextNodeCode,
  generateGroupNodeCode,
} from './components';
import { mergeImports } from './utils/imports';

export const generateKdesignCode = ({
  kdesignNodes,
}: {
  kdesignNodes: KdesignNode[];
}): TransformFunctionReturnType => {
  let componentCode = '';
  let allImports = {};

  kdesignNodes.forEach((kdesignNode) => {
    switch (kdesignNode.type) {
      case 'INSTANCE': {
        const { component, imports } = generateKdesignComponentInstanceCode(
          kdesignNode as KdesignComponentInstanceNode,
        );
        componentCode += component;
        allImports = mergeImports(allImports, imports ?? {});
        break;
      }
      case 'FRAME': {
        const { component, imports } = generateKdesignFrameCode(kdesignNode as KdesignFrameNode);
        componentCode += component;
        allImports = mergeImports(allImports, imports ?? {});
        break;
      }
      case 'TEXT': {
        const { component, imports } = generateTextNodeCode(kdesignNode as KdesignTextNode);
        componentCode += component;
        allImports = mergeImports(allImports, imports ?? {});
        break;
      }

      case 'GROUP': {
        const { component, imports } = generateGroupNodeCode(kdesignNode as KdesignGroupNode);
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
