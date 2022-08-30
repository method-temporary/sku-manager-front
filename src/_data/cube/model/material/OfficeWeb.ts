import { DatePeriod, DatePeriodFunc } from '../../../shared';
import { DramaEntity } from '@nara.platform/accent';
import { getInitOfficeWebUrlInfo, OfficeWebUrlInfo } from './OfficeWebUrlInfo';
import { PatronKey } from '../../../../shared/model';

export interface OfficeWeb extends DramaEntity {
  fileBoxId: string;
  height: number;
  learningPeriod: DatePeriod;
  name: string;
  urlType: string;
  webPageUrl: string;
  webUrlInfo: OfficeWebUrlInfo;
  selfPass: boolean;
}

export function getInitOfficeWeb(): OfficeWeb {
  //
  return {
    fileBoxId: '',
    height: 0,
    learningPeriod: DatePeriodFunc.initialize(),
    name: '',
    urlType: '',
    webPageUrl: '',
    webUrlInfo: getInitOfficeWebUrlInfo(),
    id: '',
    patronKey: new PatronKey(),
    entityVersion: 0,
    selfPass: true,
  };
}
