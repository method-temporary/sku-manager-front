import { axiosApi as axios, axiosApi, paramsSerializer } from '../../../shared/axios/Axios';
import qs from 'qs';
import { CubeDetail } from '../model/CubeDetail';
import { OffsetElementList, PolyglotModel } from '../../../shared/model';
import { CubeSdo } from '../model/CubeSdo';
import { CubeAdminRdo, CubeWithReactiveModel } from '../../../cube/cube';
import { setExcelHistoryParams } from '../../../shared/components/SubActions/sub/ExcelButton/store/ExcelHistoryStore';
import { AxiosReturn } from '../../../shared/present';

const DEFAULT_URL = '/api/cube/cubes/admin';

export function findCubeByRdo(cubeRdo: CubeAdminRdo): Promise<OffsetElementList<CubeWithReactiveModel>> {
  //
  setExcelHistoryParams({
    searchUrl: DEFAULT_URL,
    searchParam: cubeRdo,
    workType: 'Excel Download',
  });

  return axios
    .get(DEFAULT_URL, {
      params: cubeRdo,
      paramsSerializer,
    })
    .then(AxiosReturn);
}

export function findCubeDetailsById(cubeId: string): Promise<CubeDetail> {
  //
  return axiosApi
    .getLoader<CubeDetail[]>(`${DEFAULT_URL}/${cubeId}/detail`)
    .then((response: any) => (response && response.data) || null);
}

export function findCubesDetailsByIds(ids: string[]): Promise<CubeDetail[]> {
  //
  return axiosApi
    .getLoader<CubeDetail[]>(`${DEFAULT_URL}/cubeDetailsByIds`, {
      params: { cubeIds: ids },
      paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'repeat' }),
    })
    .then((response: any) => (response && response.data) || []);
}

export function existDuplicateCubeNameCheck(cubeId: string, name: PolyglotModel): Promise<number> {
  return axiosApi
    .postLoader<number>(`${DEFAULT_URL}/existDuplicateCubeName`, { id: cubeId, name })
    .then((response: any) => (response && response.data) || false);
}

export function registerCubeSdo(cube: CubeSdo): Promise<string> {
  return axiosApi.postLoader<number>(`${DEFAULT_URL}`, cube).then((response: any) => (response && response.data) || '');
}

export function modifyCubeSdo(cubeId: string, cube: CubeSdo) {
  return axiosApi
    .putLoader(`${DEFAULT_URL}/${cubeId}`, cube)
    .then((response: any) => (response && response.data) || '');
}
