import { computed, decorate, observable } from 'mobx';

export class PisAgreementModel {
  signedDate: number = 0;
  imageFileBoxId: string = ''; // 이미지파일
  signImageFileBoxId: string = '';

  constructor(pisAgreement?: PisAgreementModel) {
    if (pisAgreement) Object.assign(this, { ...pisAgreement });
  }

  @computed
  get getSignedDate() {
    if (this.signedDate) {
      return new Date(this.signedDate).toISOString().slice(0, 10);
    }
    return '';
  }
}

decorate(PisAgreementModel, {
  signedDate: observable,
  imageFileBoxId: observable,
  signImageFileBoxId: observable,
});
