/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import styled from 'styled-components';
import { StyledBaseInput } from './StyledBaseInput';
import { BaseInputVisuals } from './BaseInputVisuals';
import { BaseInputWrapper } from './BaseInputWrapper';
import { BaseInputTagSlot } from './BaseInputTagSlot';
import type { InputWrapperRef } from './types';
import {
  baseInputBorderBackgroundMotion,
  baseInputBorderRadius,
  formHintLeftLabelMarginLeft,
} from './baseInputTokens';
import type { FormInputHandleOnEvent, FormHintProps } from '~components/Form';
import { AnimatedFormHint, FormHint, FormLabel } from '~components/Form';
import BaseBox from '~components/Box/BaseBox';
import { getStyledProps } from '~components/Box/styledProps';
import {
  castWebType,
  getPlatformType,
  isReactNative,
  makeBorderSize,
  makeMotionTime,
  useBreakpoint,
} from '~utils';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { useFormId } from '~components/Form/useFormId';
import { useTheme } from '~components/Klear360Provider';
import useInteraction from '~utils/useInteraction';
import type { ActionStates } from '~utils/useInteraction';
import type {
  FormInputHandleOnClickEvent,
  FormInputHandleOnKeyDownEvent,
} from '~components/Form/FormTypes';
import type { Klear360ElementRef } from '~utils/types';
import { makeSize } from '~utils/makeSize';
import { makeAccessible } from '~utils/makeAccessible';
import { throwKlear360Error, logger } from '~utils/logger';
import { announce } from '~components/LiveAnnouncer/LiveAnnouncer';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { getFocusRingStyles } from '~utils/getFocusRingStyles';
import getIn from '~utils/lodashButBetter/get';
import { useMergeRefs } from '~utils/useMergeRefs';
import { getInnerMotionRef, getOuterMotionRef } from '~utils/getMotionRefs';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import { useInputGroupContext } from '~components/InputGroup/InputGroupContext';
import { useCounterInputContext } from '~components/CounterInput/CounterInputContext';

import type { BaseInputProps } from './baseInputProps.types';
export type { BaseInputProps } from './baseInputProps.types';

const autoCompleteSuggestionTypeValues = [
  'none',
  'on',
  'name',
  'email',
  'username',
  'password',
  'newPassword',
  'oneTimeCode',
  'telephone',
  'postalCode',
  'countryName',
  'creditCardNumber',
  'creditCardCSC',
  'creditCardExpiry',
  'creditCardExpiryMonth',
  'creditCardExpiryYear',
];

