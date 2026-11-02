import { isIconInstance } from '../utils/iconUtils';
import { transformAlert } from './alert';
import { transformBadge } from './badge';
// eslint-disable-next-line import/no-cycle
import { transformFrameOrGroup } from './box';
import { transformButton } from './button';
import { transformCheckbox, transformCheckboxGroup } from './checkbox';
import { transformCounter } from './counter';
import { transformIcon } from './icon';
import { transformIconButton } from './iconButton';
import { transformIndicator } from './indicator';
import {
  transformOtpInput,
  transformPasswordInput,
  transformSelectInput,
  transformTextArea,
  transformTextInput,
} from './input';
import { transformLink } from './link';
import { transformProgressBar } from './progressBar';
import { transformRadio, transformRadioGroup } from './radio';
import { transformSpinner } from './spinner';
import {
  transformTitle,
  transformHeading,
  transformText,
  transformCode,
  transformTextNode,
} from './typography';
import type { TransformFunctionReturnType } from '~/code/types/TransformFunction';
import type {
  KdesignComponentInstanceNode,
  KdesignFrameNode,
  KdesignGroupNode,
  KdesignTextNode,
} from '~/code/types/Kdesign';

const getUnknownComponentOutput = (
  component: KdesignComponentInstanceNode,
): TransformFunctionReturnType => {
  return {
    component: `
  {/* 
    ${component.name} is either not supported yet or not a part of Kdesign.
    <${component.name} /> 
  */}`,
    imports: {},
  };
};

export const generateKdesignComponentInstanceCode = (
  kdesignComponentInstance: KdesignComponentInstanceNode,
): TransformFunctionReturnType => {
  // check if component instance is an icon
  const isIcon = isIconInstance(kdesignComponentInstance);
  if (isIcon) return transformIcon(kdesignComponentInstance);

  // handle all other components
  switch (kdesignComponentInstance.name) {
    case 'Button':
      return transformButton(kdesignComponentInstance);
    case 'Text Input':
      return transformTextInput(kdesignComponentInstance);
    case 'Badge':
      return transformBadge(kdesignComponentInstance);
    case 'Link':
      return transformLink(kdesignComponentInstance);
    case 'Checkbox':
      return transformCheckbox(kdesignComponentInstance);
    case 'Title':
      return transformTitle(kdesignComponentInstance);
    case 'Heading':
      return transformHeading(kdesignComponentInstance);
    case 'Text':
      return transformText(kdesignComponentInstance);
    case 'Code':
      return transformCode(kdesignComponentInstance);
    case 'Radio-Button':
      return transformRadio(kdesignComponentInstance);
    case 'Checkbox-Group':
      return transformCheckboxGroup(kdesignComponentInstance);
    case 'Radio-Group':
      return transformRadioGroup(kdesignComponentInstance);
    case 'Alert':
      return transformAlert(kdesignComponentInstance);
    case 'Spinner':
      return transformSpinner(kdesignComponentInstance);
    case 'TextArea Input':
      return transformTextArea(kdesignComponentInstance);
    case 'Password Input':
      return transformPasswordInput(kdesignComponentInstance);
    case 'OTP Input':
      return transformOtpInput(kdesignComponentInstance);
    case 'Counter':
      return transformCounter(kdesignComponentInstance);
    case 'IconButton':
      return transformIconButton(kdesignComponentInstance);
    case 'Indicators':
      return transformIndicator(kdesignComponentInstance);
    case 'ProgressBar':
      return transformProgressBar(kdesignComponentInstance);
    case 'Select Input':
      return transformSelectInput(kdesignComponentInstance);
    default:
      return getUnknownComponentOutput(kdesignComponentInstance);
  }
};

export const generateKdesignFrameCode = (kdesignNode: KdesignFrameNode): TransformFunctionReturnType => {
  return transformFrameOrGroup(kdesignNode);
};

export const generateTextNodeCode = (kdesignNode: KdesignTextNode): TransformFunctionReturnType => {
  return transformTextNode(kdesignNode);
};

export const generateGroupNodeCode = (kdesignNode: KdesignGroupNode): TransformFunctionReturnType => {
  return transformFrameOrGroup(kdesignNode);
};
