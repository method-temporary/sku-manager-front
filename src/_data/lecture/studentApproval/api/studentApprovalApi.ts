import { axiosApi as axios, paramsSerializer } from 'shared/axios/Axios';
import { AxiosReturn } from 'shared/present';
import { StudentApprovalDetail } from '../model/StudentApprovalDetail';

const BASE_URL = '/api/lecture/studentApproval';

export const findStudentApprovalDetailForAdmin = (id: string): Promise<StudentApprovalDetail | undefined> => {
  const url = `${BASE_URL}/${id}/detail`;

  return axios.get<StudentApprovalDetail>(url).then(AxiosReturn);
};
