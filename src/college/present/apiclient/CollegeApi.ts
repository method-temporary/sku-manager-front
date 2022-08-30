import useSWR from 'swr';
import { axiosApi as axios } from 'shared/axios/Axios';
import { OffsetElementList } from 'shared/model';
import { AxiosReturn } from 'shared/present';

import { CollegeBannerRdoModel } from '../../model/CollegeBannerRdoModel';
import { CollegeBannerModel } from '../../model/CollegeBannerModel';
import { CollegeModel } from '../../model/CollegeModel';
import { JobDutyModel } from '../../model/JobDutyModel';
import { JobGroupModel } from '../../model/JobGroupModel';
import { CollegeBannerUdo } from '../../model/CollegeBannerUdo';

const collegeApi = {
  admin: {
    findAllCollege: '/api/college/colleges/admin',
  },
};

export function useFindAllCollege() {
  const {
    data: collegeData,
    error,
    mutate: collegeMutate,
  } = useSWR(collegeApi.admin.findAllCollege, (url: string) => {
    return axios.get<OffsetElementList<CollegeModel>>(url).then(AxiosReturn);
  });

  return {
    collegeData,
    error,
    collegeMutate,
  };
}

export default class CollegeApi {
  URL = '/api/college/colleges';
  ADMIN_URL = '/api/college/colleges/admin';
  JOB_DUTY_URL = '/api/college/jobDutys';
  JOB_GROUP_URL = '/api/college/jobGroups';

  static instance: CollegeApi;

  registerCollege(college: CollegeModel) {
    return axios.post<string>(this.URL, college).then((response) => (response && response.data) || null);
  }

  findCollege(collegeId: string) {
    //
    return axios.get<CollegeModel>(this.URL + `/${collegeId}`).then((response) => (response && response.data) || null);
  }

  findAllColleges() {
    //
    return axios
      .get<OffsetElementList<CollegeModel>>(this.ADMIN_URL)
      .then((response) => (response && response.data && response.data) || null);
  }

  findCollegesByCineroomId() {
    //
    return axios
      .get<CollegeModel[]>(this.URL + `/panoptofolders`)
      .then((response) => (response && response.data) || null);
  }

  findCollegesForCurrentCineroom() {
    //
    return axios
      .get<CollegeModel[]>(this.URL + `/forCurrentCineroom`)
      .then((response) => (response && response.data) || null);
  }

  findFamilyCollegesForCurrentCineroom() {
    //
    return axios
      .get<CollegeModel[]>(this.URL + `/findFamilyCollegesForCurrentCineroom`)
      .then((response) => (response && response.data) || null);
  }

  findCollegeBannersByQuery(collegeBannerRdo: CollegeBannerRdoModel) {
    return axios
      .get<OffsetElementList<CollegeBannerModel>>(this.URL + '/banner/searchKey', {
        params: collegeBannerRdo,
      })
      .then(
        (response: any) =>
          (response && response.data && new OffsetElementList<CollegeBannerModel>(response.data)) ||
          new OffsetElementList()
      );
  }

  findCollegeBanner(collegeBannerId: string) {
    //
    return axios
      .get<CollegeBannerModel>(this.URL + `/banner/${collegeBannerId}`)
      .then((response) => (response && response.data) || null);
  }

  registerCollegeBanner(collegeBannerCdo: CollegeBannerModel) {
    //
    return axios.post<void>(this.URL + '/banner/flow', collegeBannerCdo);
  }

  modifyCollegeBanner(collegeBannerId: string, collegeBannerUdo: CollegeBannerUdo) {
    //
    return axios.put<void>(this.URL + `/banner/flow/${collegeBannerId}`, collegeBannerUdo);
  }

  removeCollegeBanner(collegeBannerId: string) {
    //
    return axios.delete(this.URL + `/banner/flow/${collegeBannerId}`);
  }

  // JOB DUTY
  findAllJobDuty() {
    //
    return axios.get<JobDutyModel[]>(this.JOB_DUTY_URL).then((response) => (response && response.data) || null);
  }

  // JOB GROUP
  findAllJobGroup() {
    //
    return axios.get<JobGroupModel[]>(this.JOB_GROUP_URL).then((response) => (response && response.data) || null);
  }
}

Object.defineProperty(CollegeApi, 'instance', {
  value: new CollegeApi(),
  writable: false,
  configurable: false,
});
