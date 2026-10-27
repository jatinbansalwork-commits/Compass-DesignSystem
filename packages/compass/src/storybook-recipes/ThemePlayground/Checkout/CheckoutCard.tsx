import { Box, Checkbox, Heading } from '../../../components';
import { CheckoutShell } from './CheckoutShell';
import { PasswordInput } from '~components/Input/PasswordInput';
import { TextInput } from '~components/Input/TextInput';

const CheckoutCard = (): React.ReactElement => {
  return (
    <CheckoutShell>
      <Box padding="spacing.4">
        <Heading marginTop="spacing.3">Delivery details</Heading>
        <Box display="flex" gap="spacing.6" marginTop="spacing.8">
          <Box flex="2">
            <TextInput label="Tracking number" />
          </Box>
          <Box flex="1">
            <TextInput label="Expected delivery" />
          </Box>
        </Box>
        <Box display="flex" gap="spacing.6" marginTop="spacing.8">
          <Box flex="2">
            <TextInput label="Recipient name" />
          </Box>
          <Box flex="1">
            <PasswordInput label="PIN code" />
          </Box>
        </Box>
        <Box marginTop="spacing.10">
          <Checkbox defaultChecked>Save address for future shipments</Checkbox>
        </Box>
      </Box>
    </CheckoutShell>
  );
};

export { CheckoutCard };
