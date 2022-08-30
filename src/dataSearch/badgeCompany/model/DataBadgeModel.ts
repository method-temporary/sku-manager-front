import { computed, decorate, observable } from 'mobx';

export class DataBadgeModel {
  //
  badgeId: string = '';
  badgeName: string = '';
  companyName: string = '';
  departmentName: string = '';
  name: string = '';
  email: string = '';
  challengeState: string = '';
  challengeTime: string = '';
  issueState: string = '';
  issueTime: string = '';
  cardIds: string = '';
  issueCnt: string = '';

  groupSequences: number[] = [];

  constructor(model?: DataBadgeModel) {
    //
    if (model) {
      const badgeId = model.badgeId || this.badgeId;
      const badgeName = model.badgeName || this.badgeName;
      Object.assign(this, { ...model, badgeId, badgeName });
    }
  }

  @computed
  get sequences() {
    //
    let sequences = '';
    this.groupSequences?.forEach((seq, index) => (index === 0 ? (sequences = seq + '') : (sequences += ',' + seq)));

    return sequences;
  }
}

decorate(DataBadgeModel, {
  badgeId: observable,
  badgeName: observable,
  companyName: observable,
  departmentName: observable,
  name: observable,
  email: observable,
  challengeState: observable,
  challengeTime: observable,
  issueState: observable,
  issueTime: observable,
  cardIds: observable,
  issueCnt: observable,
});

export default DataBadgeModel;
