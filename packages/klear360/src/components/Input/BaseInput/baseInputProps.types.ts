import type React from 'react';
import type { ReactNode } from 'react';
import type {
  FormInputLabelProps,
  FormInputValidationProps,
  FormInputOnEvent,
} from '~components/Form';
import type { IconComponent } from '~components/Icons';
import type { StyledPropsKlear360 } from '~components/Box/styledProps';
import type { Platform } from '~utils';
import type { FormInputHandleOnKeyDownEvent } from '~components/Form/FormTypes';
import type { DataAnalyticsAttribute, TestID, ContainerElementType } from '~utils/types';
import type { AriaAttributes } from '~utils/makeAccessible';
import type { MotionMetaProp } from '~components/BaseMotion';
import type { LinkProps } from '~components/Link';
import type { ActionStates } from '~utils/useInteraction';
import type { Elevation } from '~tokens/global';

type CommonAutoCompleteSuggestionTypes =
  | 'none'
  | 'name'
  | 'email'
  | 'username'
  | 'password'
  | 'newPassword'
  | 'oneTimeCode'
  | 'telephone'
  | 'postalCode'
  | 'countryName'
  | 'creditCardNumber'
  | 'creditCardCSC'
  | 'creditCardExpiry'
  | 'creditCardExpiryMonth'
  | 'creditCardExpiryYear';

type WebAutoCompleteSuggestionType = CommonAutoCompleteSuggestionTypes | 'on';

