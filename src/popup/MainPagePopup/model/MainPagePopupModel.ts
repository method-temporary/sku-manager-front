import { decorate, observable } from 'mobx';

import { NewDatePeriod, PolyglotModel } from 'shared/model';
import { DEFAULT_LANGUAGE, LangSupport, langSupportCdo } from 'shared/components/Polyglot';

import MainPagePopupUdo from './MainPagePopupUdo';
import MainPagePopupCdo from './MainPagePopupCdo';

export class MainPagePopupModel {
  //
  id: string = '';
  title: PolyglotModel = new PolyglotModel();
  contents: PolyglotModel = new PolyglotModel(); //본문내용
  open: boolean = false; //게시 플레그(Y,N)
  registeredTime: number = 0; //생성시간
  modifier: string = '';
  modifiedTime: string = '';

  period: NewDatePeriod = new NewDatePeriod(); //게시 시간

  langSupports: LangSupport[] = [DEFAULT_LANGUAGE];

  constructor(model?: MainPagePopupModel) {
    //
    if (model) {
      const period = (model.period && new NewDatePeriod(model.period)) || new NewDatePeriod();
      const title = new PolyglotModel(model.title);
      const contents = new PolyglotModel(model.contents);
      const langSupports = (model.langSupports && model.langSupports.map((target) => new LangSupport(target))) || [];

      Object.assign(this, {
        ...model,
        period,
        title,
        contents,
        langSupports,
      });
    }
  }

  static isBlankForMainPage(model: MainPagePopupModel): string {
    //
    if (!model.title) return '제목은 필수입력 항목입니다.';
    if (!model.contents) return '내용은 필수입력 항목입니다.';
    if (!model.period) return '기간은 필수입력 항목입니다.';
    return 'success';
  }

  static asUdo(model: MainPagePopupModel): MainPagePopupUdo {
    const langSupports = langSupportCdo(model.langSupports);
    return {
      id: model.id,
      title: model.title,
      contents: model.contents,
      open: model.open,
      period: model.period,
      langSupports,
    };
  }

  static asCdo(model: MainPagePopupModel): MainPagePopupCdo {
    const langSupports = langSupportCdo(model.langSupports);
    return {
      title: model.title,
      contents: model.contents,
      open: model.open,
      period: model.period,
      langSupports,
    };
  }
}

decorate(MainPagePopupModel, {
  id: observable,
  title: observable,
  contents: observable,
  open: observable,
  registeredTime: observable,
  modifier: observable,
  modifiedTime: observable,
  period: observable,

  langSupports: observable,
});

export default MainPagePopupModel;
