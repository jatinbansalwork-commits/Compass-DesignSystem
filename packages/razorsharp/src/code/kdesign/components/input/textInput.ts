import { jsxValue } from '../../utils/attributes';
import { component } from '../../utils/component';
import { isPresent } from '../../utils/isPresent';
import { findTextByLayerName } from '../../utils/findTextByLayerName';
import { kdesignImports } from '../../utils/imports';
import { defaultValues, helpers } from './constants';
import type { TransformFunctionReturnType } from '~/code/types/TransformFunction';
import type { KdesignComponentInstanceNode, KdesignProps } from '~/code/types/Kdesign';

export const transformTextInput = (
  kdesignComponentInstance: KdesignComponentInstanceNode,
): TransformFunctionReturnType => {
  const componentProperties = kdesignComponentInstance.componentProperties;

  const isHelpTextPresent = isPresent(componentProperties.helpText?.value);

  // TODO handle icon
  // const isIconPresent = isPresent(componentProperties.icon?.value);

  const isMaxCharactersPresent = isPresent(componentProperties.maxCharacters?.value);
  const isPrefixPresent = isPresent(componentProperties.prefix?.value);
  const isSuffixPresent = isPresent(componentProperties.prefix?.value);

  const props: KdesignProps = {
    labelPosition: {
      value: jsxValue(componentProperties.labelPosition?.value).toLowerCase(),
      type: 'string',
    },
    showClearButton: {
      value: jsxValue(componentProperties.showClearButton?.value),
      type: 'boolean',
    },
  };

  props.label = {
    value: findTextByLayerName(kdesignComponentInstance, 'Label') ?? '',
    type: 'string',
  };

  props.placeholder = {
    value: findTextByLayerName(kdesignComponentInstance, 'Placeholder') ?? '',
    type: 'string',
  };

  if (isHelpTextPresent) {
    props.helpText = {
      value: findTextByLayerName(kdesignComponentInstance, 'Help Text') ?? '',
      type: 'string',
    };
  }

  if (isMaxCharactersPresent) {
    const maxCharactersCountSplit = (
      findTextByLayerName(kdesignComponentInstance, 'Char Count') ?? ''
    ).split('/');

    props.maxCharacters = {
      value: maxCharactersCountSplit.length > 1 ? maxCharactersCountSplit[1] : '',
      type: 'number',
    };
  }

  if (isSuffixPresent) {
    props.suffix = {
      value: findTextByLayerName(kdesignComponentInstance, 'Trailing Label') ?? '',
      type: 'string',
    };
  }

  if (isPrefixPresent) {
    props.prefix = {
      value: findTextByLayerName(kdesignComponentInstance, 'Leading Label') ?? '',
      type: 'string',
    };
  }

  return {
    component: component('TextInput', { props, defaultValues, helpers }),
    imports: kdesignImports(['TextInput']),
  };
};
