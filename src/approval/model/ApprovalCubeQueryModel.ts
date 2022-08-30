import { decorate, observable } from 'mobx';

import { QueryModel, ProposalState } from 'shared/model';
import ApprovalCubeRdoModel from './ApprovalCubeRdoModel';

class ApprovalCubeQueryModel extends QueryModel {
  //
  proposalState: ProposalState = ProposalState.All;
  companyCode: string = '';
  paidCourseLearningState: string = '';
  startDate: number = 0;
  endDate: number = 0;
  currentPage: number = 0;
  sortOrder: string = 'ModifiedTimeDesc';

  static asApprovalRdo(approvalQuery: ApprovalCubeQueryModel): ApprovalCubeRdoModel {
    return {
      offset: approvalQuery.offset,
      limit: approvalQuery.limit,
      proposalState:
        approvalQuery && approvalQuery.proposalState === ProposalState.All
          ? ProposalState.Empty
          : approvalQuery.proposalState,
      startDate: approvalQuery && approvalQuery.period && approvalQuery.period.startDateLong,
      endDate: approvalQuery && approvalQuery.period && approvalQuery.period.endDateLong,
      searchType: approvalQuery && approvalQuery.searchPart,
      studentName: approvalQuery.searchPart === 'applicant' ? encodeURIComponent(approvalQuery.searchWord) : '',
      departmentName: approvalQuery.searchPart === 'department' ? encodeURIComponent(approvalQuery.searchWord) : '',
      cubeName: approvalQuery.searchPart === 'courseName' ? encodeURIComponent(approvalQuery.searchWord) : '',
      email: approvalQuery.searchPart === 'email' ? encodeURIComponent(approvalQuery.searchWord) : '',
      companyCode: approvalQuery.companyCode,
      sortOrder: approvalQuery.sortOrder,
      paidCourseLearningState: (approvalQuery && approvalQuery.paidCourseLearningState) || '',
    };
  }

  static asApprovalExcelRdo(approvalQuery: ApprovalCubeQueryModel): ApprovalCubeRdoModel {
    return {
      offset: approvalQuery.offset,
      limit: 99999999,
      proposalState:
        approvalQuery && approvalQuery.proposalState === ProposalState.All
          ? ProposalState.Empty
          : approvalQuery.proposalState,
      startDate: approvalQuery && approvalQuery.period && approvalQuery.period.startDateLong,
      endDate: approvalQuery && approvalQuery.period && approvalQuery.period.endDateLong,
      searchType: approvalQuery && approvalQuery.searchPart,
      studentName: approvalQuery.searchPart === 'applicant' ? encodeURIComponent(approvalQuery.searchWord) : '',
      departmentName: approvalQuery.searchPart === 'department' ? encodeURIComponent(approvalQuery.searchWord) : '',
      cubeName: approvalQuery.searchPart === 'courseName' ? encodeURIComponent(approvalQuery.searchWord) : '',
      email: approvalQuery.searchPart === 'email' ? encodeURIComponent(approvalQuery.searchWord) : '',
      companyCode: approvalQuery.companyCode,
      sortOrder: approvalQuery.sortOrder,
      paidCourseLearningState: (approvalQuery && approvalQuery.paidCourseLearningState) || '',
    };
  }
}

decorate(ApprovalCubeQueryModel, {
  offset: observable,
  limit: observable,
  paidCourseLearningState: observable,
  proposalState: observable,
  companyCode: observable,
});

export default ApprovalCubeQueryModel;
