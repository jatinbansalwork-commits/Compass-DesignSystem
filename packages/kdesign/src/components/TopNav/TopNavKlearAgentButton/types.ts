import type { TestID } from '~utils/types';

/** Default visible label for {@link TopNavKlearAgentButton}. */
const KLEAR_AGENT_BUTTON_LABEL = 'Klear Agent';

type TopNavKlearAgentButtonProps = {
  /**
   * Invoked when the user activates the Klear Agent entry point.
   */
  onClick: () => void;
  /**
   * Visible label beside the Klear mark.
   *
   * @default 'Klear Agent'
   */
  label?: string;
  /**
   * Accessible name when the visible label is insufficient.
   *
   * @default undefined
   */
  accessibilityLabel?: string;
} & TestID;

export type { TopNavKlearAgentButtonProps };
export { KLEAR_AGENT_BUTTON_LABEL };
