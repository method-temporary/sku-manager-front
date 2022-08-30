import { axiosApi as axios } from 'shared/axios/Axios';

import { NameValueList, OffsetElementList } from 'shared/model';

import StudentApprovalCdo from '../../model/vo/StudentApprovalCdo';
import StudentApprovalRdo from '../../model/vo/StudentApprovalRdo';
import StudentApprovalModel from '../../model/StudentApprovalModel';

class StudentApprovalApi {
  //
  URL = '/api/lecture/studentApproval';

  static instance: StudentApprovalApi;

  findByStudentApprovalRdo() {}

  register(studentApprovalCdo: StudentApprovalCdo): Promise<StudentApprovalModel> {
    return axios.post(this.URL, studentApprovalCdo).then((response) => (response && response.data) || null);
  }

  find(id: string): Promise<StudentApprovalModel> {
    return axios.get(this.URL + `?id=${id}`).then((response) => (response && response.data) || null);
  }

  findMyStudentApprovalListByStudentApprovalRdo(
    studentApprovalRdo: StudentApprovalRdo
  ): Promise<OffsetElementList<StudentApprovalModel>> {
    return axios
      .get(this.URL + `/myStudentApprovalList`, { params: studentApprovalRdo })
      .then((response) => OffsetElementList.fromResponse(response.data));
  }

  accept(ids: string[]): Promise<void> {
    return axios.put(this.URL + `/accept?ids=${ids}`).then((response) => (response && response.data) || null);
  }

  reject(ids: string[], nameValueList: NameValueList): Promise<void> {
    return axios
      .put(this.URL + `/reject?ids=${ids}`, nameValueList)
      .then((response) => (response && response.data) || null);
  }
}

StudentApprovalApi.instance = new StudentApprovalApi();
export default StudentApprovalApi;
