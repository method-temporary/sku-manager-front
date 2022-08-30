import { axiosApi as axios } from 'shared/axios/Axios';
import { AxiosReturn } from 'shared/present/apiclient/AxiosReturn';
import { CubePanoptoModel } from '../model/CubePanoptoModel';

const BASE_URL = '/api/cube/cubes/admin/panoptoByQdo';

export function findCubePanoptoIds(cubeIds: string[]): Promise<CubePanoptoModel[] | undefined> {
  return axios.post(BASE_URL, { cubeIds }).then(AxiosReturn);
}
