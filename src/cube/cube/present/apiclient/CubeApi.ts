import qs from 'qs';
import { axiosApi as axios } from 'shared/axios/Axios';

import { OffsetElementList } from 'shared/model';
import { AxiosReturn } from 'shared/present';

import { CubePanoptoModel } from 'cube/cube/model/CubePanoptoIdsModel';
import { CubeModel } from 'cube/cube/model/CubeModel';
import { CubeSdo } from '../../model/sdo/CubeSdo';
import { CubeDetail } from '../../model/sdo/CubeDetail';
import { CubeAdminRdo } from '../../model/sdo/CubeAdminRdo';
import { CubeWithReactiveModel } from '../../model/sdo/CubeWithReactiveModel';
import { CubeWithContents } from '../../model/sdo/CubeWithContents';
import { InstructorCubeAdminRdo } from '../../model/sdo/InstructorCubeAdminRdo';
import { InstructorCubeList } from '../../model/sdo/InstructorCubeList';
import CubePolyglotUdo from '../../model/sdo/CubePolyglotUdo';
import DuplicateCubeNameRdo from '../../model/sdo/DuplicateCubeNameRdo';
import { setExcelHistoryParams } from 'shared/components/SubActions/sub/ExcelButton/store/ExcelHistoryStore';

export default class CubeApi {
  //
  cubeURL = '/api/cube/cubes';

  static instance: CubeApi;

  registerCube(cubeSdo: CubeSdo): Promise<string> {
    //
    return axios.postLoader(this.cubeURL + '/admin', cubeSdo).then((response) => (response && response.data) || '');
  }

  findCubeDetail(cubeId: string): Promise<CubeDetail> {
    //
    return axios.get(this.cubeURL + `/${cubeId}/detail`).then((response) => (response && response.data) || null);
  }

  findCubeDetailForAdmin(cubeId: string): Promise<CubeDetail> {
    //
    return axios
      .getLoader(this.cubeURL + `/admin/${cubeId}/detail`)
      .then((response) => (response && response.data) || null);
  }

  findCubesByIds(ids: string[]): Promise<CubeModel[]> {
    //
    return axios
      .get(this.cubeURL + `/byIds`, {
        params: ids,
        paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'comma' }),
      })
      .then((response) => (response && response.data) || []);
  }

  findCubesForAdminByIds(ids: string[]): Promise<CubeModel[]> {
    return axios
      .get(this.cubeURL + `/admin/byIds`, {
        params: ids,
        paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'comma' }),
      })
      .then((response) => (response && response.data) || []);
  }

  findCubeWithReactiveModelsForAdmin(cubeAdminRdo: CubeAdminRdo): Promise<OffsetElementList<CubeWithReactiveModel>> {
    const apiUrl = this.cubeURL + `/admin`;

    setExcelHistoryParams({
      searchUrl: apiUrl,
      searchParam: cubeAdminRdo,
      workType: 'Excel Download',
    });

    return axios
      .getLoader(apiUrl, {
        params: cubeAdminRdo,
        paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'comma' }),
      })
      .then((response) => OffsetElementList.fromResponse(response.data));
  }

  findInstructorCubesForAdmin(instructorCubeAdminRdo: InstructorCubeAdminRdo): Promise<InstructorCubeList> {
    return axios
      .getLoader(this.cubeURL + `/admin/instructorCubes`, { params: instructorCubeAdminRdo })
      .then((response) => (response && response.data) || null);
  }

  findCubeWithContentByIds(ids: string[]): Promise<CubeWithContents[]> {
    //
    return axios
      .get(this.cubeURL + `/admin/withContentsByIds?cubeIds=${ids}`)
      .then((response) => response && response.data);
  }

  findCubeWithContentByIdsPost(ids: string[]): Promise<CubeWithContents[]> {
    return axios.post(this.cubeURL + '/admin/withContentsByQdo', { cubeIds: ids }).then((res) => res.data);
  }

  // findUserCubeWithIdentitiesForAdmin(userCubeAdminRdo: UserCubeAdminRdo):

  modifyCube(cubeId: string, cubeSdo: CubeSdo): Promise<void> {
    //
    return axios
      .putLoader(this.cubeURL + `/admin/${cubeId}`, cubeSdo)
      .then((response) => (response && response.data) || null);
  }

  modifyUserCube(cubeId: string, cubeSdo: CubeSdo): Promise<void> {
    //
    return axios.put(this.cubeURL + `/${cubeId}/user`, cubeSdo).then((response) => (response && response.data) || null);
  }

  requestOpenUserCube(cubeId: string): Promise<void> {
    //
    return axios
      .put(this.cubeURL + `/${cubeId}/requestOpenUserCube`)
      .then((response) => (response && response.data) || null);
  }

  openUserCubes(ids: string[]): Promise<void> {
    // put Method
    return axios
      .put(this.cubeURL + `/openUserCubesByIds`, {
        params: ids,
        paramsSerializer: (params: any) => qs.stringify(params, { arrayFormat: 'comma' }),
      })
      .then((response) => (response && response.data) || null);
  }

  findCubeCountByName(rdo: DuplicateCubeNameRdo): Promise<number> {
    //
    return (
      axios
        // .get(this.cubeURL + `/admin/countByName?name=${name}`)
        .post(this.cubeURL + `/admin/existDuplicateCubeName`, rdo)
        .then((response) => (response && response.data) || 0)
    );
  }

  modifyPolyglotForAdmin(cubeId: string, cubePolyglotUdo: CubePolyglotUdo): Promise<void> {
    //
    return axios
      .put(this.cubeURL + `/admin/polyglot/${cubeId}`, cubePolyglotUdo)
      .then((response) => (response && response.data) || null);
  }

  findCubePanoptoIds(cubeIds: string[]): Promise<CubePanoptoModel[] | undefined> {
    return axios.post(this.cubeURL + '/admin/panoptoByQdo', { cubeIds }).then((res) => AxiosReturn(res));
  }

  findCubesIgnoringAccessibilityByQdo(cubeAdminRdo: CubeAdminRdo): Promise<OffsetElementList<CubeWithReactiveModel>> {
    return axios
      .getLoader(this.cubeURL + `/admin/findCubesIgnoringAccessibilityByQdo`, {
        params: cubeAdminRdo,
        paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'comma' }),
      })
      .then((response) => OffsetElementList.fromResponse(response.data));
  }
}

Object.defineProperty(CubeApi, 'instance', {
  value: new CubeApi(),
  writable: false,
  configurable: false,
});
