import { action, observable, runInAction } from 'mobx';
import OperatorModel from '../../model/OperatorModel';
import OperatorWithUserIdentity from '../../model/sdo/OperatorWithUserIdentity';
import OperatorGroupModel from '../../model/OperatorGroupModel';
import OperatorRdo from '../../model/sdo/OperatorRdo';
import { OffsetElementList } from 'shared/model';
import OperatorQueryModel from '../../model/OperatorQueryModel';
import _ from 'lodash';
import OperatorApi from '../apiclient/OperatorApi';
import OperatorCdo from '../../model/sdo/OperatorCdo';
import OperatorRom from 'support/operator/model/sdo/OperatorRom';

class OperatorService {
  //
  static instance: OperatorService;
  operatorApi: OperatorApi;

  constructor(operatorApi: OperatorApi) {
    this.operatorApi = operatorApi;
  }

  @observable
  operatorQuery: OperatorQueryModel = new OperatorQueryModel();

  @action
  changeOperatorQueryProps(name: string, value: any): void {
    //
    this.operatorQuery = _.set(this.operatorQuery, name, value);
  }

  @observable
  operator: OperatorModel = new OperatorModel();

  @observable
  operators: OperatorWithUserIdentity[] = [];

  @observable
  operatorGroups: OperatorGroupModel[] = [];

  @action
  onChangeOperatorProps(name: string, value: any): void {
    //
    this.operator = _.set(this.operator, name, value);
  }

  @action
  async findAllOperatorGroup(): Promise<OperatorGroupModel[]> {
    //
    const operatorGroups = await this.operatorApi.findAllOperatorGroup();

    runInAction(() => {
      this.operatorGroups = operatorGroups;
    });

    return this.operatorGroups;
  }

  @action
  async findByRdo(operatorRdo: OperatorRdo): Promise<OffsetElementList<OperatorWithUserIdentity>> {
    //
    const offsetElementList = await this.operatorApi.findByRdo(operatorRdo);

    runInAction(() => {
      this.operators = offsetElementList.results.map(
        (operator: OperatorWithUserIdentity) => new OperatorWithUserIdentity(operator)
      );
    });

    return offsetElementList;
  }

  @action
  async findOperatorByOperatorGroupId(operatorGroupId: string): Promise<OperatorWithUserIdentity[]> {
    //
    const operatorsWithUserIdentity = await this.operatorApi.findOperatorByOperatorGroupId(operatorGroupId);

    runInAction(() => {
      this.operators = operatorsWithUserIdentity.map(
        (operator: OperatorWithUserIdentity) => new OperatorWithUserIdentity(operator)
      );
    });

    return this.operators;
  }

  @action
  async findOperatorByDenizenId(denizenId: string) {
    //
    const result = await this.operatorApi.findOperatorByDenizenId(denizenId);

    return result;
  }

  registerOperator(operatorCdo: OperatorCdo): Promise<void> {
    //
    return this.operatorApi.registerOperator(operatorCdo);
  }

  removeOperators(operatorIds: string[]): Promise<void> {
    //
    return this.operatorApi.removeOperators(operatorIds);
  }

  @observable
  selectedOperatorIds: string[] = [];

  @action
  setSelectedOperatorIds(ids: string[]): void {
    //
    this.selectedOperatorIds = ids;
  }

  @action
  clearOperatorQuery() {
    //
    this.operatorQuery = new OperatorQueryModel();
  }

  @action
  clearOperatorIds() {
    //
    this.selectedOperatorIds = [];
  }

  @action
  clearOperator(): void {
    //
    this.operator = new OperatorModel();
  }
}

export default OperatorService;
OperatorService.instance = new OperatorService(OperatorApi.instance);
