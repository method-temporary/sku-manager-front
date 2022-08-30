import { DramaEntityObservableModel } from 'shared/model';
import { decorate, observable } from 'mobx';

import { PolyglotModel } from 'shared/model';
import { LangSupport, DEFAULT_LANGUAGE } from 'shared/components/Polyglot';

export class BadgeCategoryModel extends DramaEntityObservableModel {
  //
  id: string = '';
  name: PolyglotModel = new PolyglotModel();
  displayOrder: number = 0;
  registrantName: PolyglotModel = new PolyglotModel();
  registeredTime: number = 0;
  cineroomId: string = '';
  iconPath: string = '';
  backgroundImagePath: string = '';
  topImagePath: string = '';
  themeColor: string = '';

  checked: boolean = false;

  langSupports: LangSupport[] = [DEFAULT_LANGUAGE];

  constructor(badgeCategory?: BadgeCategoryModel) {
    super();
    if (badgeCategory) {
      const name = (badgeCategory.name && new PolyglotModel(badgeCategory.name)) || new PolyglotModel();
      const registrantName =
        (badgeCategory.registrantName && new PolyglotModel(badgeCategory.registrantName)) || new PolyglotModel();
      const langSupports =
        badgeCategory.langSupports &&
        badgeCategory.langSupports.map((langSupport) => new LangSupport(langSupport) || new LangSupport());

      Object.assign(this, { ...badgeCategory, name, registrantName, langSupports });
    }
  }
}

decorate(BadgeCategoryModel, {
  id: observable,
  name: observable,
  displayOrder: observable,
  registrantName: observable,
  registeredTime: observable,
  checked: observable,
  backgroundImagePath: observable,
  themeColor: observable,
  topImagePath: observable,
  iconPath: observable,
  langSupports: observable,
});
