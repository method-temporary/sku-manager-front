export interface CollegeQueryModel {
  //
  name: string | null;
  userWorkspace: string | null;
  enabled: boolean | null;
  includeChildrenUserWorkspace: boolean | null;
  limit: number;
  offset: number;
}
