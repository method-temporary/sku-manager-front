import autobind from 'autobind-decorator';
import { action, computed, observable, runInAction } from 'mobx';
import SurveySummaryApi from '../apiclient/SurveySummaryApi';
import AnswerSummaryApi from '../apiclient/AnswerSummaryApi';
import SurveySummaryModel from '../../model/SurveySummaryModel';
import AnswerSummaryModel from '../../model/AnswerSummaryModel';

@autobind
export default class SurveySummaryService {
  //
  static instance: SurveySummaryService;

  surveySummaryApi: SurveySummaryApi;

  answerSummaryApi: AnswerSummaryApi;

  @observable
  surveySummary: SurveySummaryModel = new SurveySummaryModel();

  @observable
  answerSummaries: AnswerSummaryModel[] = [];

  constructor(surveySummaryApi: SurveySummaryApi, answerSummaryApi: AnswerSummaryApi) {
    //
    this.surveySummaryApi = surveySummaryApi;
    this.answerSummaryApi = answerSummaryApi;
  }


  @computed
  get answerSummaryMap() {
    const map = new Map<string, AnswerSummaryModel>();
    this.answerSummaries.map(answerSummary => {
      map.set(answerSummary.questionNumber, answerSummary);
    });
    return map;
  }

  @action
  async findSurveySummaryBySurveyCaseIdAndRound(surveyCaseId: string, round: number) {
    const surveySummary = await this.surveySummaryApi.findSurveySummaryBySurveyCaseIdAndRound(surveyCaseId, round);
    runInAction(() => {
      this.surveySummary = surveySummary;
      return surveySummary;
    });
  }

  @action
  async findAnswerSummariesBySurveySummaryId(surveySummaryId: string) {
    const answerSummaries = await this.answerSummaryApi.findAnswerSummariesBySurveySummaryId(surveySummaryId);
    runInAction(() => {
      this.answerSummaries = answerSummaries.map(answerSummary => new AnswerSummaryModel(answerSummary));
      return answerSummaries;
    });
  }
}

Object.defineProperty(SurveySummaryService, 'instance', {
  value: new SurveySummaryService(SurveySummaryApi.instance, AnswerSummaryApi.instance),
  writable: false,
  configurable: false,
});
