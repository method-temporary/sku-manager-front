import { createStore } from './store';
import UserWorkspaceModel from 'userworkspace/model/UserWorkspaceModel';

export const [setUserWorkspaces, onUserWorkspaces, getUserWorkspaces, useUserWorkspaces] =
  createStore<UserWorkspaceModel[]>();
