export default class UserWorkspaceRdo {
  //
  startTime: number = 0;
  endTime: number = 0;
  skGroup: boolean | null = null;
  parentId: string = '';
  name: string | null = null;

  limit: number = 0;
  offset: number = 0;

  constructor(userWorkspaceRdo?: UserWorkspaceRdo) {
    if (userWorkspaceRdo) {
      Object.assign(this, { ...userWorkspaceRdo });
    }
  }
}
