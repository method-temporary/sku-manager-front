import { ExposureType } from './ExposureType';

export interface Resource {
  id: string;
  name: string;
  content: {
    en: string;
    ko: string;
    zh: string;
  };
  memo: string;
  i18nResourcePathId: string;
  exposureType?: ExposureType;
}
