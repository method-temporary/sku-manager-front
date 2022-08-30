export default class ProposalStateCount {
  approvedCount: number = 0;
  submittedCount: number = 0;
  rejectedCount: number = 0;
  canceledCount: number = 0;

  constructor(approvalCount?: ProposalStateCount) {
    //
    if (approvalCount) {
      Object.assign(this, { ...approvalCount });
    }
  }
}
