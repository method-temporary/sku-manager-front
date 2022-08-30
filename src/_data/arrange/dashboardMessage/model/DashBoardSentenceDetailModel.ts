import { PolyglotModel, NaOffsetElementDetail } from 'shared/model';

export default class DashBoardSentenceDetailModel implements NaOffsetElementDetail<DashBoardSentenceDetailModel> {
  id: string = '';
  name: string = '';
  exposureDateOption: boolean = false;
  state: string = '';
  koreanTexts: string[] = [];
  englishTexts: string[] = [];
  chineseTexts: string[] = [];
  startDate: number = 0;
  endDate: number = 0;
  registrantName: PolyglotModel = new PolyglotModel();
  registeredTime: number = 0;
  modifierName: PolyglotModel = new PolyglotModel();
  modifiedTime: number = 0;
  show = false;

  constructor(dashBoardSentence?: DashBoardSentenceDetailModel) {
    if (dashBoardSentence) {
      const registrantName =
        (dashBoardSentence.registrantName && new PolyglotModel(dashBoardSentence.registrantName)) ||
        this.registrantName;
      const modifierName =
        (dashBoardSentence.modifierName && new PolyglotModel(dashBoardSentence.modifierName)) || this.modifierName;
      const koreanTexts = (dashBoardSentence.koreanTexts && dashBoardSentence.koreanTexts) || [];
      const englishTexts = (dashBoardSentence.englishTexts && dashBoardSentence.englishTexts) || [];
      const chineseTexts = (dashBoardSentence.chineseTexts && dashBoardSentence.chineseTexts) || [];
      Object.assign(this, {
        ...dashBoardSentence,
        registrantName,
        modifierName,
        koreanTexts,
        englishTexts,
        chineseTexts,
      });
    }
  }
}
