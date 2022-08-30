import { axiosApi as axios } from '@nara.platform/accent';
import { NaOffsetElementList } from 'shared/model';
import { AxiosReturn } from 'shared/present';
import { setExcelHistoryParams } from 'shared/components/SubActions/sub/ExcelButton/store/ExcelHistoryStore';
import { SearchBox } from '../viewModel/SearchBox';
import { CollegeOrder } from '../model/CollegeOrganization';
import { CollegeModel } from 'college/model/CollegeModel';
import CollegeOrganizationExcelCdo from '../model/CollegeOrganizationExcelCdo';
import CollegeOrganizationResult from '../model/CollegeOrganizationResult';
import { CardWithContents } from '../../../card';

const college_URL = '/api/college/colleges';

// /courses/arranges
const COURSE_URL = '/api/course';
const LECTURE_URL = '/api/lecture';

// http://university.sk.com/api/lecture/lectures?college=CLG00001&limit=8&offset=0&orderBy=STUDENTCOUNT

// export function findAllCollegeOrganization(searchBox: SearchBox): Promise<NaOffsetElementList<CollegeOrganization>> {
export function findAllCollegeOrganization(searchBox: SearchBox): Promise<NaOffsetElementList<CardWithContents>> {
  searchBox.collegeIds = searchBox.college;
  return (
    axios
      // .get<NaOffsetElementList<CollegeOrganization>>(`${LECTURE_URL}/cards/findByRdo`, { params: searchBox })
      .get<NaOffsetElementList<CardWithContents>>(`${LECTURE_URL}/cards/findByRdo`, { params: searchBox })
      .then((response) => response && response.data)
  );
}

export function changeCollegeOrder(collegeId: string, withNewCards: boolean) {
  const params = {
    collegeId,
    withNewCards,
  };

  return axios.post(`${LECTURE_URL}/cardCollegeOrders/college`, params).then(AxiosReturn);
}

export function findCollegeOrderInfo(collegeId: string): Promise<CollegeOrder | undefined> {
  return axios.get<CollegeOrder>(`${LECTURE_URL}/cardCollegeOrders/collegeOrderInfo/${collegeId}`).then(AxiosReturn);
}

export function registerCollegeOrganizations(
  collegeOrganizationExcelCdo: CollegeOrganizationExcelCdo
): Promise<CollegeOrganizationResult> {
  return (
    axios
      // .post<CollegeOrganizationResult>(`${COURSE_URL}/courses/arranges`, collegeOrganizationExcelCdo)
      // .post<CollegeOrganizationResult>(`${LECTURE_URL}/lecturecards/orders`, collegeOrganizationExcelCdo)
      .post<CollegeOrganizationResult>(
        `${LECTURE_URL}/cardCollegeOrders/college/${collegeOrganizationExcelCdo.collegeId}`,
        collegeOrganizationExcelCdo.cardCollegeOrderCdos
      )
      .then((response) => response && response.data)
  );
}

export function removeCollegeOrganizations(collegeId: string) {
  return axios.delete(`${LECTURE_URL}/cardCollegeOrders/college/${collegeId}`).then(AxiosReturn);
}

export function findAllCollegeOrganizationExcel(searchBox: SearchBox): Promise<NaOffsetElementList<CardWithContents>> {
  // ): Promise<NaOffsetElementList<CollegeOrganization>> {
  if (searchBox.offset !== undefined) {
    searchBox.limit = 99999999;
    searchBox.offset = 0;
  }

  const apiUrl = `${LECTURE_URL}/cards/findByRdo`;

  setExcelHistoryParams({
    searchUrl: apiUrl,
    searchParam: searchBox,
    workType: 'Excel Download',
  });

  return (
    axios
      // .get<NaOffsetElementList<CollegeOrganization>>(`${LECTURE_URL}/lectures`, {
      .get<NaOffsetElementList<CardWithContents>>(apiUrl, {
        params: searchBox,
      })
      .then((response) => response && response.data)
  );
}

export function findAllColleges(): Promise<CollegeModel[]> {
  return axios.get<CollegeModel[]>(`${college_URL}/forCurrentCineroom`).then((response) => response && response.data);
}

export function findCollegeCount(collegeId: string) {
  return axios
    .get<number>(`${LECTURE_URL}/cardCollegeOrders/count/college/${collegeId}`)
    .then((response) => response && response.data);
}
