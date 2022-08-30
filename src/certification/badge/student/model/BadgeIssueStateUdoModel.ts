import { BadgeIssueState } from './BadgeIssueState';
import { BadgeOperatorIdName } from './BadgeOperatorIdName';

export class BadgeIssueStateUdoModel {
  //
  ids: string[] = [];
  operator: BadgeOperatorIdName = new BadgeOperatorIdName(); // 처리자
  issueState: BadgeIssueState = BadgeIssueState.None;

  constructor(udo?: BadgeIssueStateUdoModel) {
    if (udo) {
      const operator = (udo.operator && new BadgeOperatorIdName(udo.operator)) || this.operator;
      Object.assign(this, { ...udo, operator });
    }
  }
}
