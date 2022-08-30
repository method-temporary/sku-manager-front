export enum ExtraWorkState {
  //
  Submit = 'SUBMIT',
  Pass = 'PASS',
  Fail = 'FAIL',
  Save = 'SAVE',
  Empty = '',
}

export function stringToExtraWorkState(value: string): ExtraWorkState {
  //
  if (value === 'SUBMIT') {
    return ExtraWorkState.Submit;
  } else if (value === 'PASS') {
    return ExtraWorkState.Pass;
  } else if (value === 'FAIL') {
    return ExtraWorkState.Fail;
  } else if (value === 'SAVE') {
    return ExtraWorkState.Save;
  }
  return ExtraWorkState.Empty;
}
