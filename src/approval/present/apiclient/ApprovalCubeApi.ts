import { axiosApi as axios } from 'shared/axios/Axios';
import { OffsetElementList, IdName } from 'shared/model';
import { ApprovalCubeModel } from '../../model/ApprovalCubeModel';
import ApprovalCubeRdoModel from '../../model/ApprovalCubeRdoModel';
import { ApprovalCubeWithOtherModel } from '../../model/ApprovalCubeWithOtherModel';
import { setExcelHistoryParams } from 'shared/components/SubActions/sub/ExcelButton/store/ExcelHistoryStore'

export default class ApprovalCubeApi {
  //
  static instance: ApprovalCubeApi;
  devUrl = process.env.NODE_ENV === 'development' ? process.env.REACT_APP_DEVELOPMENT_URL : '';
  lectureApprovalURL = '/api/lecture/studentApproval';
  cubeApprovalURL = '/api/cube/studentApprovals';
  //lectureApprovalURL = 'http://localhost:8080/api/lecture/studentApproval';

  static convertOffsetElementList(response: any): OffsetElementList<ApprovalCubeModel> {
    //
    if (!response || !response.data) {
      return new OffsetElementList<ApprovalCubeModel>();
    }
    const offsetElementList = new OffsetElementList<ApprovalCubeModel>(response.data);

    offsetElementList.results = offsetElementList.results.map((result) => new ApprovalCubeModel(result));
    return offsetElementList;
  }

  // BasicSearch
  findApprovalCubesForSearch(approvalCubeRdoModel: ApprovalCubeRdoModel) {
    //
    return axios
      .getLoader<OffsetElementList<ApprovalCubeModel>>(this.cubeApprovalURL + `/admin`, {
        params: approvalCubeRdoModel,
      })
      .then((response: any) => ApprovalCubeApi.convertOffsetElementList(response));
  }

  findApprovalCubesForExcel(approvalCubeRdoModel: ApprovalCubeRdoModel): Promise<OffsetElementList<ApprovalCubeModel>> {
    const apiUrl = this.cubeApprovalURL + `/admin`;

    setExcelHistoryParams({
      searchUrl: apiUrl,
      searchParam: approvalCubeRdoModel,
      workType: 'Excel Download'
    })

    //
    return axios
      .get(apiUrl, { params: approvalCubeRdoModel })
      .then((response) => OffsetElementList.fromResponse(response.data));
  }

  findPersonalCube(cubeId: string) {
    //
    return axios
      .get<ApprovalCubeModel>(this.lectureApprovalURL + `/${cubeId}`)
      .then((response) => (response && response.data) || null);
  }

  findApprovalCube(studentId: string) {
    //
    return (
      axios
        // .get<ApprovalCubeModel>(this.lectureApprovalURL + `/${studentId}`)
        // .get<ApprovalCubeModel>(this.cubeApprovalURL + `/admin/${studentId}/detail`)
        .getLoader<ApprovalCubeWithOtherModel>(this.cubeApprovalURL + `/admin/${studentId}/detail`)
        .then((response) => (response && response.data) || null)
    );
  }

  findLectureApprovalSelect() {
    return axios
      .get<IdName[]>(this.lectureApprovalURL + '/lectures')
      .then((response) => (response && Array.isArray(response.data) && response.data) || []);
  }
}

Object.defineProperty(ApprovalCubeApi, 'instance', {
  value: new ApprovalCubeApi(),
  writable: false,
  configurable: false,
});
