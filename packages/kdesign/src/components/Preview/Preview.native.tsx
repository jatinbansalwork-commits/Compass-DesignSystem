import React from 'react';
import type {
  PreviewBodyProps,
  PreviewFooterProps,
  PreviewHeaderProps,
  PreviewProps,
} from './types';
import { throwKdesignError } from '~utils/logger';

const Preview = (_prop: PreviewProps): React.ReactElement => {
  throwKdesignError({
    message: 'PreviewWindow is not yet implemented for native',
    moduleName: 'PreviewWindow',
  });

  return <></>;
};

const PreviewHeader = (_prop: PreviewHeaderProps): React.ReactElement => {
  throwKdesignError({
    message: 'PreviewHeader is not yet implemented for native',
    moduleName: 'PreviewHeader',
  });

  return <></>;
};

const PreviewBody = (_prop: PreviewBodyProps): React.ReactElement => {
  throwKdesignError({
    message: 'PreviewBody is not yet implemented for native',
    moduleName: 'PreviewBody',
  });

  return <></>;
};

const PreviewFooter = (_prop: PreviewFooterProps): React.ReactElement => {
  throwKdesignError({
    message: 'PreviewFooter is not yet implemented for native',
    moduleName: 'PreviewFooter',
  });

  return <></>;
};

export { Preview, PreviewHeader, PreviewBody, PreviewFooter };
