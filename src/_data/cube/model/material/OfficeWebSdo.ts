import { DatePeriod } from '../../../shared';
import { OfficeWeb } from './OfficeWeb';

export interface OfficeWebSdo {
  fileBoxId: string;
  height: number;
  learningPeriod: DatePeriod;
  name: string;
  urlType: string;
  webPageUrl: string;
}

function fromOfficeWeb(officeWeb: OfficeWeb): OfficeWebSdo {
  return {
    ...officeWeb,
  };
}

export const OfficeWebSdoFunc = { fromOfficeWeb };
