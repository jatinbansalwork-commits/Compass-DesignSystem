import type { DataAnalyticsAttribute } from '~utils/types';

export type ModalProps = {
  /**
   *  Children of Modal
   * Only ModalHeader, ModalBody and ModalFooter are allowed as children
   */
  children: React.ReactNode;
  /**
   Sets the modal to open or close
   * @default false
   */
  isOpen: boolean;
  /**
   * Callback when the user dismisses the modal (close button, overlay click, or Escape when dismissible).
   *
   * @default undefined
   */
  onDismiss?: () => void;
  /**
   * Whether the modal can be dismissed by clicking outside or pressing escape key
   * @default true
   */
  isDismissible?: boolean;
  /**
   *  Ref to the element to be focused on opening the modal.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialFocusRef?: React.MutableRefObject<any>;
  /**
   *  Size of the modal
   * @default 'small'
   */
  size?: 'small' | 'medium' | 'large' | 'full';
  /**
   * Accessible name for the dialog announced to screen readers.
   *
   * @default undefined
   */
  accessibilityLabel?: string;
  /**
   * Sets the z-index of the modal
   * @default 1000
   */
  zIndex?: number;
} & DataAnalyticsAttribute;
