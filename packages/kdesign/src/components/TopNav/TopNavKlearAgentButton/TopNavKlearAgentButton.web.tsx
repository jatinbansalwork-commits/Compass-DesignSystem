import React from 'react';
import type { TopNavKlearAgentButtonProps } from './types';
import { KLEAR_AGENT_BUTTON_LABEL } from './types';
import { TopNavBrandedActionPill } from '../TopNavBrandedActionPill';
import { KlearIcon } from '~components/Icons';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

/**
 * Frosted pill control for opening Klear Agent from `TopNavActions`.
 * Uses the animated Klear mark and matches primary/neutral TopNav headers.
 */
const _TopNavKlearAgentButton = ({
  onClick,
  label = KLEAR_AGENT_BUTTON_LABEL,
  accessibilityLabel,
  testID,
}: TopNavKlearAgentButtonProps): React.ReactElement => {
  return (
    <TopNavBrandedActionPill
      icon={KlearIcon}
      label={label}
      onClick={onClick}
      accessibilityLabel={accessibilityLabel}
      testID={testID}
    />
  );
};

const TopNavKlearAgentButton = assignWithoutSideEffects(_TopNavKlearAgentButton, {
  componentId: 'TopNavKlearAgentButton',
});

export { TopNavKlearAgentButton };
