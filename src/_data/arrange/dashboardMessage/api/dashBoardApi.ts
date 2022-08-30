import { axiosApi as axios } from 'shared/axios/Axios';
import { NameValueList, NaOffsetElementList } from 'shared/model';

import { DashBoardRdoModel, DashBoardSentenceDetailModel, DashBoardSentenceModel } from '../model';

const URL = '/api/arrange/dashboardMessage';

export function findAllDashBoardSentence(
  dashBoardRdo: DashBoardRdoModel
): Promise<NaOffsetElementList<DashBoardSentenceModel>> {
  let params = `startDate=${dashBoardRdo.startDate}&endDate=${dashBoardRdo.endDate}&name=${dashBoardRdo.name}&limit=${dashBoardRdo.limit}&offset=${dashBoardRdo.offset}&dateOptions=${dashBoardRdo.dateOptions}`;
  if (dashBoardRdo.state === 'All') {
    params += '&state=All';
  } else if (dashBoardRdo.state === 'Opened' || dashBoardRdo.state === 'Closed') {
    params += `&state=regular&show=${dashBoardRdo.show}`;
  } else {
    params += '&state=temp';
  }

  return axios.get<NaOffsetElementList<DashBoardSentenceModel>>(`${URL}?${params}`).then((response) => {
    return response && response.data && response.data;
  });
}

export function findDashBoardSentenceDetail(dashBoardId: string): Promise<DashBoardSentenceDetailModel> {
  return axios
    .get<DashBoardSentenceDetailModel>(`${URL}/${dashBoardId}`)
    .then((response) => response && response.data && response.data);
}

export function saveDashBoardSentence(data: any): Promise<DashBoardSentenceDetailModel> {
  return axios.post<DashBoardSentenceDetailModel>(`${URL}`, data).then((response) => {
    return response && response.data && response.data;
  });
}

export function updateExposure(dashBoardId: string, value: any): Promise<DashBoardSentenceDetailModel> {
  return axios.put<DashBoardSentenceDetailModel>(`${URL}/${dashBoardId}`, value).then((response) => {
    return response && response.data && response.data;
  });
}

export function modifyDashBoard(
  dashBoardId: string,
  dashBoardNameValues: NameValueList
): Promise<DashBoardSentenceDetailModel> {
  return axios.put<DashBoardSentenceDetailModel>(`${URL}/${dashBoardId}`, dashBoardNameValues).then((response) => {
    return response && response.data && response.data;
  });
}
