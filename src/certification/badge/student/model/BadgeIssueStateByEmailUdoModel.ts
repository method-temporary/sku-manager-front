import { BadgeIssueState } from './BadgeIssueState';
import { BadgeOperatorModel } from '../../badge/model/BadgeOperatorModel';

export class BadgeIssueStateByEmailUdoModel {
  //
  emails: string[] = [];
  badgeId: string = '';
  operator: BadgeOperatorModel = new BadgeOperatorModel(); // 처리자
  issueState: BadgeIssueState = BadgeIssueState.None;

  constructor(udo?: BadgeIssueStateByEmailUdoModel) {
    if (udo) {
      const operator = (udo.operator && new BadgeOperatorModel(udo.operator)) || this.operator;
      Object.assign(this, { ...udo, operator });
    }
  }
}
