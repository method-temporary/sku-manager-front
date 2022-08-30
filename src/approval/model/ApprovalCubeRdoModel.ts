import { ProposalState } from 'shared/model';

class ApprovalCubeRdoModel {
  //
  offset: number = 0;
  limit: number = 0;
  proposalState: ProposalState = ProposalState.All;
  startDate: number = 0;
  endDate: number = 0;
  searchType: string = '';
  studentName: string = '';
  departmentName: string = '';
  cubeName: string = '';
  email: string = '';
  companyCode: string = '';
  sortOrder: string = 'ModifiedTimeDesc';
  paidCourseLearningState: string = '';
}

export default ApprovalCubeRdoModel;
