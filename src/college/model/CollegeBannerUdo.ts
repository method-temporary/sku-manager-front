import { LangSupport, langSupportCdo } from 'shared/components/Polyglot';

import { CollegeBannerContentModel } from './CollegeBannerContentModel';
import { CollegeBannerModel } from './CollegeBannerModel';

export class CollegeBannerUdo {
  collegeBannerContents: CollegeBannerContentModel[] = [];
  collegeId: string = '';
  langSupports: LangSupport[] = [];
  registeredTime: number = 0;
  title: string = '';
  viewType: string = '';
  visible: number = 0;

  static toUdoByModel(collegeBannerModel: CollegeBannerModel) {
    //
    const collegeBannerContents = collegeBannerModel.collegeBannerContents.map(
      (collegeBannerContent) => new CollegeBannerContentModel(collegeBannerContent)
    );
    const collegeId = collegeBannerModel.collegeId;
    const langSupports = langSupportCdo(collegeBannerModel.langSupports);
    const registeredTime = collegeBannerModel.registeredTime;
    const title = collegeBannerModel.title;
    const viewType = collegeBannerModel.viewType;
    const visible = collegeBannerModel.visible;

    return {
      collegeBannerContents,
      collegeId,
      langSupports,
      registeredTime,
      title,
      viewType,
      visible,
    } as CollegeBannerUdo;
  }
}
