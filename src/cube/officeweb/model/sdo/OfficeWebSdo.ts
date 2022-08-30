import { decorate, observable } from 'mobx';
import { NewDatePeriod } from 'shared/model';

export class OfficeWebSdo {
  //
  name: string = '';
  fileBoxId: string = '';
  webPageUrl: string = '';
  learningPeriod: NewDatePeriod = new NewDatePeriod();
  urlType: string = '';
  height: number = 630;
  selfPass: boolean = true;
  mobileExposure: boolean = false;

  constructor(officeWebSdo?: OfficeWebSdo) {
    if (officeWebSdo) {
      Object.assign(this, { ...officeWebSdo });
    }
  }
}

decorate(OfficeWebSdo, {
  name: observable,
  fileBoxId: observable,
  webPageUrl: observable,
  learningPeriod: observable,
  urlType: observable,
  height: observable,
  selfPass: observable,
  mobileExposure: observable,
});
