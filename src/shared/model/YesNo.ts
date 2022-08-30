export type YesNo = 'Yes' | 'No';

export function boolToYesNo(value?: boolean) {
  return (value && 'Yes') || 'No';
}
