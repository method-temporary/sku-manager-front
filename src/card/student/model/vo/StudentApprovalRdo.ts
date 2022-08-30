import { ProposalState } from 'shared/model';

export default class StudentApprovalRdo {
  //
  startDate: number = 0;
  endDate: number = 0;
  limit: number = 0;
  offset: number = 0;

  proposalState: ProposalState = ProposalState.All;
  studentName: string = '';
  departmentName: string = '';
  cardName: string = '';

  constructor(studentApprovalRdo?: StudentApprovalRdo) {
    if (studentApprovalRdo) {
      Object.assign(this, { ...studentApprovalRdo });
    }
  }
}
