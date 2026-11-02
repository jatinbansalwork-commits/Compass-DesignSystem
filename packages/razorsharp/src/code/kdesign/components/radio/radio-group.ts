import { jsxValue } from '../../utils/attributes';
import { component } from '../../utils/component';
import { isPresent } from '../../utils/isPresent';
import { findNode } from '../../utils/findNode';
import { kdesignImports, mergeImports } from '../../utils/imports';
import { transformRadio } from './radio';
import { defaultValues } from './constants';
import type { TransformFunctionReturnType } from '~/code/types/TransformFunction';
import type {
  KdesignComponentInstanceNode,
  KdesignFrameNode,
  KdesignProps,
  KdesignTextNode,
} from '~/code/types/Kdesign';

export const transformRadioGroup = (
  kdesignInstance: KdesignComponentInstanceNode,
): TransformFunctionReturnType => {
  const labelTextNode = findNode(
    kdesignInstance,
    (node) =>
      node.layerName === 'Label' &&
      node.type === 'TEXT' &&
      node.parent?.layerName === 'Label Holder',
  );
  const label = (labelTextNode as KdesignTextNode)?.characters;

  const isHelpTextPresent = isPresent(kdesignInstance.componentProperties.helpText?.value);

  let helpText = '';
  if (isHelpTextPresent) {
    const helpTextNode = findNode(
      kdesignInstance,
      (node) =>
        node.layerName === 'Help Text' &&
        node.type === 'TEXT' &&
        node.parent?.layerName === 'Help Group',
    );
    helpText = (helpTextNode as KdesignTextNode)?.characters;
  }

  const size = jsxValue(kdesignInstance.componentProperties.size?.value).toLowerCase();

  const props: KdesignProps = {
    label: {
      value: label,
      type: 'string',
    },
    helpText: {
      value: helpText,
      type: 'string',
    },
    size: {
      type: 'string',
      value: size,
    },
  };

  const childrenWrapper = findNode(
    kdesignInstance,
    (node) => node.layerName === 'Radio Button Group' && node.type === 'FRAME',
  ) as KdesignFrameNode;

  const { component: children, imports } = childrenWrapper.children.map(transformRadio).reduce(
    (acc, val) => {
      acc.component = `${acc.component}${val.component}`;
      acc.imports = mergeImports(acc.imports ?? {}, val.imports ?? {});
      return acc;
    },
    {
      component: '',
      imports: {},
    },
  );

  return {
    component: component('RadioGroup', {
      props,
      defaultValues,
      children,
    }),
    imports: mergeImports(imports ?? {}, kdesignImports(['RadioGroup'])),
  };
};
