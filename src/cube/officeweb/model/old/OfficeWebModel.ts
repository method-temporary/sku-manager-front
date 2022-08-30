import { decorate, observable } from 'mobx';

import { DramaEntity } from '@nara.platform/accent';

import { PatronKey, NameValueList, NewDatePeriod } from 'shared/model';

import { OfficeWebSdo } from '../sdo/OfficeWebSdo';
import { OfficeWebCdoModel } from './OfficeWebCdoModel';

export class OfficeWebModel implements DramaEntity {
  id: string = '';
  entityVersion: number = 0;
  patronKey: PatronKey = new PatronKey();

  name: string = '';
  fileBoxId: string = '';
  webPageUrl: string = '';
  learningPeriod: NewDatePeriod = new NewDatePeriod();
  time: number = 0;
  urlType: string = '';
  height: number = 630; // 임베디드 높이
  selfPass: boolean = true;

  mobileExposure: boolean = false;

  constructor(officeWeb?: OfficeWebModel) {
    //
    if (officeWeb) {
      const learningPeriod =
        (officeWeb.learningPeriod && new NewDatePeriod(officeWeb.learningPeriod)) || this.learningPeriod;
      Object.assign(this, { ...officeWeb, learningPeriod });
    }
  }

  static asSdo(officeWeb: OfficeWebModel): OfficeWebSdo {
    //
    return {
      name: officeWeb.name,
      fileBoxId: officeWeb.fileBoxId,
      webPageUrl: officeWeb.webPageUrl,
      learningPeriod: officeWeb.learningPeriod,
      urlType: officeWeb.urlType,
      height: officeWeb.height || 630,
      selfPass: officeWeb.selfPass,
      mobileExposure: officeWeb.mobileExposure || false,
    };
  }

  static asNameValues(officeWeb: OfficeWebModel): NameValueList {
    const asNameValues = {
      nameValues: [
        {
          name: 'name',
          value: officeWeb.name,
        },
        {
          name: 'fileBoxId',
          value: officeWeb.fileBoxId,
        },
        {
          name: 'webPageUrl',
          value: officeWeb.webPageUrl,
        },
        {
          name: 'height',
          value: String(officeWeb.height),
        },
        // {
        //   name: 'learningPeriod',
        //   value: JSON.stringify(officeWeb.learningPeriod),
        // },
      ],
    };

    return asNameValues;
  }

  static isBlank(officeWeb: OfficeWebModel): string {
    if (!officeWeb.webPageUrl) return '교육자료(URL)를 등록해주세요.';
    return 'success';
  }

  static asCdo(officeWeb: OfficeWebModel): OfficeWebCdoModel {
    //
    return {
      audienceKey: 'r2p8-r@nea-m5-c5',
      name: officeWeb.name,
      fileBoxId: officeWeb.fileBoxId,
      webPageUrl: officeWeb.webPageUrl,
      learningPeriod: officeWeb.learningPeriod,
      mobileExposure: officeWeb.mobileExposure,
    };
  }
}

decorate(OfficeWebModel, {
  id: observable,
  entityVersion: observable,
  patronKey: observable,

  name: observable,
  fileBoxId: observable,
  webPageUrl: observable,
  learningPeriod: observable,
  time: observable,
  urlType: observable,
  height: observable,
  selfPass: observable,
  mobileExposure: observable,
});
