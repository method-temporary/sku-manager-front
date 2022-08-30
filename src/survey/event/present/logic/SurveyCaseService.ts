import autobind from 'autobind-decorator';
import { action, observable, runInAction } from 'mobx';
import _ from 'lodash';

import { OrderedOffset } from 'shared/model';

import SurveyCaseApi from '../apiclient/SurveyCaseApi';
import SurveyCaseModel from '../../model/SurveyCaseModel';
import RoundPartModel from '../../model/RoundPartModel';
import ScheduleApi from '../apiclient/ScheduleApi';
import SurveyCaseCriteriaModel from '../../model/SurveyCaseCriteriaModel';

@autobind
export default class SurveyCaseService {
  //
  static instance: SurveyCaseService;

  surveyCaseApi: SurveyCaseApi;
  scheduleApi: ScheduleApi;

  @observable
  surveyCases: SurveyCaseModel[] = [];

  @observable
  surveyCase: SurveyCaseModel = new SurveyCaseModel();

  @observable
  roundPart: RoundPartModel = new RoundPartModel();

  constructor(surveyCaseApi: SurveyCaseApi, scheduleApi: ScheduleApi) {
    this.surveyCaseApi = surveyCaseApi;
    this.scheduleApi = scheduleApi;
  }

  @action
  async registerSurveyCase(surveyCase: SurveyCaseModel) {
    const surveyCaseCdo = {
      audienceKey: surveyCase.patronKey,
      managementNumber: surveyCase.managementNumber,
      titles: surveyCase.titles,
      descriptions: this.roundPart.descriptions,
      surveyFormId: surveyCase.surveyFormId,
      surveyEvent: this.roundPart.surveyEvent,
      period: this.roundPart.period,
      operator: this.roundPart.operator,
      anonymous: this.roundPart.anonymous,
      targetRespondentCount: this.roundPart.targetRespondentCount,
      supportedLanguages: this.roundPart.supportedLanguages,
    };

    return this.surveyCaseApi.registerSurveyCase(surveyCaseCdo);
  }

  @action
  async findSurveyCase(surveyCaseId: string) {
    const surveyCase = await this.surveyCaseApi
      .findSurveyCase(surveyCaseId)
      .then((surveyCase) => new SurveyCaseModel(surveyCase));
    runInAction(() => {
      this.surveyCase = surveyCase;
      this.roundPart = surveyCase.roundPart;
    });
  }

  @action
  async findSurveyCaseByFeedId(surveyCaseId: string) {
    const surveyCase = await this.surveyCaseApi.findSurveyCaseByFeedId(surveyCaseId);
    return surveyCase.commentFeedbackId;
  }

  countAllSurveyCases() {
    return this.surveyCaseApi.countAllSurveyCases();
  }

  @action
  async findSurveyCases(orderedOffset?: OrderedOffset) {
    if (!orderedOffset) return;
    const surveyCases = await this.surveyCaseApi.findSurveyCases(orderedOffset);
    runInAction(() => (this.surveyCases = surveyCases.map((surveyCase) => new SurveyCaseModel(surveyCase))));
  }

  @action
  async findSurveyCasesByCriteria(criteria: SurveyCaseCriteriaModel, orderedOffset: OrderedOffset) {
    const surveyCases = await this.surveyCaseApi.findSurveyCasesByCriteria(criteria, orderedOffset);
    runInAction(() => (this.surveyCases = surveyCases.map((surveyCase) => new SurveyCaseModel(surveyCase))));
  }

  @action
  async saveSurveyCase() {
    if (!this.surveyCase.id || this.surveyCase.id.length === 0) {
      await this.registerSurveyCase(this.surveyCase).then((surveyCaseId) =>
        runInAction(() => {
          this.surveyCase.id = surveyCaseId;
          this.surveyCase.roundPart.surveyCaseId = surveyCaseId;
        })
      );
    } else {
      await this.modifySurveyCase(this.surveyCase);
    }
  }

  @action
  async openSurvey(surveyCaseId: string, round: number) {
    if (this.roundPart.hasValidPeriod()) {
      const surveySummaryId = await this.scheduleApi.openSurvey(surveyCaseId, round);
      return surveySummaryId;
    }
    return '';
  }

  cancelSurvey(surveyCaseId: string, round: number) {
    return this.scheduleApi.cancelSurvey(surveyCaseId, round);
  }

  @action
  async modifySurveyCase(surveyCase: SurveyCaseModel) {
    await this.surveyCaseApi.modifySurveyCase(surveyCase);
    await this.surveyCaseApi.modifyRoundPart(this.roundPart);
  }

  @action
  clearSurveyCaseProp() {
    this.surveyCase = new SurveyCaseModel();
  }

  @action
  changeSurveyCaseProp(prop: string, value: any) {
    const changedSurveyCase = _.set(this.surveyCase, prop, value);
    this.surveyCase = changedSurveyCase;
  }

  @action
  changeSurveyCaseLangString(prop: string, lang: string, string: string) {
    const langStringMap = _.get(this.surveyCase, `${prop}.langStringMap`);
    langStringMap.set(lang, string);
    this.surveyCase = _.set(this.surveyCase, `${prop}.langStringMap`, langStringMap);
  }

  @action
  changeRoundPartProp(prop: string, value: any) {
    this.roundPart = _.set(this.roundPart, prop, value);
  }

  @action
  changeRoundPartLangString(prop: string, lang: string, value: string) {
    const langStringMap = _.get(this.roundPart, `${prop}.langStringMap`);
    langStringMap.set(lang, value);
    this.roundPart = _.set(this.roundPart, `${prop}.langStringMap`, langStringMap);
  }

  @action
  clear() {
    this.surveyCase = new SurveyCaseModel();
  }

  @action
  setSurveyCase(surveyCase: SurveyCaseModel) {
    this.surveyCase = new SurveyCaseModel(surveyCase);
  }
}

Object.defineProperty(SurveyCaseService, 'instance', {
  value: new SurveyCaseService(SurveyCaseApi.instance, ScheduleApi.instance),
  writable: false,
  configurable: false,
});
