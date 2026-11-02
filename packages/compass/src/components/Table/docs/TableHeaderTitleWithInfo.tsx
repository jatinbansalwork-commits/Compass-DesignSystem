import React from 'react';
import { Box } from '~components/Box';
import { Text } from '~components/Typography';
import { Tooltip } from '~components/Tooltip';
import { IconButton } from '~components/Button/IconButton';
import { InfoIcon } from '~components/Icons';
import { tableHeaderBand, tableIcons } from '../tokens';

type TableHeaderTitleWithInfoProps = {
  title: string;
  infoTooltip: string;
  infoAccessibilityLabel?: string;
};

/** Column title with an inline info affordance — sort icon stays on the trailing edge of {@link TableHeaderCell}. */
const TableHeaderTitleWithInfo = ({
  title,
  infoTooltip,
  infoAccessibilityLabel,
}: TableHeaderTitleWithInfoProps): React.ReactElement => (
  <Box
    display="flex"
    flexDirection="row"
    alignItems="center"
    gap={tableHeaderBand.titleInfoGap}
    minWidth={0}
    width="100%"
  >
    <Box flex={1} minWidth={0} overflow="hidden">
      <Text
        size="small"
        weight="medium"
        color="surface.text.gray.muted"
        whiteSpace="nowrap"
        overflow="hidden"
        textOverflow="ellipsis"
      >
        {title}
      </Text>
    </Box>
    <Box flexShrink={0}>
      <Tooltip content={infoTooltip}>
        <IconButton
          size={tableIcons.control}
          icon={InfoIcon}
          accessibilityLabel={infoAccessibilityLabel ?? `About ${title}`}
          onClick={(event) => {
            event.stopPropagation();
          }}
        />
      </Tooltip>
    </Box>
  </Box>
);

export { TableHeaderTitleWithInfo };
