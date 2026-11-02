import React from 'react';
import { throwKdesignError } from '~utils/logger';

const useValidateAsProp = ({
  as,
  componentName,
  validAsValues,
}: {
  as?: string;
  componentName: string;
  validAsValues: readonly string[];
}): void => {
  React.useEffect(() => {
    if (__DEV__) {
      if (as && !validAsValues.includes(as)) {
        throwKdesignError({
          message: `Invalid \`as\` prop value - ${as}. Only ${validAsValues.join(
            ', ',
          )} are accepted`,
          moduleName: componentName,
        });
      }
    }
  }, [as, componentName, validAsValues]);
};

export { useValidateAsProp };
