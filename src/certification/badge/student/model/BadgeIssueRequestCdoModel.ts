import { BadgeIssueState } from './BadgeIssueState';
import { BadgeOperatorIdName } from './BadgeOperatorIdName';

export class BadgeIssueRequestCdoModel {
  //
  students: string[] = [];
  operator: BadgeOperatorIdName = new BadgeOperatorIdName();
  issueState: BadgeIssueState = BadgeIssueState.Issued;
  remark: string = '';
}
