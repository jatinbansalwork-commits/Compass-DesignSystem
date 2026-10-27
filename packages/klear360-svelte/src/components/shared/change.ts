/**
 * What a field reports on a change, as Klear360's `onChange({ name, value })`:
 * its `name` (the key a Form submits it under) and the new value.
 */
export interface FieldChange<V> {
  name: string | undefined;
  value: V;
}
