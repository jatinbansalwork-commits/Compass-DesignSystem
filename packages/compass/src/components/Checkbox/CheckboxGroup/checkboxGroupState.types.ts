export type CheckboxGroupState = {
  value: string[];
  setValue(value: string[]): void;
  isChecked(value: string): boolean;
  addValue(value: string): void;
  removeValue(value: string): void;
};