type BaseInputCommonProps = FormInputLabelProps &
  DataAnalyticsAttribute &
  FormInputValidationProps & {
    /**
     * Determines if it needs to be rendered as input, textarea or button
     */
    as?: 'input' | 'textarea' | 'button' | 'div';
    /**
     * ID that will be used for accessibility
     */
    id: string;
    /**
     * Placeholder text to be displayed inside the input field
     */
    placeholder?: string;
    /**
     * Type of Input Field to be rendered.
     *
     * @default text
     */
    type?: 'text' | 'telephone' | 'email' | 'url' | 'number' | 'search' | 'password';
    /**
     * Used to set the default value of input field when it's uncontrolled
     */
    defaultValue?: string;
    /**
     * The name of the input field.
     *
     * Useful in form submissions
     */
    name?: string;
    /**
     * The callback function to be invoked when the input field gets focus
     */
    onFocus?: FormInputOnEvent;
    /**
     * The callback function to be invoked when the value of the input field changes
     */
    onChange?: FormInputOnEvent;
    /**
     * The callback function to be invoked when input is clicked
     */
    onClick?: FormInputOnEvent;
    /**
     * The callback function to be invoked when the value of the input field has any input
     */
    onInput?: FormInputOnEvent;
    /**
     * The callback function to be invoked whenever there is a keyDown event
     */
    onKeyDown?: FormInputHandleOnKeyDownEvent;
    /**
     * The callback function to be invoked when content is pasted into the input
     */
    onPaste?: React.ClipboardEventHandler<HTMLInputElement>;
    /**
     * The callback function to be invoked when the the input field loses focus
     *
     * For React Native this will call `onEndEditing` event since we want to get the last value of the input field
     */
    onBlur?: FormInputOnEvent;
    /**
     * Ignores the blur event animation (Used in Select to ignore blur animation when item in option is clicked)
     */
    shouldIgnoreBlurAnimation?: boolean;
    /**
     * sets boolean that ignores the blur animations on baseinput
     */
    setShouldIgnoreBlurAnimation?: (shouldIgnoreBlurAnimation: boolean) => void;
    /**
     * Used to turn the input field to controlled so user can control the value
     */
    value?: string;
    /**
     * Used to disable the input field
     */
    isDisabled?: boolean;
    /**
     * If true, the input is marked as required, and `required` attribute will be added
     */
    isRequired?: boolean;
    /**
     * Icon to be shown at the start of the input field
     */
    leadingIcon?: IconComponent;
    /**
     * Prefix symbol to be displayed at the beginning of the input field. If leadingIcon is provided it'll be placed after it
     */
    prefix?: string;
    /**
     * Element to be rendered before suffix. This is decided by the component which is extending BaseInput
     *
     * eg: consumers can render a loader or they could render a clear button
     */
    trailingInteractionElement?: ReactNode;
    /**
     * Callback to be invoked when the TrailingInteractionElement is clicked
     */
    onTrailingInteractionElementClick?: () => void;
    /**
     * Element to be rendered before prefix. This is decided by the component which is extending BaseInput
     *
     * eg: consumers can render a country selector or button
     */
    leadingInteractionElement?: ReactNode;
    /**
     * Leading DropDown to be rendered at Prefix slot
     */
    leadingDropDown?: ReactNode;
    /**
     * Trailing DropDown to be rendered at Suffix slot
     */
    trailingDropDown?: ReactNode;
    /**
     * Suffix symbol to be displayed at the end of the input field. If trailingIcon is provided it'll be placed before it
     */
    suffix?: string;
    /**
     * Icon to be displayed at the end of the input field
     */
    trailingIcon?: IconComponent;
    /**
     * Displays the character counter under the input field
     */
    maxCharacters?: number;
    /**
     * alignment of the text inside input field
     */
    textAlign?: 'left' | 'center' | 'right';
    /**
     * If true, focuses the input field on load
     *
     * **Note:**
     * Automatically focusing a form control can confuse visually-impaired people using screen-reading technology and people with cognitive impairments.
     * When autofocus is assigned, screen-readers "teleport" their user to the form control without warning them beforehand.
     */
    autoFocus?: boolean;
    /**
     * Hints the platform to display an appropriate virtual keyboard
     *
     * **Native:** Passes as is the `keyboardType` attribute
     *
     * **Web:** Passes the value to the `inputMode` attribute
     */
    keyboardType?: 'text' | 'search' | 'telephone' | 'email' | 'url' | 'decimal';
    /**
     * determines what return key to show on the keyboard of mobile devices/virtual keyboard
     * **Note**: Few values are platform dependent and might not render on all the platforms
     *
     * `default` is only available on native. it'll be mapped to `enter` for web
     * `previous` is only available on native android
     */
    keyboardReturnKeyType?: 'default' | 'go' | 'done' | 'next' | 'previous' | 'search' | 'send';
    /**
     * Element to be rendered on the trailing slot of input field label
     */
    trailingHeaderSlot?: (value?: string) => ReactNode;
    /**
     * Element to be rendered on the trailing slot of input field footer
     */
    trailingFooterSlot?: (value?: string) => ReactNode;
    /**
     * Sets the textarea's number of lines
     */
    numberOfLines?: 1 | 2 | 3 | 4 | 5;
    /**
     * When set on React Native textareas, grows the input height with content
     * up to this maximum (in px). Uses `numberOfLines` as the minimum height.
     *
     * **Note (Web):** No effect. Web textareas grow via DOM `scrollHeight` instead.
     */
    autoGrowMaxHeight?: number;
    /**
     * Sets the accessibility label for the input
     */
    accessibilityLabel?: string;
    /**
     * Sets the id of the label
     *
     * (Useful when assigning one label to multiple elements using aria-labelledby)
     */
    labelId?: string;
    /**
     * Can be used in select to set the id of the active descendant from the listbox
     */
    activeDescendant?: string;
    /**
     * Hides the label text
     */
    hideLabelText?: boolean;
    /**
     * Hides the form hint text
     */
    hideFormHint?: boolean;
    /**
     * Makes `helpText` contextual instead of persistent — it stays hidden at rest
     * and eases in only while the input is focused, easing back out on blur.
     *
     * `errorText` and `successText` are unaffected and always remain visible, since
     * validation feedback must not depend on focus.
     *
     * When `false`, help text renders exactly as it does today — always visible,
     * with no transition.
     *
     * Known limits:
     * - A disabled input cannot take focus, so its help text is never revealed.
     * - With `maxCharacters` the character counter keeps the footer row visible at rest.
     * - `SearchInput` with a `Dropdown` paints the open dropdown over the revealed help text.
     *
     * @default false
     */
    showHelpTextOnFocus?: boolean;
    /**
     * componentName prop sets the data-klear360-component attribute name
     * for internal metric collection purposes
     */
    componentName?: string;
    /**
     * whether the input has a popup
     */
    hasPopup?: AriaAttributes['hasPopup'];
    /**
     * id of the popup
     */
    popupId?: string;
    /**
     * true if popup is in expanded state
     */
    isPopupExpanded?: boolean;
    /**
     * @internal Forces the input's visual interaction state (border color + focus ring)
     * regardless of the real focus/hover events tracked internally.
     *
     * Used by press-to-open triggers that render as a `button` (e.g. DatePicker on native)
     * and therefore never receive DOM/RN focus, but should still look "active"
     * (blue border + focus ring) while their popup is open. When omitted, the input falls
     * back to its own internally tracked interaction state.
     */
    activeInteraction?: ActionStates;
    /**
     * @internal Tighter spacing around the leading interaction element, used by
     * PhoneNumberInput for its country selector:
     * - even gap between the field edge and the leading element on all sides
     * - prefix or leading icon 2px after the leading element
     * - input text 4px after a prefix or leading icon, or 2px after the leading
     *   element when there's neither
     */
    hasCompactLeadingSpacing?: boolean;
    setInputWrapperRef?: (node: ContainerElementType) => void;
    /**
     * sets the autocapitalize behavior for the input
     */
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';

    /**
     * constraints the height of input to given number rows
     *
     * When set to expandable, input takes 1 row in the begining and expands to take 3 when active
     *
     * @default 'single'
     */
    maxTagRows?: 'single' | 'multiple' | 'expandable';

    /**
     * A slot for adding tags to input
     */
    tags?: React.ReactElement[] | null;

    /**
     * Disables stripping of tags and shows all tags
     */
    showAllTags?: boolean;

    /**
     * State variable of active tag index
     */
    activeTagIndex?: number;

    /**
     * Is this input SelectInput or AutoComplete
     */
    isDropdownTrigger?: boolean;

    /**
     * Is the label expected to be rendered inside input?
     * Used in AutoComplete and Select when label can't exist outside
     *
     */
    isLabelInsideInput?: boolean;

    /**
     * State setter for active tag index
     */
    setActiveTagIndex?: (activeTagIndex: number) => void;
    /**
     * Sets the size of the input field
     * @default medium
     */
    size?: 'xsmall' | 'small' | 'medium' | 'large';
    /**
     * Overrides the padding of the input independently of the `size` prop.
     * Accepts CSS values like `"16px"`.
     */
    padding?: string;
    /**
     * Overrides the border radius of the input independently of the `size` prop.
     * Accepts border radius tokens like `"large"`.
     */
    borderRadius?: 'small' | 'medium' | 'large' | 'xlarge' | '2xlarge';
    /**
     * Sets the elevation (box-shadow) on the input wrapper.
     */
    elevation?: keyof Elevation;
    /**
     * Link button to be rendered at the end of the input field.
     * **Note:** `size` of the Link will be set to the same size as the input field, `isDisabled` will follow Input's `isDisabled`, & `variant` will be set to `button`.
     * Example:
     * ```tsx
     * trailingButton={<Link onClick={handleClick}>Apply</Link>}
     * ```
     */
    trailingButton?: React.ReactElement<LinkProps>;
    /**
     * Whether to use Text or Heading component for Input text
     * @default text
     **/
    valueComponentType?: 'text' | 'heading';
    /**
     * Whether to render the input as a table cell
     * @default true
     **/
    isTableInputCell?: boolean;
    /**
     * Hides the form hints and shows them as tooltip of trailing
     */
    showHintsAsTooltip?: boolean;

    role?: AriaAttributes['role'];

    /**
     * Tab Index of the input field
     *
     * @default undefined
     */
    tabIndex?: number;
    /**
     * Slot to be rendered adjacent to the value
     */
    valueSuffix?: React.ReactNode;
    children?: ReactNode;
    /**
     * Overrides the caret (text cursor) color of the input.
     */
    caretColor?: 'surface.icon.onSea.onSubtle';
    /**
     * Content rendered inside the input wrapper, above the input row.
     * Used by ChatInput for file previews.
     */
    topContent?: React.ReactNode;
    /**
     * Content rendered inside the input wrapper, below the input row.
     * Used by ChatInput for the action bar.
     */
    bottomContent?: React.ReactNode;
    /**
     * Overlay content rendered inside the input row wrapper with position relative.
     * Used by ChatInput for ghost suggestions.
     */
    inputRowOverlay?: React.ReactNode;
  } & TestID &
  Platform.Select<{
    native: {
      /**
       * The callback function to be invoked when the value of the input field is submitted.
       */
      onSubmit?: FormInputOnEvent;
      /**
       * determines what autoComplete suggestion type to show
       *
       * Internally it'll render platform specific attributes:
       *
       * - web: `autocomplete`
       * - iOS: `textContentType`
       * - android: `autoComplete`
       *
       */
      autoCompleteSuggestionType?: CommonAutoCompleteSuggestionTypes;
    };
    web: {
      /**
       * This is a react-native only prop and has no effect on web.
       */
      onSubmit?: undefined;
      /**
       * determines what autoComplete suggestion type to show
       *
       * Internally it'll render platform specific attributes:
       *
       * - web: `autocomplete`
       * - iOS: `textContentType`
       * - android: `autoComplete`
       *
       */
      autoCompleteSuggestionType?: WebAutoCompleteSuggestionType;
    };
  }> &
  StyledPropsKlear360 &
  MotionMetaProp;

/*
  Mandatory accessibilityLabel prop when label is not provided
*/
type BaseInputPropsWithA11yLabel = {
  /**
   * Label to be shown for the input field
   */
  label?: undefined;
  /**
   * Accessibility label for the input
   */
  accessibilityLabel: string;
};

/*
  Optional accessibilityLabel prop when label is provided
*/
type BaseInputPropsWithLabel = {
  /**
   * Label to be shown for the input field
   */
  label: string;
  /**
   * Accessibility label for the input
   */
  accessibilityLabel?: string;
};

export type BaseInputProps = (BaseInputPropsWithA11yLabel | BaseInputPropsWithLabel) &
  BaseInputCommonProps;
