import React from 'react';
import BaseBox from '~components/Box/BaseBox';
import { Text } from '~components/Typography';
import type { TableTitleDescriptionCellProps } from './types';
import { useTruncationTitle } from '~utils/useTruncationTitle';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { ComponentIds } from './componentIds';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';

const TableTitleDescriptionCell = ({
  title,
  description,
  descriptionBehavior = 'truncate',
  descriptionLines = 2,
  testID,
  ...rest
}: TableTitleDescriptionCellProps): React.ReactElement => {
  const descriptionText =
    description == null ? '' : typeof description === 'string' ? description : undefined;
  const { containerRef, textRef } = useTruncationTitle({
    content: descriptionBehavior === 'truncate' ? descriptionText : undefined,
  });

  return (
    <BaseBox
      display="flex"
      flexDirection="column"
      gap="spacing.1"
      {...metaAttribute({ name: MetaConstants.TableTitleDescriptionCell, testID })}
      {...rest}
    >
      <Text as="span" size="medium" weight="semibold">
        {title}
      </Text>
      {description ? (
        descriptionBehavior === 'wrap' ? (
          <Text as="span" size="small" color="surface.text.gray.muted">
            {description}
          </Text>
        ) : (
          <BaseBox ref={containerRef}>
            <Text
              ref={textRef}
              as="span"
              size="small"
              color="surface.text.gray.muted"
              truncateAfterLines={descriptionLines}
            >
              {description}
            </Text>
          </BaseBox>
        )
      ) : null}
    </BaseBox>
  );
};

const TableTitleDescriptionCellExport = assignWithoutSideEffects(TableTitleDescriptionCell, {
  componentId: ComponentIds.TableTitleDescriptionCell,
});

export { TableTitleDescriptionCellExport as TableTitleDescriptionCell };
