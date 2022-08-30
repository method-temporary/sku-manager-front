import { observable, action, computed } from 'mobx';
import { Moment } from 'moment';
import _ from 'lodash';
import { NaOffsetElementList, getEmptyNaOffsetElementList } from 'shared/model';
import Survey, { getEmptySurvey } from '../model/Survey';
import { SurveyQueryModel } from '../model/SurveyQueryModel';

class SurveyStore {
  static instance: SurveyStore;

  originData: any = {};

  @observable
  innerSurveyList: NaOffsetElementList<Survey> = getEmptyNaOffsetElementList();

  @action
  setSurveyList(next: NaOffsetElementList<Survey>) {
    this.innerSurveyList = next;
  }

  @computed
  get surveyList() {
    return this.innerSurveyList;
  }

  @observable
  innerSelected: Survey = getEmptySurvey();

  @action
  select(next: Survey) {
    this.innerSelected = next;
  }

  @computed
  get selected() {
    return this.innerSelected;
  }

  @observable
  surveyQuery: SurveyQueryModel = new SurveyQueryModel();

  @action
  clearSurveyQuery() {
    this.surveyQuery = new SurveyQueryModel();
  }

  @action
  setSurveyQuery(query: SurveyQueryModel, name: string, value: string | Moment | number | undefined) {
    this.surveyQuery = _.set(query, name, value);
  }

  @computed
  get selectedSurveyQuery() {
    return this.surveyQuery;
  }

  @action
  setOriginData(next: any) {
    this.originData = { ...next };
  }

  @action
  getOriginData() {
    return this.originData;
  }
}

SurveyStore.instance = new SurveyStore();

export default SurveyStore;
