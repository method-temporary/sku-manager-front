import { defaultOptions, SelectOption } from 'shared/model';
import { useUserWorkspaces } from 'shared/store';

import { getPortletRouteParams } from 'arrange/toktok/routeParams';
import UserWorkspaceModel from 'userworkspace/model/UserWorkspaceModel';

import { getWorkspaceById } from './useRequestWorkspaces';

export function useAvailableWorkspaceOptions(): SelectOption[] {
  const workspaces = useUserWorkspaces();
  if (workspaces === undefined) {
    return defaultOptions;
  }
  const workspaceOptions = getWorkspaceOptions(workspaces);
  return workspaceOptions;
}

export function getWorkspaceOptions(workspaces?: UserWorkspaceModel[]): SelectOption[] {
  const params = getPortletRouteParams();
  if (workspaces === undefined || params === undefined) {
    return defaultOptions;
  }
  if (params.cineroomId === 'ne1-m2-c2') {
    const workspaceOptions = workspaces.map((workspace) => {
      return {
        key: workspace.id,
        value: workspace.id,
        text: workspace.name.ko,
      };
    });
    return defaultOptions.concat(workspaceOptions);
  } else {
    const workspace = getWorkspaceById(params.cineroomId);
    if (workspace === undefined) {
      return defaultOptions;
    }
    return defaultOptions.concat({
      key: workspace.id,
      value: workspace.id,
      text: workspace.name.ko,
    });
  }
}
