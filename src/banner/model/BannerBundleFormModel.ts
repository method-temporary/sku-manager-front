import { decorate, observable } from 'mobx';
import { GroupBasedAccessRule, PolyglotModel } from 'shared/model';
import { DEFAULT_LANGUAGE, LangSupport } from 'shared/components/Polyglot';
import OrderedBannerId from './OrderedBannerId';
import { BannerModel } from './BannerModel';

export class BannerBundleFormModel {
  //
  exposureType: 'PC' | 'Mobile' | '' | null = '';
  id: string = '';
  area: number = 39;
  intervalTime: number = 7;
  registeredTime: number = 0;
  name: string = '';
  registrantName: PolyglotModel = new PolyglotModel();
  modifiedTime: number = 0;
  modifierName: string = '';
  groupBasedAccessRule: GroupBasedAccessRule = new GroupBasedAccessRule();
  bannerIds: OrderedBannerId[] = [];

  startDate: number = 0;
  endDate: number = 0;

  banners: BannerModel[] = [];

  endState: boolean = false;

  top: boolean = false;

  langSupports: LangSupport[] = [DEFAULT_LANGUAGE];
}

decorate(BannerBundleFormModel, {
  exposureType: observable,
  area: observable,
  intervalTime: observable,
  registeredTime: observable,

  name: observable,
  registrantName: observable,
  modifiedTime: observable,
  modifierName: observable,

  groupBasedAccessRule: observable,

  startDate: observable,
  endDate: observable,

  bannerIds: observable,

  endState: observable,
  top: observable,

  langSupports: observable,
});
