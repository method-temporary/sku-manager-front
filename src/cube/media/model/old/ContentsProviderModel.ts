import { computed, decorate, observable } from 'mobx';
import moment, { Moment } from 'moment';

import { IdName } from 'shared/model';

export class ContentsProviderModel {
  DEFAULT_FORMAT = 'YYYY-MM-DD';

  contentsProviderType: IdName = new IdName();
  url: string = '';
  expiryDateMoment: Moment = moment();
  expiryDate: string = this.expiryDateMoment.format(this.DEFAULT_FORMAT);

  constructor(contentsProvider?: ContentsProviderModel) {
    //
    if (contentsProvider) {
      const contentsProviderType =
        (contentsProvider.contentsProviderType && new IdName(contentsProvider.contentsProviderType)) ||
        this.contentsProviderType;
      Object.assign(this, { ...contentsProvider, contentsProviderType });

      if (contentsProvider.expiryDate === null) {
        // 없으면 기간무제한
        contentsProvider.expiryDate = String('2100-12-30');
      }

      if (contentsProvider.expiryDate && contentsProvider.expiryDate.includes('-')) {
        this.expiryDateMoment = (contentsProvider.expiryDate && moment(contentsProvider.expiryDate)) || moment();
      } else {
        this.expiryDateMoment =
          (contentsProvider.expiryDate && moment(Number(contentsProvider.expiryDate))) || moment();
      }
    }
  }

  set expiryDateObj(date: Date) {
    //
    const momentDate = moment(date);

    this.expiryDateMoment = momentDate;
    this.expiryDate = momentDate.format(this.DEFAULT_FORMAT);
  }

  @computed
  get expiryDateObj() {
    return this.expiryDateMoment && this.expiryDateMoment.toDate();
  }

  @computed
  get expiryDateDot() {
    return this.expiryDateMoment && this.expiryDateMoment.format('YYYY.MM.DD');
  }
}

decorate(ContentsProviderModel, {
  contentsProviderType: observable,
  url: observable,
  expiryDateMoment: observable,
  expiryDate: observable,
});
