import { jsxValue } from '../../utils/attributes';
import { component } from '../../utils/component';
import { findTextByLayerName } from '../../utils/findTextByLayerName';
import { kdesignImports } from '../../utils/imports';
import { defaultValues } from './constants';
import type { TransformFunctionReturnType } from '~/code/types/TransformFunction';
import type { KdesignComponentInstanceNode, KdesignProps } from '~/code/types/Kdesign';

export const transformProgressBar = (
  kdesignComponentInstance: KdesignComponentInstanceNode,
): TransformFunctionReturnType => {
  const componentProperties = kdesignComponentInstance.componentProperties;

  const intent = jsxValue(componentProperties.intent?.value).toLowerCase();
  const size = jsxValue(componentProperties.size?.value).toLowerCase();

  const props: KdesignProps = {
    // TODO figma has "none" as a value for intent, but we don't have that in kdesign
    intent: {
      value: intent === 'none' ? 'neutral' : intent,
      type: 'string',
    },
    // TODO figma sizes don't match kdesign sizes
    size: {
      value: size === 'large' ? 'medium' : size,
      type: 'string',
    },
    contrast: {
      value: jsxValue(componentProperties.contrast?.value).toLowerCase(),
      type: 'string',
    },
    isIndeterminate: {
      value: jsxValue(componentProperties.isIndeterminate?.value).toLowerCase(),
      type: 'boolean',
    },
    showPercentage: {
      value: jsxValue(componentProperties.showPercentage?.value).toLowerCase(),
      type: 'boolean',
    },
    label: {
      type: 'string',
      value: findTextByLayerName(kdesignComponentInstance, 'Label') ?? '',
    },
  };

  return {
    component: component('ProgressBar', { props, defaultValues }),
    imports: kdesignImports(['ProgressBar']),
  };
};
