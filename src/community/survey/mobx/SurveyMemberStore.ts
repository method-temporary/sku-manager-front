import { observable, action, computed } from 'mobx';
import { Moment } from 'moment';
import _ from 'lodash';
import { NaOffsetElementList, getEmptyNaOffsetElementList } from 'shared/model';
import Survey, { getEmptySurvey } from '../model/Survey';
import { SurveyMemberQueryModel } from '../model/SurveyMemberQueryModel';

class SurveyMemberStore {
  static instance: SurveyMemberStore;

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
  surveyMemberQuery: SurveyMemberQueryModel = new SurveyMemberQueryModel();

  @action
  clearSurveyQuery() {
    this.surveyMemberQuery = new SurveyMemberQueryModel();
  }

  @action
  setSurveyQuery(query: SurveyMemberQueryModel, name: string, value: string | Moment | number | undefined) {
    this.surveyMemberQuery = _.set(query, name, value);
  }

  @computed
  get selectedSurveyQuery() {
    return this.surveyMemberQuery;
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

SurveyMemberStore.instance = new SurveyMemberStore();

export default SurveyMemberStore;
