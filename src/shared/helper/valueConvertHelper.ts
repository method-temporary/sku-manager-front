export enum YesNo {
  Yes = 'Yes',
  No = 'No',
}

export function booleanToYesNo(b?: boolean, undefinedThen?: YesNo) {
  if (typeof b === 'undefined') {
    return !undefinedThen ? YesNo.No : undefinedThen;
  }
  return b ? String(YesNo.Yes) : String(YesNo.No);
}

export function optionalBooleanToYesNo(b?: boolean) {
  //
  return b === undefined ? '' : b ? String(YesNo.Yes) : String(YesNo.No);
}

export function blankYesNoToOptionalBoolean(yesNo: string) {
  //
  return yesNo === '' ? undefined : yesNo === 'Yes';
}

export function yesNoToBooleanIgnoreCase(yesNo: string) {
  return yesNo && yesNo.toUpperCase() === 'YES';
}

export function yesNoToBoolean(yesNo: string) {
  return yesNo === 'Yes';
}

export function yesNoToBooleanUndefined(yesNo: string) {
  return yesNo === undefined ? undefined : yesNo === 'Yes';
}

export function stringToNumber(str: string): number {
  //
  return Number(str);
}

export function calculatorToOneDecimal(value: number) {
  //
  return isNaN(value) ? Number(0).toFixed(1) : Number(value).toFixed(1);
}
