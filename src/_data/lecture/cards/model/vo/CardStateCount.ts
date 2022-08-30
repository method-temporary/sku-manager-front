export interface CardStateCount {
  closedCount: number;
  createdCount: number;
  openApprovalCount: number;
  openedCount: number;
  rejectedCount: number;
}

export function getInitCardStateCount(): CardStateCount {
  //
  return {
    closedCount: 0,
    createdCount: 0,
    openApprovalCount: 0,
    openedCount: 0,
    rejectedCount: 0,
  };
}
