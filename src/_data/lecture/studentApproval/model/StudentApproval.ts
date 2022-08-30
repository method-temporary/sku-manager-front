import { DenizenKey } from '@nara.platform/accent';
import { ProposalState } from '_data/shared/ProposalState';

export interface StudentApproval {
  approval: DenizenKey;
  proposalState: ProposalState;
  remark: string;
  time: number;
  studentApprovalHistories: any;
}
