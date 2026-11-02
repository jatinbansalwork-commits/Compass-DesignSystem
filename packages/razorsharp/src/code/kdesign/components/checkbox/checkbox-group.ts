import { jsxValue } from '../../utils/attributes';
import { component } from '../../utils/component';
import { isPresent } from '../../utils/isPresent';
import { findNode } from '../../utils/findNode';
import { kdesignImports, mergeImports } from '../../utils/imports';
import { transformCheckbox } from './checkbox';
import { checkboxDefaultValues } from './constants';
import type { TransformFunctionReturnType } from '~/code/types/TransformFunction';
import type {
  KdesignComponentInstanceNode,
  KdesignFrameNode,
  KdesignProps,
  KdesignTextNode,
} from '~/code/types/Kdesign';

export const transformCheckboxGroup = (
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
    (node) => node.layerName === 'Checkbox Group' && node.type === 'FRAME',
  ) as KdesignFrameNode;

  const { component: children, imports } = childrenWrapper.children.map(transformCheckbox).reduce(
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
    component: component('CheckboxGroup', {
      props,
      defaultValues: checkboxDefaultValues,
      children,
    }),
    imports: mergeImports(imports ?? {}, kdesignImports(['CheckboxGroup'])),
  };
};
