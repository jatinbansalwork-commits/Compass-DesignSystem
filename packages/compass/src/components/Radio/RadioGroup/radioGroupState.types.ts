import type React from 'react';

export type RadioGroupState = {
  value: string;
  setValue(value: string, event: React.ChangeEvent<Element>): void;
  removeValue(): void;
  isChecked(value: string): boolean;
};
