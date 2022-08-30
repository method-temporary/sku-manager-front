import moment, { Moment } from 'moment';
import { computed, decorate, observable } from 'mobx';
import { IdName } from 'shared/model';

export class ContentsProvider {
  //
  contentsProviderType: IdName = new IdName();
  url: string = '';
  expiryDate: string = '';

  expiryDateMoment: Moment = moment();

  constructor(contentProvider?: ContentsProvider) {
    //
    if (contentProvider) {
      const contentsProviderType = new IdName(contentProvider.contentsProviderType);
      const expiryDateMoment =
        (contentProvider.expiryDate && moment(contentProvider.expiryDate)) || moment('2100-12-30').startOf('day');
      Object.assign(this, { ...contentProvider, contentsProviderType, expiryDateMoment });
    }
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

decorate(ContentsProvider, {
  contentsProviderType: observable,
  url: observable,
  expiryDate: observable,
  expiryDateMoment: observable,
});
