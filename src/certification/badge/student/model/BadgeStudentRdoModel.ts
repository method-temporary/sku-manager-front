export class BadgeStudentRdoModel {
  //
  badgeId: string = '';
  badgeIssueState: string = '';
  badgeStudentState: string = '';
  name: string = '';
  company: string = '';
  department: string = '';
  email: string = '';
  startDate: number = 0;
  endDate: number = 0;
  employed: boolean | undefined;
  offset: number = 0;
  limit: number = 20;
}
