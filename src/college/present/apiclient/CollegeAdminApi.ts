import { axiosApi as axios } from '@nara.platform/accent';
import CollegeAdminRdo from '../../model/dto/CollegeAdminRdo';
import CollegeSdo from '../../model/dto/CollegeSdo';
import { OffsetElementList } from 'shared/model';
import { CollegeModel } from '../../model/CollegeModel';
import CollegeDisplayOrderUdo from '../../model/dto/CollegeDisplayOrderUdo';
import { CollegeChannelRom } from '../../model/dto/CollegeChannelRom';

class CollegeAdminApi {
  URL = `/api/college/colleges/admin`;

  static instance: CollegeAdminApi;

  findByCollegeAdminRdo(collegeAdminRdo: CollegeAdminRdo): Promise<OffsetElementList<CollegeChannelRom>> {
    //
    return axios
      .get(this.URL, { params: collegeAdminRdo })
      .then((response) => OffsetElementList.fromResponse(response.data));
  }

  register(collegeSdo: CollegeSdo): Promise<string> {
    //
    delete collegeSdo.displayOrder;
    return axios.post(this.URL, collegeSdo).then((response) => (response && response.data) || '');
  }

  findCollegeSdo(id: string): Promise<CollegeSdo> {
    //
    return axios.get(this.URL + `/${id}`).then((response) => (response && response.data) || null);
  }

  modify(id: string, collegeSdo: CollegeSdo): Promise<void> {
    //
    delete collegeSdo.displayOrder;
    return axios.put(this.URL + `/${id}`, collegeSdo).then((response) => (response && response.data) || null);
  }

  remove(id: string): Promise<void> {
    //
    return axios.delete(this.URL + `/${id}`).then((response) => (response && response.data) || null);
  }

  setUpDisplayOrders(collegeDisplayOrderUdo: CollegeDisplayOrderUdo): Promise<void> {
    //
    return axios
      .put(this.URL + `/displayOrders`, collegeDisplayOrderUdo)
      .then((response) => (response && response.data) || null);
  }
}

CollegeAdminApi.instance = new CollegeAdminApi();
export default CollegeAdminApi;
