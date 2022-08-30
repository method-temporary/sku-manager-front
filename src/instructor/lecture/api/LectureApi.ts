import { axiosApi as axios } from 'shared/axios/Axios';
import { CubeCountModel } from '../../../personalcube/model/old/CubeCountModel';
import Lecture from '../model/Lecture';
import { LectureListViewModel } from '../model/LectureListViewModel';
import LectureRdo from '../model/LectureRdo';
import { InstructorCubeAdminRdo } from '../../../cube/cube/model/sdo/InstructorCubeAdminRdo';
import { CubeReactiveModelModel } from '../../../cube/cube';
import { InstructorCubeList } from '../../../cube/cube/model/sdo/InstructorCubeList';

const BASE_URL = '/api/cube';

export function findCommunities(limit: number, offset: number): Promise<any> {
  return axios.get<Lecture[]>(`${BASE_URL}`, {
    params: { limit, offset },
  });
}

export function findAllLectureByQuery(lectureRdo: LectureRdo): Promise<any> {
  return axios.get<Lecture[]>(`${BASE_URL}/cube/searchKeyWithJoinedValue`, {
    params: lectureRdo,
  });
}

export function findAllLectureByQueryNew(cubeInstructorAdminRdo: InstructorCubeAdminRdo): Promise<any> {
  return axios.get<CubeReactiveModelModel[]>(`${BASE_URL}/cube/searchKeyWithJoinedValue`, {
    params: cubeInstructorAdminRdo,
  });
}

export function findAllLectureCountByQuery(lectureRdo: LectureRdo): Promise<any> {
  return axios
    .get<CubeCountModel>(`${BASE_URL}/cube/countWithJoinedValue`, {
      params: lectureRdo,
    })
    .then((response) => (response && response.data) || null);
}

export function findInstructorCubesForAdmin(
  instructorCubeAdminRdo: InstructorCubeAdminRdo
): Promise<InstructorCubeList> {
  return axios
    .get(`/api/cube/cubes/admin/instructorCubes`, { params: instructorCubeAdminRdo })
    .then((response) => (response && response.data) || null);
}

export function findAllLectureCountByQueryNew(cubeInstructorAdminRdo: InstructorCubeAdminRdo): Promise<any> {
  return axios
    .get<CubeCountModel>(`${BASE_URL}/cube/countWithJoinedValue`, {
      params: cubeInstructorAdminRdo,
    })
    .then((response) => (response && response.data) || null);
}

export function findAllLectureExcelQuery(lectureRdo: LectureRdo): Promise<any> {
  //
  return axios
    .get<LectureListViewModel[]>(BASE_URL + `/cube/excelWithJoinedValue`, {
      params: lectureRdo,
    })
    .then(
      (response: any) =>
        response && response.data && response.data.map((cube: LectureListViewModel) => new LectureListViewModel(cube))
    );
}

export function removeLecture(lectureId: string): Promise<any> {
  return axios.delete(`${BASE_URL}/v1/lectures/${lectureId}`);
}
