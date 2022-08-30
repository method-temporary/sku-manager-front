export enum UserWorkspaceState {
  DEFAULT = '',
  //
  Active = 'Active',
  Dormant = 'Dormant',
}

export function getUserWorkspaceStateValue(state: UserWorkspaceState): string {
  //
  let value = '-';

  if (state === UserWorkspaceState.Active) {
    value = '사용';
  } else if (state === UserWorkspaceState.Dormant) {
    value = '사용 안함';
  }

  return value;
}
