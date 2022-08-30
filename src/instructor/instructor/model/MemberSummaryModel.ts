import { decorate, observable } from 'mobx';

export class MemberSummaryModel {
  employeeId: string = '';
  department: string = '';
  introduction: string = '';
  shortIntroduction: string = '';
  name: string = '';
  email: string = '';
  photoId: string = '';
  position: string = '';

  constructor(memberSummary?: MemberSummaryModel) {
    //
    if (memberSummary) Object.assign(this, { ...memberSummary });
  }
}

decorate(MemberSummaryModel, {
  employeeId: observable,
  department: observable,
  introduction: observable,
  shortIntroduction: observable,
  name: observable,
  email: observable,
  photoId: observable,
  position: observable,
});
