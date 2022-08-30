import { axiosApi as axios } from 'shared/axios/Axios';
import { AxiosReturn } from 'shared/present/apiclient/AxiosReturn';
import { OffsetElementList } from 'shared/model';
import { AutoEncourageCardParams } from '../model/AutoEncourageCardParams';
import { AutoEncourageCard } from '../model/AutoEncourageCard';

const BASE_URL = '/api/lecture/cards/admin';

export function findAutoEncourageCards(
  params: AutoEncourageCardParams
): Promise<OffsetElementList<AutoEncourageCard> | undefined> {
  const url = `${BASE_URL}/findAutoEncouragedCards`;
  return axios.get<OffsetElementList<AutoEncourageCard>>(url, { params }).then(AxiosReturn);
}
