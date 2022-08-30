import { IdName } from 'shared/model';
import { ProposalState } from './vo/ProposalState';

export class StudentRequestCdoModel {
  //
  students: string[] = [];
  actor: IdName = new IdName();
  proposalState: ProposalState = ProposalState.Submitted;
  remark: string = '';
}
