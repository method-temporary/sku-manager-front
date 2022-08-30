import { decorate, observable } from 'mobx';
import { DramaEntityObservableModel, NewDatePeriod } from 'shared/model';
import { OfficeWebUrlInfo } from './vo/OfficeWebUrlInfo';

export class OfficeWebModel extends DramaEntityObservableModel {
  //
  name: string = '';
  fileBoxId: string = '';
  webPageUrl: string = '';
  learningPeriod: NewDatePeriod = new NewDatePeriod();
  webUrlInfo: OfficeWebUrlInfo = new OfficeWebUrlInfo();
  time: number = 0;
  urlType: string = '';
  height: number = 630;
  selfPass: boolean = true;

  mobileExposure: boolean = false;

  constructor(officeWeb?: OfficeWebModel) {
    super();
    if (officeWeb) {
      const webUrlInfo = new OfficeWebUrlInfo(officeWeb.webUrlInfo);
      Object.assign(this, { ...officeWeb, webUrlInfo });
    }
  }
}

decorate(OfficeWebModel, {
  name: observable,
  fileBoxId: observable,
  webPageUrl: observable,
  learningPeriod: observable,
  webUrlInfo: observable,
  time: observable,
  urlType: observable,
  height: observable,
  selfPass: observable,
  mobileExposure: observable,
});
