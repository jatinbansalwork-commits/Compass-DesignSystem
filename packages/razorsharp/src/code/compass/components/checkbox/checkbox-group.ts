import { jsxValue } from '../../utils/attributes';
import { component } from '../../utils/component';
import { isPresent } from '../../utils/isPresent';
import { findNode } from '../../utils/findNode';
import { bladeImports, mergeImports } from '../../utils/imports';
import { transformCheckbox } from './checkbox';
import { checkboxDefaultValues } from './constants';
import type { TransformFunctionReturnType } from '~/code/types/TransformFunction';
import type {
  CompassComponentInstanceNode,
  CompassFrameNode,
  CompassProps,
  CompassTextNode,
} from '~/code/types/Compass';

export const transformCheckboxGroup = (
  bladeInstance: CompassComponentInstanceNode,
): TransformFunctionReturnType => {
  const labelTextNode = findNode(
    bladeInstance,
    (node) =>
      node.layerName === 'Label' &&
      node.type === 'TEXT' &&
      node.parent?.layerName === 'Label Holder',
  );
  const label = (labelTextNode as CompassTextNode)?.characters;

  const isHelpTextPresent = isPresent(bladeInstance.componentProperties.helpText?.value);

  let helpText = '';
  if (isHelpTextPresent) {
    const helpTextNode = findNode(
      bladeInstance,
      (node) =>
        node.layerName === 'Help Text' &&
        node.type === 'TEXT' &&
        node.parent?.layerName === 'Help Group',
    );
    helpText = (helpTextNode as CompassTextNode)?.characters;
  }

  const size = jsxValue(bladeInstance.componentProperties.size?.value).toLowerCase();

  const props: CompassProps = {
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
    bladeInstance,
    (node) => node.layerName === 'Checkbox Group' && node.type === 'FRAME',
  ) as CompassFrameNode;

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
    imports: mergeImports(imports ?? {}, bladeImports(['CheckboxGroup'])),
  };
};
