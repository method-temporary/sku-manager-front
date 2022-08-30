import { axiosApi as axios } from 'shared/axios/Axios';
import { OffsetElementList } from 'shared/model';
import { setExcelHistoryParams } from 'shared/components/SubActions/sub/ExcelButton/store/ExcelHistoryStore';
import { MemberModel, MemberRdo } from '../model';

class MemberApi {
  //
  URL = '/api/approval/members';
  ADMIN_URL = '/api/approval/admin/members';

  static instance: MemberApi;

  findMemberById(id: string): Promise<MemberModel> {
    //
    return axios.get(`${this.URL}/byId?id=${id}`).then((response) => response && response.data);
  }

  findMemberByIds(ids: string[]): Promise<MemberModel[]> {
    //
    return axios.post(`${this.ADMIN_URL}/byIds`, ids).then((response) => response && response.data);
  }

  findMemberByIdsExcel(ids: string[]): Promise<MemberModel[]> {
    return axios.post(`${this.ADMIN_URL}/byIds/forExcel`, ids).then((response) => response && response.data);
  }

  findMemberByAudienceId(id: string): Promise<MemberModel> {
    //
    return axios.get(`${this.URL}/byAudienceId?audienceId=${id}`).then((response) => response && response.data);
  }

  findMemberByCreationTime(memberSearchRdo: MemberRdo): Promise<OffsetElementList<MemberModel>> {
    //
    const apiUrl = `${this.URL}/byCreationTime`;

    setExcelHistoryParams({
      searchUrl: apiUrl,
      searchParam: memberSearchRdo,
      workType: 'Excel Download',
    });

    return axios
      .getLoader(apiUrl, { params: memberSearchRdo })
      .then((response) => OffsetElementList.fromResponse(response.data));
  }
}

MemberApi.instance = new MemberApi();
export default MemberApi;
