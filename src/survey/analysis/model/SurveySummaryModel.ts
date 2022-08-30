import { decorate, observable } from 'mobx';
import { DramaEntityObservableModel, LangStrings } from 'shared/model';
import RespondentCountModel from './RespondentCountModel';

export default class SurveySummaryModel extends DramaEntityObservableModel {
  //
  surveyCaseId: string = '';
  titles: LangStrings = new LangStrings();
  respondentCount: RespondentCountModel = new RespondentCountModel();
  round: number = 0;
  lastUpdateTime: number = 0;

  constructor(summary?: SurveySummaryModel) {
    //
    super();
    if (summary) {
      Object.assign(this, summary);
      this.titles = (summary.titles && new LangStrings(summary.titles)) || this.titles;
      this.respondentCount =
        (summary.respondentCount && new RespondentCountModel(summary.respondentCount)) || this.respondentCount;
    }
  }
}

decorate(SurveySummaryModel, {
  surveyCaseId: observable,
  titles: observable,
  respondentCount: observable,
  round: observable,
  lastUpdateTime: observable,
});
