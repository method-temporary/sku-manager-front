import { decorate, observable } from 'mobx';

import { PolyglotModel } from 'shared/model';
import { DEFAULT_LANGUAGE, LangSupport } from 'shared/components/Polyglot';

import { ContentsProviderTypeModel } from './ContentsProviderTypeModel';

export default class ContentsProviderCdoModel {
  id: string = '';
  contentsProviderType: ContentsProviderTypeModel = new ContentsProviderTypeModel();

  name: PolyglotModel = new PolyglotModel();
  areaType: string = 'Internal';
  enabled: boolean = false;
  link: boolean = false;

  phoneNumber: string = '';
  email: string = '';
  url: string = '';
  thumbnailPath: string = '';
  depotId: string = '';
  remark: string = '';

  langSupports: LangSupport[] = [DEFAULT_LANGUAGE];

  static isBlank(contentsProviderCdo: ContentsProviderCdoModel): string {
    if (!contentsProviderCdo.name) return '교육기관명';
    if (!contentsProviderCdo.thumbnailPath) return 'Thumbnail';

    return 'success';
  }
}

decorate(ContentsProviderCdoModel, {
  id: observable,
  contentsProviderType: observable,
  name: observable,
  areaType: observable,
  enabled: observable,
  phoneNumber: observable,
  email: observable,
  link: observable,
  url: observable,
  thumbnailPath: observable,
  depotId: observable,
  remark: observable,
  langSupports: observable,
});
