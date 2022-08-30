import OperatorGroupModel from '../../model/OperatorGroupModel';
import { axiosApi } from 'shared/axios/Axios';
import OperatorRdo from '../../model/sdo/OperatorRdo';
import { OffsetElementList } from 'shared/model';
import OperatorWithUserIdentity from '../../model/sdo/OperatorWithUserIdentity';
import OperatorCdo from '../../model/sdo/OperatorCdo';
import qs from 'qs';
import OperatorRom from 'support/operator/model/sdo/OperatorRom';

class OperatorApi {
  // TODO: URL Fix
  static instance: OperatorApi;

  URL = '/api/support/admin';

  findAllOperatorGroup(): Promise<OperatorGroupModel[]> {
    //
    return axiosApi.getLoader(this.URL + `/operatorGroups`).then((response) => (response && response.data) || null);
  }

  findByRdo(operatorRdo: OperatorRdo): Promise<OffsetElementList<OperatorWithUserIdentity>> {
    //
    return axiosApi
      .getLoader(this.URL + `/operators`, { params: operatorRdo })
      .then((response) => (response && response.data) || null);
  }

  findOperatorByOperatorGroupId(operatorGroupId: string): Promise<OperatorWithUserIdentity[]> {
    //
    return axiosApi
      .getLoader(this.URL, { params: operatorGroupId })
      .then((response) => (response && response.data) || null);
  }

  findOperatorByDenizenId(denizenId: string): Promise<OperatorRom> {
    //
    return axiosApi
      .getLoader(this.URL + `/operators/byDenizenId/${denizenId}`)
      .then((response) => (response && response.data) || null);
  }

  registerOperator(operatorCdo: OperatorCdo): Promise<void> {
    //
    return axiosApi
      .postLoader(this.URL + `/operators`, operatorCdo)
      .then((response) => (response && response.data) || null);
  }

  removeOperators(operatorIds: string[]): Promise<void> {
    //
    return axiosApi
      .deleteLoader(this.URL + `/operators?operatorIds=${operatorIds}`)
      .then((response) => (response && response.data) || null);
  }
}

export default OperatorApi;
OperatorApi.instance = new OperatorApi();
