import { decorate, observable } from 'mobx';

import { PolyglotModel, DramaEntityObservableModel } from 'shared/model';
import { LangSupport, isPolyglotBlank, Language } from 'shared/components/Polyglot';

export class CollegeBannerContentModel extends DramaEntityObservableModel {
  id: string = '';
  entityVersion: number = 0;

  collegeBannerId: string = '';
  collegeBannerOrder: number = 1;
  imageUrl: PolyglotModel = new PolyglotModel();
  useLink: number = 1;
  linkUrl: PolyglotModel = new PolyglotModel();
  visible: number = 1;

  langSupports: LangSupport[] = [];

  constructor(collegeBannerContent?: CollegeBannerContentModel) {
    //
    super();
    if (collegeBannerContent) {
      const imageUrl =
        (collegeBannerContent.imageUrl && new PolyglotModel(collegeBannerContent.imageUrl)) || this.imageUrl;
      const linkUrl = (collegeBannerContent.linkUrl && new PolyglotModel(collegeBannerContent.linkUrl)) || this.linkUrl;
      Object.assign(this, { ...collegeBannerContent, imageUrl, linkUrl });
    }
  }

  static isBlank(langSupports: LangSupport[], collegeBannerContents: CollegeBannerContentModel[]): string {
    let returnMsg = 'success';
    collegeBannerContents.map((collegeBannerContent) => {
      if (returnMsg == 'success' && isPolyglotBlank(langSupports, collegeBannerContent.imageUrl)) returnMsg = 'Image';
      if (returnMsg == 'success' && collegeBannerContent.useLink === 1) {
        if (isPolyglotBlank(langSupports, collegeBannerContent.linkUrl)) returnMsg = 'Banner Link';
        else {
          langSupports.map((langSupport) => {
            if (
              langSupport.lang === Language.Ko &&
              collegeBannerContent.linkUrl.ko.toLowerCase().indexOf('http://') !== 0 &&
              collegeBannerContent.linkUrl.ko.toLowerCase().indexOf('https://') !== 0
            ) {
              returnMsg = 'http';
            }
            if (
              langSupport.lang === Language.En &&
              collegeBannerContent.linkUrl.en.toLowerCase().indexOf('http://') !== 0 &&
              collegeBannerContent.linkUrl.en.toLowerCase().indexOf('https://') !== 0
            ) {
              returnMsg = 'http';
            }
            if (
              langSupport.lang === Language.Zh &&
              collegeBannerContent.linkUrl.zh.toLowerCase().indexOf('http://') !== 0 &&
              collegeBannerContent.linkUrl.zh.toLowerCase().indexOf('https://') !== 0
            ) {
              returnMsg = 'http';
            }
          });
        }
      }
    });
    return returnMsg;
  }
}

decorate(CollegeBannerContentModel, {
  id: observable,
  entityVersion: observable,

  collegeBannerId: observable,
  collegeBannerOrder: observable,
  imageUrl: observable,
  useLink: observable,
  linkUrl: observable,
  visible: observable,
});
