import { useUserWorkspaces } from 'shared/store';
import UserWorkspaceModel from 'userworkspace/model/UserWorkspaceModel';
import { getWorkspaceById } from './useRequestWorkspaces';
import { getPortletRouteParams } from 'arrange/toktok/routeParams';

export function useAvailableWorkspaces(): UserWorkspaceModel[] | undefined {
  const workspaces = useUserWorkspaces();
  if (workspaces === undefined) {
    return undefined;
  }
  const availableWorkspaces = getAvailableWorkspaces(workspaces);
  return availableWorkspaces;
}

export function getAvailableWorkspaces(workspaces: UserWorkspaceModel[]): UserWorkspaceModel[] | undefined {
  const params = getPortletRouteParams();
  if (params === undefined) {
    return undefined;
  }

  if (params.cineroomId === 'ne1-m2-c2') {
    return workspaces;
  }

  const workspace = getWorkspaceById(params.cineroomId);
  if (workspace === undefined) {
    return undefined;
  }

  return [workspace];
}
