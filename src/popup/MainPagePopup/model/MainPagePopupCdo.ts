import { NewDatePeriod, PolyglotModel } from 'shared/model';
import { DEFAULT_LANGUAGE, LangSupport } from 'shared/components/Polyglot';

import MainPagePopupModel from './MainPagePopupModel';

export class MainPagePopupCdo {
  //
  title: PolyglotModel = new PolyglotModel();
  contents: PolyglotModel = new PolyglotModel(); //본문내용
  open: boolean = false; //게시 플레그(Y,N)
  period: NewDatePeriod = new NewDatePeriod(); //게시 시간

  langSupports: LangSupport[] = [DEFAULT_LANGUAGE];

  constructor(model?: MainPagePopupModel) {
    //
    if (model) {
      const langSupports = (model.langSupports && model.langSupports.map((target) => new LangSupport(target))) || [];

      Object.assign(this, {
        title: model.title,
        contents: model.contents,
        open: model.open,
        period: model && model.period,
        langSupports,
      });
    }
  }
}

export default MainPagePopupCdo;
