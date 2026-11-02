import { component } from '../../utils/component';
import { kdesignImports } from '../../utils/imports';
import {
  getComponentName,
  getComponentVariant,
  getDefaultValues,
  getSize,
  getWeight,
} from './utils';
import type { TransformFunctionReturnType } from '~/code/types/TransformFunction';
import type { KdesignProps, KdesignTextNode } from '~/code/types/Kdesign';

export const transformTextNode = (kdesignTextNode: KdesignTextNode): TransformFunctionReturnType => {
  let styleName = '';

  if (typeof kdesignTextNode.textStyleId === 'string') {
    const style = figma.getStyleById(kdesignTextNode.textStyleId);
    // "Desktop/TitleMedium"
    styleName = style?.name ?? '';
  }

  if (styleName.length === 0) {
    return {
      component: component('Text', {
        props: {},
        defaultValues: {},
        children: kdesignTextNode.characters,
      }),
      imports: kdesignImports(['Text']),
    };
  }

  const variant = getComponentVariant(styleName) || '';
  const weight = getWeight(styleName) || '';
  const name = getComponentName(variant);
  const defaultValues = getDefaultValues(name);
  const size = getSize(styleName);

  const props: KdesignProps = {
    variant: { value: variant, type: 'string' },
    weight: { value: weight, type: 'string' },
    size: { value: size, type: 'string' },
  };

  return {
    component: component(name, {
      props,
      defaultValues,
      children: kdesignTextNode.characters,
    }),
    imports: kdesignImports([name]),
  };
};
