import { jsxValue } from '../../utils/attributes';
import { component } from '../../utils/component';
import { isPresent } from '../../utils/isPresent';
import { findNode } from '../../utils/findNode';
import { findTextByLayerName } from '../../utils/findTextByLayerName';
import { bladeImports } from '../../utils/imports';
import { defaultValues } from './constants';
import type { TransformFunctionReturnType } from '~/code/types/TransformFunction';
import type { CompassComponentInstanceNode, CompassProps, CompassTextNode } from '~/code/types/Compass';

export const transformAlert = (
  bladeInstance: CompassComponentInstanceNode,
): TransformFunctionReturnType => {
  const componentProperties = bladeInstance.componentProperties;

  const intent = jsxValue(componentProperties.Intent?.value).toLowerCase();

  const contrast = jsxValue(componentProperties.contrast?.value).toLowerCase();

  const isDismissible = jsxValue(componentProperties.isDismissible?.value).toLowerCase();

  const isFullWidth = jsxValue(componentProperties.isFullWidth?.value).toLowerCase();

  const title = findTextByLayerName(bladeInstance, 'title') ?? '';
  const description = findTextByLayerName(bladeInstance, 'message') ?? '';

  const props: CompassProps = {
    intent: {
      type: 'string',
      value: intent,
    },
    contrast: {
      type: 'string',
      value: contrast,
    },
    isDismissible: {
      type: 'boolean',
      value: isDismissible,
    },
    isFullWidth: {
      type: 'boolean',
      value: isFullWidth,
    },
    title: {
      type: 'string',
      value: title,
    },
    description: {
      type: 'string',
      value: description,
    },
  };

  const isPrimaryActionPresent = isPresent(componentProperties.primaryAction?.value);
  const isSecondaryActionPresent = isPresent(componentProperties.secondaryAction?.value);

  let actions = '{';

  if (isPrimaryActionPresent) {
    const primaryActionBaseWrapper = findNode(
      bladeInstance,
      (node) => node.type === 'INSTANCE' && node.layerName === '_CButton',
    ) as CompassComponentInstanceNode;

    const actionBaseNode = primaryActionBaseWrapper.children[0] as CompassComponentInstanceNode;
    const textNode = actionBaseNode.children[0] as CompassTextNode;
    const text = textNode.characters;
    actions += `primary: { text: "${text}" }, `;
  }

  if (isSecondaryActionPresent) {
    const primaryActionBaseWrapper = findNode(
      bladeInstance,
      (node) => node.type === 'INSTANCE' && node.layerName === '_CLink',
    ) as CompassComponentInstanceNode;

    const actionBaseNode = primaryActionBaseWrapper.children[0] as CompassComponentInstanceNode;
    const textNode = actionBaseNode.children[0] as CompassTextNode;
    const text = textNode.characters;
    actions += `secondary: { text: "${text}" }`;
  }

  actions += '}';

  props.actions = {
    type: 'instance',
    value: actions,
  };

  return {
    component: component('Alert', {
      props,
      defaultValues,
    }),
    imports: bladeImports(['Alert']),
  };
};