type OnInputKeydownTagHandlerType = (key: string | undefined) => void;
const useTags = (
  tags: BaseInputProps['tags'],
  activeTagIndex: number,
  setActiveTagIndex?: (activeTagIndex: number) => void,
): {
  onInputKeydownTagHandler: OnInputKeydownTagHandlerType;
  visibleTagsCountRef: React.MutableRefObject<number>;
} => {
  const visibleTagsCountRef = React.useRef<number>(0);

  React.useEffect(() => {
    if (tags && activeTagIndex >= 0 && activeTagIndex < tags.length) {
      const tagTitle = tags[activeTagIndex]?.props?.children;
      if (tagTitle) {
        announce(`Close ${tagTitle} Tag`);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTagIndex, tags?.length]);

  const onTagLeft = (): void => {
    if (activeTagIndex < 0) {
      setActiveTagIndex?.(visibleTagsCountRef.current - 1);
    }

    if (activeTagIndex > 0) {
      setActiveTagIndex?.(activeTagIndex - 1);
    }
  };

  const onTagRight = (): void => {
    if (activeTagIndex < visibleTagsCountRef.current - 1) {
      setActiveTagIndex?.(activeTagIndex + 1);
    }
  };

  const onTagRemove = (): void => {
    if (activeTagIndex >= 0 && activeTagIndex < visibleTagsCountRef.current && tags) {
      tags[activeTagIndex].props.onDismiss({ tagIndex: activeTagIndex });
    }
  };

  const onInputKeydownTagHandler: OnInputKeydownTagHandlerType = (key) => {
    if (tags && tags.length > 0) {
      if (key === 'ArrowRight') {
        onTagRight();
      }

      if (key === 'ArrowLeft') {
        onTagLeft();
      }

      if (key === 'Backspace') {
        onTagRemove();
      }
    }
  };

  return {
    onInputKeydownTagHandler,
    visibleTagsCountRef,
  };
};

const useInput = ({
  value,
  defaultValue,
  onClick,
  onFocus,
  onChange,
  onBlur,
  onSubmit,
  onInput,
  onKeyDown,
  onInputKeydownTagHandler,
}: Pick<
  BaseInputProps,
  | 'value'
  | 'defaultValue'
  | 'onFocus'
  | 'onChange'
  | 'onBlur'
  | 'onInput'
  | 'onKeyDown'
  | 'onClick'
  | 'onSubmit'
> & {
  onInputKeydownTagHandler: OnInputKeydownTagHandlerType;
}): {
  handleOnFocus: FormInputHandleOnEvent;
  handleOnClick: FormInputHandleOnClickEvent;
  handleOnChange: FormInputHandleOnEvent;
  handleOnBlur: FormInputHandleOnEvent;
  handleOnSubmit: FormInputHandleOnEvent;
  handleOnInput: FormInputHandleOnEvent;
  handleOnKeyDown: FormInputHandleOnKeyDownEvent;
  inputValue?: string;
} => {
  if (__DEV__) {
    if (value && defaultValue) {
      throwKlear360Error({
        message: `Either 'value' or 'defaultValue' shall be passed. This decides if the input field is controlled or uncontrolled`,
        moduleName: 'Input',
      });
    }
  }

  const [inputValue, setInputValue] = React.useState(defaultValue ?? value);

  const handleOnFocus: FormInputHandleOnEvent = React.useCallback(
    ({ name, value }) => {
      let _value = '';

      if (getPlatformType() === 'react-native' && typeof value === 'string') {
        _value = value;
      } else if (typeof value !== 'string') {
        // Could have just done "getPlatformType() === 'react-native' ? value : value?.target.value" but TS doesn't understands that
        _value = value?.target.value ?? '';
      }

      onFocus?.({
        name,
        value: _value,
      });
    },
    [onFocus],
  );

  const handleOnClick: FormInputHandleOnClickEvent = React.useCallback(
    ({ name, value }) => {
      let _value = '';

      if (getPlatformType() === 'react-native' && typeof value === 'string') {
        _value = value;
      } else if (typeof value !== 'string') {
        // Could have just done "getPlatformType() === 'react-native' ? value : value?.target.value" but TS doesn't understands that
        _value = value?.currentTarget.value ?? '';
      }

      onClick?.({
        name,
        value: _value,
      });
    },
    [onClick],
  );

  const handleOnSubmit: FormInputHandleOnEvent = React.useCallback(
    ({ name, value }) => {
      let _value = '';

      if (getPlatformType() === 'react-native' && typeof value === 'string') {
        _value = value;
      } else if (typeof value !== 'string') {
        // Could have just done "getPlatformType() === 'react-native' ? value : value?.target.value" but TS doesn't understands that
        _value = value?.target.value ?? '';
      }
      if (isReactNative()) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment, @typescript-eslint/prefer-ts-expect-error
        //@ts-ignore need to ignore this since it will throw a TS error for web but not for native
        onSubmit?.({
          name,
          value: _value,
        });
      }
    },
    [onSubmit],
  );

  const handleOnBlur: FormInputHandleOnEvent = React.useCallback(
    ({ name, value }) => {
      let _value = '';
      if (getPlatformType() === 'react-native' && typeof value == 'string') {
        _value = value;
      } else if (typeof value !== 'string') {
        // Could have just done "getPlatformType() === 'react-native' ? value : value?.target.value" but TS doesn't understands that
        _value = value?.target.value ?? '';
      }

      onBlur?.({
        name,
        value: _value,
      });
    },
    [onBlur],
  );

  const handleOnChange: FormInputHandleOnEvent = React.useCallback(
    ({ name, value }) => {
      let _value = '';

      if (getPlatformType() === 'react-native' && typeof value === 'string') {
        _value = value;
      } else if (typeof value !== 'string') {
        // Could have just done "getPlatformType() === 'react-native' ? value : value?.target.value" but TS doesn't understands that
        _value = value?.target.value ?? '';
      }

      onChange?.({
        name,
        value: _value,
      });
      setInputValue(_value);
    },
    [onChange],
  );

  const handleOnInput: FormInputHandleOnEvent = React.useCallback(
    ({ name, value }) => {
      let _value = '';
      if (getPlatformType() === 'react-native' && typeof value == 'string') {
        _value = value;
      } else if (typeof value !== 'string') {
        // Could have just done "getPlatformType() === 'react-native' ? value : value?.target.value" but TS doesn't understands that
        _value = value?.target.value ?? '';
      }

      onInput?.({
        name,
        value: _value,
      });
    },
    [onInput],
  );

  const handleOnKeyDown: FormInputHandleOnKeyDownEvent = React.useCallback(
    ({ name, key, code, event }) => {
      onInputKeydownTagHandler(key);
      onKeyDown?.({
        name,
        key,
        code,
        event,
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onKeyDown],
  );

  return {
    handleOnFocus,
    handleOnClick,
    handleOnChange,
    handleOnBlur,
    handleOnSubmit,
    handleOnInput,
    handleOnKeyDown,
    inputValue,
  };
};

export const getHintType = ({
  validationState,
  hasHelpText,
}: {
  validationState: BaseInputProps['validationState'];
  hasHelpText: boolean;
}): FormHintProps['type'] => {
  if (validationState === 'error') {
    return 'error';
  }

  if (validationState === 'success') {
    return 'success';
  }

  if (hasHelpText) {
    return 'help';
  }

  return 'help';
};

const getDescribedByElementId = ({
  validationState,
  hasErrorText,
  hasSuccessText,
  hasHelpText,
  errorTextId,
  successTextId,
  helpTextId,
}: {
  validationState: BaseInputProps['validationState'];
  hasErrorText: boolean;
  hasSuccessText: boolean;
  hasHelpText: boolean;
  errorTextId: string;
  successTextId: string;
  helpTextId: string;
}): string => {
  if (validationState === 'error' && hasErrorText) {
    return errorTextId;
  }

  if (validationState === 'success' && hasSuccessText) {
    return successTextId;
  }

  if (hasHelpText) {
    return helpTextId;
  }

  return '';
};

const FocusRingWrapper = styled(BaseBox)<{
  currentInteraction: ActionStates;
  isTableInputCell: NonNullable<BaseInputProps['isTableInputCell']>;
  className: string;
  $size: NonNullable<BaseInputProps['size']>;
  $borderRadius?: BaseInputProps['borderRadius'];
}>(({ theme, currentInteraction, isTableInputCell, $size, $borderRadius }) => ({
  borderRadius: makeBorderSize(
    isTableInputCell
      ? theme.border.radius.none
      : theme.border.radius[$borderRadius ?? baseInputBorderRadius[$size]],
  ),
  width: '100%',
  // `&:focus-within` is a web-only pseudo-selector. On React Native,
  // styled-components/native (css-to-react-native) cannot parse a nested rule and
  // logs "Node of type rule not supported as an inline style" for every rendered
  // input. focus-within has no effect on native, so we omit the nested rule there.
  ...(getPlatformType() === 'react-native'
    ? {}
    : {
        // The ring only shows while the input's own field has focus. Buttons inside the input
        // (clear, show password, country selector, etc.) draw their own focus ring, so showing
        // this one too while they are focused would give two rings at once.
        '&:focus-within':
          !isTableInputCell && currentInteraction === 'focus'
            ? {
                ...getFocusRingStyles({
                  theme,
                }),
                transitionDuration: castWebType(
                  makeMotionTime(
                    getIn(
                      theme.motion.duration,
                      baseInputBorderBackgroundMotion[
                        currentInteraction === 'focus' ? 'enter' : 'exit'
                      ].duration,
                    ),
                  ),
                ),
                transitionTimingFunction: castWebType(
                  theme.motion.easing[
                    baseInputBorderBackgroundMotion[
                      currentInteraction === 'focus' ? 'enter' : 'exit'
                    ].easing
                  ],
                ),
              }
            : {},
      }),
}));

const _BaseInput: React.ForwardRefRenderFunction<Klear360ElementRef, BaseInputProps> = (
  {
    as = 'input',
    label,
    labelPosition = 'top',
    placeholder,
    type = 'text',
    defaultValue,
    tags,
    showAllTags = false,
    activeTagIndex = -1,
    setActiveTagIndex,
    name,
    value,
    onFocus,
    onChange,
    onInput,
    onBlur,
    onSubmit,
    onClick,
    onKeyDown,
    onPaste,
    isDisabled,
    necessityIndicator,
    validationState,
    validationTextPlacement,
    errorText,
    helpText,
    successText,
    isRequired,
    leadingIcon,
    prefix,
    trailingInteractionElement,
    onTrailingInteractionElementClick,
    leadingInteractionElement,
    suffix,
    trailingIcon,
    maxCharacters,
    textAlign,
    autoFocus,
    keyboardReturnKeyType,
    keyboardType,
    autoCompleteSuggestionType,
    trailingHeaderSlot,
    trailingFooterSlot,
    numberOfLines,
    autoGrowMaxHeight,
    id,
    componentName,
    accessibilityLabel,
    labelId,
    activeDescendant,
    hideLabelText,
    hasCompactLeadingSpacing,
    hideFormHint,
    showHelpTextOnFocus = false,
    hasPopup,
    popupId,
    isPopupExpanded,
    activeInteraction,
    maxTagRows,
    shouldIgnoreBlurAnimation,
    setShouldIgnoreBlurAnimation,
    autoCapitalize,
    setInputWrapperRef,
    testID,
    isDropdownTrigger,
    isLabelInsideInput,
    size = 'medium',
    padding,
    borderRadius,
    elevation,
    trailingButton,
    valueComponentType = 'text',
    isTableInputCell = false,
    showHintsAsTooltip = false,
    _motionMeta,
    role,
    tabIndex,
    leadingDropDown,
    trailingDropDown,
    labelSuffix,
    labelTrailing,
    valueSuffix,
    children,
    topContent,
    bottomContent,
    inputRowOverlay,
    caretColor,
    ...rest
  },
  ref,
) => {
  const { theme } = useTheme();
  const inputRef = React.useRef<Klear360ElementRef>(null);
  const mergedInputRef = useMergeRefs(ref, inputRef);
  const inputWrapperRef: InputWrapperRef = React.useRef(null);
  const { onInputKeydownTagHandler, visibleTagsCountRef } = useTags(
    tags,
    activeTagIndex,
    setActiveTagIndex,
  );
  const [showAllTagsWithAnimation, setShowAllTagsWithAnimation] = React.useState(false);
  const isReactNative = getPlatformType() === 'react-native';
  const defaultRole = hasPopup ? 'combobox' : undefined;

  const inputGroupProps = useInputGroupContext();
  const { isInsideInputGroup } = inputGroupProps;
  const counterInputProps = useCounterInputContext();
  const {
    color,
    disabledTextColor: disabledColor,
    isDisabled: isCounterInputDisabled,
    isLoading: isCounterInputLoading,
    isInsideCounterInput,
  } = counterInputProps;
  const _isDisabled =
    inputGroupProps.isDisabled ?? (isCounterInputDisabled || isCounterInputLoading) ?? isDisabled;
  const _size = inputGroupProps.size ?? size;

  React.useEffect(() => {
    if (showAllTags) {
      setShowAllTagsWithAnimation(true);
    } else if (maxTagRows !== 'expandable') {
      setShowAllTagsWithAnimation(false);
    }
  }, [showAllTags, maxTagRows]);

  const {
    handleOnFocus,
    handleOnChange,
    handleOnClick,
    handleOnBlur,
    handleOnSubmit,
    handleOnInput,
    handleOnKeyDown,
    inputValue,
  } = useInput({
    defaultValue,
    value,
    onFocus,
    onClick,
    onChange,
    onBlur,
    onSubmit,
    onInput,
    onKeyDown,
    onInputKeydownTagHandler,
  });
  const { inputId, helpTextId, errorTextId, successTextId } = useFormId(id);
  const { matchedDeviceType } = useBreakpoint({ breakpoints: theme.breakpoints });
  const isLabelLeftPositioned = labelPosition === 'left' && matchedDeviceType === 'desktop';
  const { currentInteraction, setCurrentInteraction } = useInteraction();
  // `activeInteraction` lets a press-to-open trigger (e.g. DatePicker on native, which
  // renders as a button and never receives real focus) force the "active" visual state
  // — the blue border + focus ring — while its popup is open. The real
  // `currentInteraction` is still handed to the underlying input element so its own
  // event wiring (focus/blur) keeps working; only the border/focus-ring wrappers read
  // this overridden value.
  const visualInteraction = activeInteraction ?? currentInteraction;
  const _isRequired = isRequired || necessityIndicator === 'required';

  const accessibilityProps = makeAccessible({
    required: Boolean(_isRequired),
    disabled: Boolean(_isDisabled),
    invalid: Boolean(validationState === 'error'),
    describedBy: getDescribedByElementId({
      validationState,
      hasErrorText: Boolean(errorText),
      hasSuccessText: Boolean(successText),
      hasHelpText: Boolean(helpText),
      errorTextId,
      successTextId,
      helpTextId,
    }),
    label: accessibilityLabel,
    hasPopup,
    expanded: hasPopup ? isPopupExpanded : undefined,
    controls: hasPopup ? popupId : undefined,
    role: role ?? defaultRole,
    activeDescendant,
  });

  const isValidationTextInside = validationTextPlacement === 'inside';
  const willRenderHintText =
    Boolean(helpText) ||
    (!isValidationTextInside &&
      ((validationState === 'success' && Boolean(successText)) ||
        (validationState === 'error' && Boolean(errorText))));

  const hintType = getHintType({
    validationState: isValidationTextInside ? 'none' : validationState,
    hasHelpText: Boolean(helpText),
  });
  const footerErrorText = isValidationTextInside ? undefined : errorText;
  const footerSuccessText = isValidationTextInside ? undefined : successText;
  /**
   * Mirrors FormHint's own resolution rather than testing `hintType` alone. A
   * `validationState` of error or success only wins if the matching text was
   * actually supplied — `validationState="error"` with no `errorText` still falls
   * through to help text, and that help text must stay contextual.
   */
  const willShowHelpText =
    !(hintType === 'error' && Boolean(footerErrorText)) &&
    !(hintType === 'success' && Boolean(footerSuccessText)) &&
    Boolean(helpText);
  /**
   * `showHelpTextOnFocus` only ever gates help text. Once validation resolves to
   * error or success the hint is feedback, not guidance, so it renders persistently
   * and untransitioned exactly as it does without the prop.
   */
  const isHelpTextContextual = showHelpTextOnFocus && willShowHelpText;

  if (__DEV__) {
    if (
      autoCompleteSuggestionType &&
      !autoCompleteSuggestionTypeValues.includes(autoCompleteSuggestionType)
    ) {
      throwKlear360Error({
        message: `Expected autoCompleteSuggestionType to be one of ${autoCompleteSuggestionTypeValues.join(
          ', ',
        )} but received ${autoCompleteSuggestionType}`,
        moduleName: 'Input',
      });
    }

    if (showHintsAsTooltip && isValidationTextInside) {
      logger({
        message:
          'showHintsAsTooltip and validationTextPlacement="inside" should not be used together. validationTextPlacement="inside" will take precedence.',
        moduleName: 'Input',
        type: 'warn',
      });
    }
  }

  const isTextArea = as === 'textarea';
  /**
   * Held in a variable so the contextual branch below can wrap the *same* element
   * rather than duplicating it. When `showHelpTextOnFocus` is off this renders
   * unwrapped, leaving the existing markup byte for byte unchanged.
   */
  const formHint = (
    <FormHint
      type={hintType}
      helpText={helpText}
      errorText={footerErrorText}
      successText={footerSuccessText}
      helpTextId={helpTextId}
      errorTextId={errorTextId}
      successTextId={successTextId}
      size={_size}
    />
  );

  return (
    <BaseBox
      ref={getOuterMotionRef({ _motionMeta, ref })}
      {...metaAttribute({ name: componentName, testID })}
      {...getStyledProps(rest)}
    >
      <BaseBox
        display="flex"
        flexDirection={isLabelLeftPositioned ? 'row' : 'column'}
        justifyContent={isLabelLeftPositioned ? 'center' : undefined}
        alignItems={isLabelLeftPositioned ? 'center' : undefined}
        position="relative"
        width="100%"
      >
        {/* If the input is in an input group, we don't want to render the label */}
        {!hideLabelText && !isLabelInsideInput && label && !isInsideInputGroup && (
          <BaseBox
            display="flex"
            flexDirection={isLabelLeftPositioned ? 'column' : 'row'}
            justifyContent="space-between"
            alignSelf={isTextArea && isLabelLeftPositioned ? 'flex-start' : undefined}
            marginY={isTextArea && isLabelLeftPositioned ? 'spacing.3' : 'spacing.0'}
          >
            <FormLabel
              as="label"
              necessityIndicator={necessityIndicator}
              position={labelPosition}
              id={labelId}
              htmlFor={inputId}
              size={_size}
              labelSuffix={labelSuffix}
              labelTrailing={labelTrailing}
            >
              {label}
            </FormLabel>
            {trailingHeaderSlot?.(value ?? inputValue)}
          </BaseBox>
        )}
        <FocusRingWrapper
          currentInteraction={visualInteraction}
          isTableInputCell={isTableInputCell}
          className="focus-ring-wrapper"
          $size={_size}
          $borderRadius={borderRadius}
          elevation={elevation}
        >
          <BaseInputWrapper
            isDropdownTrigger={isDropdownTrigger}
            isTextArea={isTextArea}
            isDisabled={_isDisabled}
            validationState={validationState}
            currentInteraction={visualInteraction}
            isLabelLeftPositioned={isLabelLeftPositioned}
            showAllTags={showAllTags}
            setShowAllTagsWithAnimation={setShowAllTagsWithAnimation}
            ref={(refNode) => {
              if (refNode) {
                setInputWrapperRef?.(refNode);
                inputWrapperRef.current = refNode;
              }
            }}
            maxTagRows={maxTagRows}
            size={_size}
            borderRadius={borderRadius}
            numberOfLines={numberOfLines}
            onClick={(e) => {
              if (!isReactNative) {
                inputRef.current?.focus();
                // If click didn't originate from the input itself (e.g., clicked on
                // leading icon like DatePicker's calendar icon), dispatch a click on
                // the input to trigger its onClick handlers (e.g., floating-ui toggle)
                const inputEl = inputRef.current as HTMLElement | null;
                if (!inputEl?.contains(e.target as Node) && !_isDisabled) {
                  inputEl?.click();
                }
              }
            }}
            isTableInputCell={isTableInputCell}
            topContent={topContent}
            bottomContent={bottomContent}
            inputRowOverlay={inputRowOverlay}
          >
            <BaseInputVisuals
              size={_size}
              leadingIcon={leadingIcon}
              prefix={prefix}
              isDisabled={_isDisabled}
              leadingInteractionElement={leadingInteractionElement}
              leadingDropDown={leadingDropDown}
              hasCompactLeadingSpacing={hasCompactLeadingSpacing}
            />
            <BaseInputTagSlot
              renderAs={as}
              tags={tags}
              isDisabled={_isDisabled}
              showAllTags={showAllTagsWithAnimation}
              setFocusOnInput={() => {
                const innerRef = getInnerMotionRef({ _motionMeta, ref });
                if (innerRef && !isReactNative && 'current' in innerRef) {
                  innerRef.current?.focus();
                }
              }}
              labelPrefix={isLabelInsideInput ? label : undefined}
              isDropdownTrigger={isDropdownTrigger}
              visibleTagsCountRef={visibleTagsCountRef}
              handleOnInputClick={(e) => {
                handleOnClick({ name, value: isReactNative ? value : e });
              }}
              setShouldIgnoreBlurAnimation={setShouldIgnoreBlurAnimation}
              maxTagRows={maxTagRows}
              inputWrapperRef={inputWrapperRef}
              size={_size}
              numberOfLines={numberOfLines}
              isTextArea={isTextArea}
            >
              <StyledBaseInput
                as={as}
                id={inputId}
                ref={getInnerMotionRef({ _motionMeta, ref: mergedInputRef as any }) as never}
                name={name}
                type={type}
                defaultValue={defaultValue}
                value={value}
                placeholder={placeholder}
                isDisabled={_isDisabled}
                validationState={validationState}
                isRequired={_isRequired}
                handleOnFocus={handleOnFocus}
                handleOnChange={handleOnChange}
                handleOnBlur={handleOnBlur}
                handleOnSubmit={handleOnSubmit}
                handleOnInput={handleOnInput}
                handleOnKeyDown={handleOnKeyDown}
                onPaste={onPaste}
                handleOnClick={handleOnClick}
                leadingIcon={leadingIcon}
                prefix={prefix}
                trailingInteractionElement={trailingInteractionElement}
                leadingInteractionElement={leadingInteractionElement}
                suffix={suffix}
                valueSuffix={valueSuffix}
                trailingIcon={trailingIcon}
                maxCharacters={maxCharacters}
                textAlign={textAlign}
                // eslint-disable-next-line jsx-a11y/no-autofocus
                autoFocus={autoFocus}
                keyboardReturnKeyType={keyboardReturnKeyType}
                keyboardType={keyboardType}
                autoCompleteSuggestionType={autoCompleteSuggestionType}
                accessibilityProps={accessibilityProps}
                currentInteraction={currentInteraction}
                setCurrentInteraction={setCurrentInteraction}
                numberOfLines={numberOfLines}
                // Native-only: do not forward to web StyledBaseInput
                {...(isReactNative && autoGrowMaxHeight ? { autoGrowMaxHeight } : null)}
                isTextArea={isTextArea || maxTagRows === 'multiple' || maxTagRows === 'expandable'}
                hasPopup={hasPopup}
                hasTags={!!(tags && tags.length > 0)}
                shouldIgnoreBlurAnimation={shouldIgnoreBlurAnimation}
                autoCapitalize={autoCapitalize}
                isDropdownTrigger={isDropdownTrigger}
                $size={_size}
                $padding={padding}
                valueComponentType={valueComponentType}
                isTableInputCell={isTableInputCell}
                tabIndex={tabIndex}
                hasLeadingDropdown={Boolean(leadingDropDown)}
                children={children}
                color={color}
                disabledColor={disabledColor}
                isInsideCounterInput={isInsideCounterInput}
                $hasCompactLeadingSpacing={hasCompactLeadingSpacing}
                $caretColor={caretColor}
                {...metaAttribute({ name: MetaConstants.StyledBaseInput })}
                {...makeAnalyticsAttribute(rest)}
              />
            </BaseInputTagSlot>
            <BaseInputVisuals
              trailingInteractionElement={trailingInteractionElement}
              onTrailingInteractionElementClick={onTrailingInteractionElementClick}
              suffix={suffix}
              trailingIcon={trailingIcon}
              isDisabled={_isDisabled}
              validationState={validationState}
              validationTextPlacement={validationTextPlacement}
              trailingButton={trailingButton}
              size={_size}
              errorText={errorText}
              successText={successText}
              showHintsAsTooltip={showHintsAsTooltip}
              trailingDropDown={trailingDropDown}
              errorTextId={errorTextId}
              successTextId={successTextId}
            />
          </BaseInputWrapper>
        </FocusRingWrapper>
      </BaseBox>
      {/* If the input is in an input group, we don't want to render the hint text */}
      {hideFormHint || showHintsAsTooltip || isInsideInputGroup ? null : (
        <BaseBox
          marginLeft={makeSize(
            isLabelLeftPositioned && !hideLabelText ? formHintLeftLabelMarginLeft[_size] : 0,
          )}
        >
          <BaseBox
            display="flex"
            flexDirection="row"
            justifyContent={willRenderHintText ? 'space-between' : 'flex-end'}
          >
            {isHelpTextContextual ? (
              <AnimatedFormHint isVisible={currentInteraction === 'focus'}>
                {formHint}
              </AnimatedFormHint>
            ) : (
              formHint
            )}
            {trailingFooterSlot?.(value ?? inputValue)}
          </BaseBox>
        </BaseBox>
      )}
    </BaseBox>
  );
};

const BaseInputWithRef = React.forwardRef(_BaseInput);
const BaseInput = assignWithoutSideEffects(BaseInputWithRef, { displayName: 'BaseInput' });

export { BaseInput };
