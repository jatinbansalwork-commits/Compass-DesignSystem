import React from 'react';
import type { SliderInputProps } from './types';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { throwKlear360Error } from '~utils/logger';
import { MetaConstants } from '~utils/metaAttribute';
import type { Klear360ElementRef } from '~utils/types';

/**
 * SliderInput is web-only for now.
 *
 * The track relies on `mask-image` compositing to punch the marker cut-outs, which has no
 * equivalent in React Native's style system. A native version needs a different drawing
 * approach (SVG or overlaid views) and its own gesture handling, so it is deliberately left
 * out rather than shipped as a lookalike that drifts from the web behaviour.
 */
const _SliderInput = (
  _props: SliderInputProps,
  _ref: React.Ref<Klear360ElementRef>,
): React.ReactElement | null => {
  throwKlear360Error({
    message: 'SliderInput is not supported on React Native yet.',
    moduleName: 'SliderInput',
  });

  return null;
};

const SliderInput = assignWithoutSideEffects(React.forwardRef(_SliderInput), {
  componentId: MetaConstants.SliderInput,
  displayName: 'SliderInput',
});

export { SliderInput };
