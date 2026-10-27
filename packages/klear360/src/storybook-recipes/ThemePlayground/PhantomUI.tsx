import { useState } from 'react';
import { Box, Card, CardBody } from '../../components';
import { Heading, Text } from '~components/Typography';
import { Chip, ChipGroup } from '~components/Chip';
import { InfoIcon, RayIcon } from '~components/Icons';
import { IconButton } from '~components/Button/IconButton';
import { Button } from '~components/Button';

const PhantomUI = (): React.ReactElement => {
  const [selectedBusinessType, setSelectedBusinessType] = useState('Documents');
  return (
    <Box maxWidth="375px">
      <Card elevation="lowRaised">
        <CardBody>
          <Box>
            <Heading size="large">What are you shipping?</Heading>
            <Text size="medium">Pick one shipment category that best matches this order</Text>
          </Box>
          <Box marginTop="spacing.10">
            <Box display="flex" flexDirection="row" gap="spacing.2">
              <Text size="medium">DOMESTIC</Text>
              <IconButton
                icon={InfoIcon}
                onClick={() => {
                  console.log('first icon clicked');
                }}
                accessibilityLabel="Click to know more"
              />
            </Box>
            <ChipGroup
              accessibilityLabel="Select business type"
              selectionType="single"
              value={selectedBusinessType}
              onChange={({ values }) => setSelectedBusinessType(values[0])}
              marginTop="spacing.4"
            >
              <Chip value="Documents">Documents</Chip>
              <Chip value="Parcel">Parcel</Chip>
            </ChipGroup>
          </Box>
          <Box marginTop="spacing.8">
            <Box display="flex" flexDirection="row" gap="spacing.2">
              <Text size="medium">SPECIAL HANDLING</Text>
              <IconButton
                icon={InfoIcon}
                onClick={() => {
                  console.log('first icon clicked');
                }}
                accessibilityLabel="Click to know more"
              />
            </Box>
            <ChipGroup
              accessibilityLabel="Select business type"
              selectionType="single"
              value={selectedBusinessType}
              onChange={({ values }) => setSelectedBusinessType(values[0])}
              marginTop="spacing.4"
            >
              <Chip value="Express">Express</Chip>
              <Chip value="Standard">Standard</Chip>
              <Chip value="Fragile">Fragile</Chip>
              <Chip value="Refrigerated">Refrigerated</Chip>
              <Chip value="Oversized">Oversized</Chip>
              <Chip value="Hazardous">Hazardous</Chip>
              <Chip value="International">International</Chip>
            </ChipGroup>
          </Box>
          <Box
            marginLeft="spacing.3"
            marginRight="spacing.3"
            marginTop="spacing.8"
            textAlign="center"
            alignItems="center"
            display="flex"
            flexDirection="column"
          >
            <Button size="large" isFullWidth>
              Continue
            </Button>
            <Box display="flex" flexDirection="row" marginTop="spacing.3" alignItems="center">
              <RayIcon color="interactive.icon.gray.normal" size="medium" marginRight="spacing.2" />
              <Text>Powered by klearnow</Text>
            </Box>
          </Box>
        </CardBody>
      </Card>
    </Box>
  );
};

export { PhantomUI };
