import { axiosApi as axios } from 'shared/axios/Axios';
import { NameValueList } from 'shared/model';
import { CardWithContents } from '../../../card';
import { AxiosReturn } from '../../../shared/present';

// const BASE_URL = '/api/course/coursePlans';
const BASE_URL = '/api/lecture/cards/admin';

// export function findAllCourseByCommunityId(communityId: string): Promise<CommunityCourse[] | undefined> {
export function findAllCourseByCommunityId(communityId: string): Promise<CardWithContents[] | undefined> {
  return (
    axios
      // .get<CommunityCourse[]>(`${BASE_URL}/courseList`, {
      .get<CardWithContents[]>(`${BASE_URL}/findByCommunityId/${communityId}`)
      .then(AxiosReturn)
  );
}

export function updateCoursePlan(coursePlanId: string, nameValueList: NameValueList) {
  return axios.put(`${BASE_URL}/${coursePlanId}`, nameValueList);
}
