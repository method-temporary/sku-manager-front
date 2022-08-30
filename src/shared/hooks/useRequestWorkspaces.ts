import { useEffect } from 'react';
import { getUserWorkspaces, setUserWorkspaces } from 'shared/store';
import UserWorkspaceApi from 'userworkspace/present/apiclient/UserWorkspaceApi';
import UserWorkspaceModel from 'userworkspace/model/UserWorkspaceModel';

const MYSUNI_CINEROOM_ID = 'ne1-m2-c2';

export function useRequestWorkspaces() {
  useEffect(() => {
    requestWorkspaces();
  }, []);
}

export async function requestWorkspaces() {
  const userWorkspaceApi = UserWorkspaceApi.instance;
  const workspaces = await userWorkspaceApi.findAllWorkspace();
  if (workspaces !== null) {
    /* mySUNI 가 맨 앞에 오도록 정렬 */
    const sortedWorkspaces = workspaces.sort(mySUNIFirst);
    setUserWorkspaces(sortedWorkspaces);
  }
}

export function getWorkspaceById(workspaceId: string): UserWorkspaceModel | undefined {
  const workspaces = getUserWorkspaces();
  if (workspaces === undefined) {
    return undefined;
  }
  const foundWorkspace = workspaces.find((workspace) => workspace.id === workspaceId);
  if (foundWorkspace === undefined) {
    return undefined;
  }
  return foundWorkspace;
}

export function mySUNIFirst(a: UserWorkspaceModel, b: UserWorkspaceModel) {
  if (a.id === MYSUNI_CINEROOM_ID) {
    return -1;
  }
  return 1;
}
