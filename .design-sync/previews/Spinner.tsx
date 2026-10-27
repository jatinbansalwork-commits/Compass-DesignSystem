import React from 'react';
import { Spinner } from '@klearnow/compass/components';

export const Default = () => (
  <Spinner />
);

export const Sizes = () => (
  <>
    <Spinner size="medium" />
    <Spinner size="large" />
    <Spinner size="xlarge" />
  </>
);

export const Colors = () => (
  <>
    <Spinner color="primary" />
    <Spinner color="white" />
  </>
);
