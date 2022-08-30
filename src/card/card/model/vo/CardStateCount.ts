import { decorate, observable } from 'mobx';

export class CardStateCount {
  //
  closedCount: number = 0;
  createdCount: number = 0;
  openApprovalCount: number = 0;
  openedCount: number = 0;
  rejectedCount: number = 0;
}

decorate(CardStateCount, {
  closedCount: observable,
  createdCount: observable,
  openApprovalCount: observable,
  openedCount: observable,
  rejectedCount: observable,
});
