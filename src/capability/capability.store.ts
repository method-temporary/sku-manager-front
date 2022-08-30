import { action, computed, observable, toJS } from 'mobx';
import _ from 'lodash';
import { CapabilityQdo, initializeCapabilityQdo } from './model/CapabilityQdo';

type SelectKeyword = 'companyName' | 'departmentName' | 'name' | 'email' | '';

interface Keyword {
  companyName: string;
  departmentName: string;
  name: string;
  email: string;
}

interface AssessmentResultQuery extends CapabilityQdo {
  searchOption: SelectKeyword;
  searchValue: string;
}

class CapabilityStore {
  static instance: CapabilityStore;

  @observable
  assessmentResultQuery: AssessmentResultQuery = {
    assessmentId: '',
    companyName: '',
    departmentName: '',
    name: '',
    email: '',
    searchOption: '',
    searchValue: '',
    offset: 1,
    limit: 20,
  };

  @observable
  qdo: CapabilityQdo = initializeCapabilityQdo();

  @observable
  _list: any = {};

  @computed
  get list() {
    return toJS(this._list);
  }

  @action.bound
  setQdoAssessmentId(assessmentId: string) {
    this.qdo.assessmentId = assessmentId;
  }

  @action.bound
  setQdo() {
    const keyword: Keyword = {
      companyName: '',
      departmentName: '',
      name: '',
      email: '',
    };

    if (this.assessmentResultQuery.searchOption) {
      keyword[this.assessmentResultQuery.searchOption] = this.assessmentResultQuery.searchValue;
    }

    this.qdo = {
      ...this.assessmentResultQuery,
      ...keyword,
      offset: (this.assessmentResultQuery.offset - 1) * this.assessmentResultQuery.limit,
    };
  }

  @action.bound
  setList(list: any) {
    this._list = list;
  }

  @action.bound
  changeAssessmentResultQueryProps(key: string, value: any) {
    this.assessmentResultQuery = _.set(this.assessmentResultQuery, key, value);
  }
}

CapabilityStore.instance = new CapabilityStore();
export default CapabilityStore;
