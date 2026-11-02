// eslint-disable-next-line import/no-cycle
import { generateKdesignCode } from '../../main';
import { convertStyleNameToKdesignName, isBackgroundColorToken } from '../../utils/color';
import { component } from '../../utils/component';
import { kdesignImports, mergeImports } from '../../utils/imports';
import { getPaddingValue, getTokenFromSpacingValue } from '../../utils/spacing';
import { defaultValues, LAYOUT_MODES } from './constants';
import { getFlexAlignmentFromAxisAlignment } from './utils';
import type { TransformFunctionReturnType } from '~/code/types/TransformFunction';
import type { KdesignFrameNode, KdesignGroupNode, KdesignProps } from '~/code/types/Kdesign';

export const transformFrameOrGroup = (
  kdesignFrame: KdesignFrameNode | KdesignGroupNode,
): TransformFunctionReturnType => {
  const props: KdesignProps = {};

  // TODO groups can have item spacing as well
  // since item spacing figma property does not exist
  // for groups, use relative transform matrix to find the
  // distances between elements in a group
  if (kdesignFrame.type === 'GROUP') {
    let children: TransformFunctionReturnType = { component: '', imports: {} };
    if (kdesignFrame.children && kdesignFrame.children.length > 0) {
      children = generateKdesignCode({
        kdesignNodes: kdesignFrame.children,
      });
    }

    return {
      component: component('Box', {
        props,
        defaultValues,
        children: children.component,
      }),
      imports: mergeImports(children.imports ?? {}, kdesignImports(['Box'])),
    };
  }

  // --- Frame specific code below ---
  // --- Layout mode specific code below ---
  // TODO set alignItems and justifyContent when items don't fill the entire space
  if (
    kdesignFrame.layoutMode === LAYOUT_MODES.VERTICAL ||
    kdesignFrame.layoutMode === LAYOUT_MODES.HORIZONTAL
  ) {
    props.display = {
      value: 'flex',
      type: 'string',
    };

    props.flexDirection = {
      value: kdesignFrame.layoutMode === 'VERTICAL' ? 'column' : 'row',
      type: 'string',
    };

    props.gap = {
      value: getTokenFromSpacingValue(kdesignFrame.itemSpacing),
      type: 'string',
    };

    const justifyContent = getFlexAlignmentFromAxisAlignment(kdesignFrame.primaryAxisAlignItems);
    const alignItems = getFlexAlignmentFromAxisAlignment(kdesignFrame.counterAxisAlignItems);

    props.justifyContent = { value: justifyContent, type: 'string' };
    props.alignItems = { value: alignItems, type: 'string' };

    const paddingValue = getPaddingValue({
      top: kdesignFrame.paddingTop,
      right: kdesignFrame.paddingRight,
      bottom: kdesignFrame.paddingBottom,
      left: kdesignFrame.paddingLeft,
    });
    // always generate an array. easier to generate this syntax
    // since it works in all cases
    props.padding = {
      value:
        paddingValue.length > 1
          ? `[${paddingValue.map((value) => `"${value}"`).join(', ')}]`
          : paddingValue[0],
      type: paddingValue.length > 1 ? 'instance' : 'string',
    };

    if (kdesignFrame.maxHeight) {
      props.maxHeight = {
        value: getTokenFromSpacingValue(kdesignFrame.maxHeight),
        type: 'string',
      };
    }

    if (kdesignFrame.maxWidth) {
      props.maxWidth = {
        value: getTokenFromSpacingValue(kdesignFrame.maxWidth),
        type: 'string',
      };
    }

    if (kdesignFrame.layoutSizingVertical === 'FIXED') {
      props.height = {
        value: getTokenFromSpacingValue(kdesignFrame.height),
        type: 'string',
      };
    }

    if (kdesignFrame.layoutSizingHorizontal === 'FIXED') {
      props.width = {
        value: getTokenFromSpacingValue(kdesignFrame.width),
        type: 'string',
      };
    }

    if (
      (kdesignFrame.layoutSizingVertical === 'FILL' &&
        kdesignFrame.layoutMode === LAYOUT_MODES.VERTICAL) ||
      (kdesignFrame.layoutSizingHorizontal === 'FILL' &&
        kdesignFrame.layoutMode === LAYOUT_MODES.HORIZONTAL)
    ) {
      props.flex = {
        value: '1',
        type: 'string',
      };
    }
  }
  // --- Layout mode specific end ---

  // TODO add support for fills array
  // TODO handle figma.mixed
  // --- Background color ---
  if (kdesignFrame.fillStyleId !== figma.mixed) {
    const fillStyle = figma.getStyleById(kdesignFrame.fillStyleId);
    if (fillStyle) {
      const styleName = fillStyle.name;
      const kdesignTokenName = convertStyleNameToKdesignName(styleName);
      const isValidToken = isBackgroundColorToken(kdesignTokenName);

      props.backgroundColor = {
        value: kdesignTokenName,
        type: 'string',
        isCommented: !isValidToken,
        comment: isValidToken
          ? ''
          : 'Only surface.background tokens are supported by Box component',
      };
    }
  }

  let children: TransformFunctionReturnType = { component: '', imports: {} };
  if (kdesignFrame.children && kdesignFrame.children.length > 0) {
    children = generateKdesignCode({
      kdesignNodes: kdesignFrame.children,
    });
  }

  return {
    component: component('Box', {
      props,
      defaultValues,
      children: children.component,
    }),
    imports: mergeImports(children.imports ?? {}, kdesignImports(['Box'])),
  };
};
