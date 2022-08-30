import { decorate, observable } from 'mobx';

import { PolyglotModel, DramaEntityObservableModel } from 'shared/model';
import { LangSupport, DEFAULT_LANGUAGE } from 'shared/components/Polyglot';

import { CollegeBannerContentModel } from './CollegeBannerContentModel';

export class CollegeBannerModel extends DramaEntityObservableModel {
  //
  title: string = '';
  viewType: string = '3';
  collegeId: string = '';
  visible: number = 1;

  collegeBannerContents: CollegeBannerContentModel[] = [];

  registeredTime: number = 0;
  registrantName: PolyglotModel = new PolyglotModel();

  langSupports: LangSupport[] = [DEFAULT_LANGUAGE];

  constructor(collegeBanner?: CollegeBannerModel) {
    //
    super();
    if (collegeBanner) {
      //const period = collegeBanner.period && new NewDatePeriod(collegeBanner.period) || new NewDatePeriod();

      //Object.assign(this, { ...collegeBanner, period });
      this.collegeBannerContents =
        (collegeBanner.collegeBannerContents &&
          collegeBanner.collegeBannerContents.length &&
          collegeBanner.collegeBannerContents.map(
            (collegeBannerContent) => new CollegeBannerContentModel(collegeBannerContent)
          )) ||
        this.collegeBannerContents;

      const registrantName =
        (collegeBanner.registrantName && new PolyglotModel(collegeBanner.registrantName)) || this.registrantName;

      Object.assign(this, { ...collegeBanner, registrantName });
    }
  }

  static isBlank(collegeBanner: CollegeBannerModel): string {
    if (!collegeBanner.title) return 'Banner 명';
    if (collegeBanner.collegeId === '') return 'College';

    return 'success';
  }
}

decorate(CollegeBannerModel, {
  title: observable,
  viewType: observable,
  collegeId: observable,
  visible: observable,

  collegeBannerContents: observable,

  registeredTime: observable,
  registrantName: observable,
  langSupports: observable,
});
