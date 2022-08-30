export default class ApprovalCount {
  approvedCount: number = 0;
  submittedCount: number = 0;
  rejectedCount: number = 0;
  canceledCount: number = 0;

  constructor(approvalCount?: ApprovalCount) {
    //
    if (approvalCount) {
      Object.assign(this, { ...approvalCount });
    }
  }
}
