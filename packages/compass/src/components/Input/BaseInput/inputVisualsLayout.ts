import type { BaseInputProps } from './baseInputProps.types';

export type InputVisualsLayoutProps = Pick<
  BaseInputProps,
  | 'leadingIcon'
  | 'prefix'
  | 'trailingInteractionElement'
  | 'leadingInteractionElement'
  | 'suffix'
  | 'trailingIcon'
  | 'trailingButton'
  | 'leadingDropDown'
  | 'trailingDropDown'
>;

export const getInputVisualsToBeRendered = ({
  leadingIcon,
  prefix,
  trailingInteractionElement,
  leadingInteractionElement,
  suffix,
  trailingIcon,
  trailingButton,
  leadingDropDown,
  trailingDropDown,
}: InputVisualsLayoutProps) => ({
  hasLeadingIcon: Boolean(leadingIcon),
  hasPrefix: Boolean(prefix),
  hasTrailingInteractionElement: Boolean(trailingInteractionElement),
  hasLeadingInteractionElement: Boolean(leadingInteractionElement),
  hasSuffix: Boolean(suffix),
  hasTrailingIcon: Boolean(trailingIcon),
  hasTrailingButton: Boolean(trailingButton),
  hasLeadingDropDown: Boolean(leadingDropDown),
  hasTrailingDropDown: Boolean(trailingDropDown),
});
