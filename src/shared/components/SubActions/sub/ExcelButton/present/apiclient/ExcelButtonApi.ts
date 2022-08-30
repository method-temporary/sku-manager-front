import { axiosApi } from 'shared/axios/Axios';
import { AxiosResponse } from 'axios';
import { Result, ExcelHistoryModel } from '../../model/ExcelHistoryModel';

const BASE_URL = '/api/data-foundation/excel-history';
// const BASE_URL = '/local';

function AxiosReturn<T>(response: AxiosResponse<T>) {
  if (
    response === null ||
    response === undefined ||
    response.data === null ||
    response.data === null ||
    (response.data as unknown) === ''
  ) {
    return undefined;
  }
  return response.data;
}

export function registerExcelHistory( excelHistoryModel: ExcelHistoryModel): Promise<Result | undefined> {
  const url = `${BASE_URL}`;
  return axiosApi.post<Result>(url, excelHistoryModel).then(AxiosReturn);
}