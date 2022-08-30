class BadgeCountModel {
  //
  createdCount: number = 0;
  openApprovalCount: number = 0;
  openedCount: number = 0;
  rejectedCount: number = 0;
  totalCount: number = 0;

  constructor(badgeCountModel?: BadgeCountModel) {
    //
    if (badgeCountModel) {
      Object.assign(this, badgeCountModel);
    }
  }
}

export default BadgeCountModel;
