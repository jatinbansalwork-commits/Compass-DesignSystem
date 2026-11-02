// Hidden example. It is  used in motion stories
import React from 'react';
import {
  CardBody,
  Card,
  CardFooter,
  CardFooterTrailing,
  CardHeader,
  CardHeaderLeading,
  CardHeaderTrailing,
  CardHeaderIcon,
  CardHeaderCounter,
  CardHeaderBadge,
} from '.';
import type { CardProps } from '.';
import { Text } from '~components/Typography';
import { CheckCircleIcon } from '~components/Icons';

export const InternalCardExample = React.forwardRef(
  ({ elevation = 'lowRaised' }: Partial<CardProps>, ref) => {
    return (
      <Card
        ref={ref as never}
        backgroundColor="surface.background.gray.intense"
        borderRadius="medium"
        elevation={elevation}
        padding="spacing.7"
        width="300px"
        marginRight="spacing.6"
        href="https://klearnow.ai/"
      >
        <CardHeader marginBottom="spacing.4" paddingBottom="spacing.4">
          <CardHeaderLeading
            prefix={<CardHeaderIcon icon={CheckCircleIcon} />}
            subtitle="Share filing link via an email, SMS, messenger, chatbot etc."
            suffix={<CardHeaderCounter value={12} />}
            title="Entry filing links"
          />
          <CardHeaderTrailing visual={<CardHeaderBadge color="positive">NEW</CardHeaderBadge>} />
        </CardHeader>
        <CardBody>
          <Text position="relative" zIndex={1}>
            Create Compass shipment booking links and share them with your customers from the
            Compass Dashboard or using APIs and start accepting clearance filings. Check the advantages,
            MOT options, international currency support and more.
          </Text>
        </CardBody>
        <CardFooter marginTop="spacing.4" paddingTop="spacing.4">
          <CardFooterTrailing
            actions={{
              primary: {
                accessibilityLabel: undefined,
                icon: undefined,
                iconPosition: undefined,
                isDisabled: false,
                isLoading: false,
                // eslint-disable-next-line @typescript-eslint/no-empty-function
                onClick: () => {},
                text: 'Learn More',
                type: undefined,
              },
            }}
          />
        </CardFooter>
      </Card>
    );
  },
);
