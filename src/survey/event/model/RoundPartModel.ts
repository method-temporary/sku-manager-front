import { decorate, observable } from 'mobx';
import { NameValueList } from '@nara.platform/accent';
import { DramaEntityObservableModel, LangStrings, NewDatePeriod } from 'shared/model';

import { SurveyProgress } from './SurveyProgress';
import OperatorModel from './OperatorModel';
import SurveyEventModel from './SurveyEventModel';

export default class RoundPartModel extends DramaEntityObservableModel {
  //
  round: number = 1;
  descriptions: LangStrings = new LangStrings();
  surveyProgress: SurveyProgress = SurveyProgress.Preparing;
  period: NewDatePeriod = new NewDatePeriod();
  anonymous: boolean = false;
  targetRespondentCount: number = 0;
  supportedLanguages: string[] = [];
  surveyEvent: SurveyEventModel = new SurveyEventModel();
  operator: OperatorModel = new OperatorModel();

  surveyCaseId: string = '';

  constructor(roundPartApiModel?: any) {
    super();
    if (roundPartApiModel) {
      Object.assign(this, roundPartApiModel);
      this.descriptions =
        (roundPartApiModel.descriptions && new LangStrings(roundPartApiModel.descriptions)) || this.descriptions;
      this.period = new NewDatePeriod(roundPartApiModel.period);
      this.surveyEvent = new SurveyEventModel(roundPartApiModel.surveyEvent);
      this.operator = new OperatorModel(roundPartApiModel.operator);
    } else {
      this.supportedLanguages.push('ko');
    }
  }

  static getNameValueList(roundPart: RoundPartModel) {
    const nameValues = [];
    nameValues.push({ name: 'descriptions', value: JSON.stringify(roundPart.descriptions) });
    nameValues.push({ name: 'period', value: JSON.stringify(roundPart.period) });
    nameValues.push({ name: 'anonymous', value: roundPart.anonymous });
    nameValues.push({ name: 'targetRespondentCount', value: roundPart.targetRespondentCount });
    nameValues.push({ name: 'supportedLanguages', value: JSON.stringify(roundPart.supportedLanguages) });
    nameValues.push({ name: 'surveyEvent', value: JSON.stringify(roundPart.surveyEvent) });
    nameValues.push({ name: 'operator', value: JSON.stringify(roundPart.operator) });

    return { nameValues } as NameValueList;
  }

  hasValidPeriod() {
    return this.period.startDate.length > 0 && this.period.endDate.length > 0;
  }
}

decorate(RoundPartModel, {
  round: observable,
  descriptions: observable,
  surveyProgress: observable,
  period: observable,
  anonymous: observable,
  supportedLanguages: observable,
  surveyCaseId: observable,
});
