import { axiosApi as axios, NameValueList } from '@nara.platform/accent';
import { NaOffsetElementList } from 'shared/model';
import CapabilityCdo from '../model/CapabilityCdo';
import CapabilityRdo from '../model/CapabilityRdo';
import { SearchBox } from '../model/SearchBox';
import CapabilityGroup from '../model/CapabilityGroup';
import Skill from '../model/Skill';
import SkillCdo from '../model/SkillCdo';
import Capability from '../model/Capability';
import { setExcelHistoryParams } from 'shared/components/SubActions/sub/ExcelButton/store/ExcelHistoryStore';

const BASE_URL_NEW = '/api/cube/capability';

export function findAllCapability(searchBox: SearchBox): Promise<NaOffsetElementList<Skill>> {
  // const params = `startDate=${searchBox.startDate}&endDate=${searchBox.endDate}&text=${searchBox.text}&limit=${capabilityRdo.limit}&offset=${capabilityRdo.offset}`;
  // const params = `capabilityName=${capabilityName}`;
  return (
    axios
      // .get<NaOffsetElementList<Skill>>(`${BASE_URL_NEW}?${params}`)
      .get<NaOffsetElementList<Skill>>(`${BASE_URL_NEW}`, { params: searchBox })
      .then((response) => response && response.data && response.data)
  );
}

export function findAllSkill(searchBox: SearchBox): Promise<Skill[]> {
  // const params = `startDate=${searchBox.startDate}&endDate=${searchBox.endDate}&text=${searchBox.text}&limit=${capabilityRdo.limit}&offset=${capabilityRdo.offset}`;
  // const params = `capabilityName=${capabilityName}`;
  return (
    axios
      // .get<NaOffsetElementList<Skill>>(`${BASE_URL_NEW}?${params}`)
      .get<Skill[]>(`${BASE_URL_NEW}/skillList`, { params: searchBox })
      .then((response) => response && response.data && response.data)
  );
}

export function findCapabilityNames(capabilityName: string): Promise<string[]> {
  // const params = `startDate=${searchBox.startDate}&endDate=${searchBox.endDate}&text=${searchBox.text}&limit=${capabilityRdo.limit}&offset=${capabilityRdo.offset}`;
  const params = `capabilityName=${capabilityName}`;
  return axios
    .get<string[]>(`${BASE_URL_NEW}/capabilityNames?${params}`)
    .then((response) => response && response.data && response.data);
}

export function findCapabilityGroups(capabilityGroupId?: string): Promise<CapabilityGroup[]> {
  const params = `capabilityGroupId=${capabilityGroupId}`;
  return axios
    .get<CapabilityGroup[]>(`${BASE_URL_NEW}/groups?${params}`)
    .then((response) => response && response.data && response.data);
}

export function findCapabilityModal(
  searchBox: SearchBox
  // capabilityGroupId: string
): Promise<Capability[]> {
  // const params = `capabilityGroupId=${capabilityGroupId}`;
  return (
    axios
      // .get<Capability[]>(`${BASE_URL_NEW}/capability?${params}`)
      .get<Capability[]>(`${BASE_URL_NEW}/capability`, {
        params: searchBox,
      })
      .then((response) => response && response.data && response.data)
  );
}

// /capability/capability?capabilityGroupId=AI

export function findAllCapabilityExcel(searchBox: SearchBox): Promise<NaOffsetElementList<Skill>> {
  if (searchBox.offset !== undefined) {
    searchBox.limit = 1000;
    searchBox.offset = 0;
  }

    const apiUrl = `${BASE_URL_NEW}`;

    setExcelHistoryParams({
      searchUrl: apiUrl,
      searchParam: searchBox,
      workType: 'Excel Download'
    })

  return axios
    .get<NaOffsetElementList<Skill>>(apiUrl, {
      params: searchBox,
    })
    .then((response) => response && response.data && response.data);
}

export function registerCapability(capabilityCdo: CapabilityCdo): Promise<string> {
  return axios
    .post<string>(`${BASE_URL_NEW}`, capabilityCdo)
    .then((response) => response && response.data && response.data);
}

export function registerCapabilitys(capabilityCdos: CapabilityCdo[]): Promise<string> {
  return axios
    .post<string>(`${BASE_URL_NEW}/multi`, capabilityCdos)
    .then((response) => response && response.data && response.data);
}

// export function removeCapability(capabilityId: string): Promise<any> {
//   return axios
//     .delete(`${BASE_URL}/${capabilityId}`)
//     .then((response) => response && response.data && response.data);
// }

//역량군,  역량명, skill 중복 체크
// export function findbyCapability(
//   capabilityGroup: string,
//   capabilityName: string,
//   skill: string
// ): Promise<Skill> {
//   const params = `capabilityGroup=${capabilityGroup}&capabilityName=${capabilityName}&skill=${skill}`;
//   return axios
//     .get<Skill>(`${BASE_URL}/findByCapability?${params}`)
//     .then((response) => response && response.data && response.data);
// }

//역량 여러개 삭제
export function removeCapabilitys(capabilityIds: (string | undefined)[]): Promise<any> {
  return axios
    .delete(`${BASE_URL_NEW}/${capabilityIds.join(',')}`)
    .then((response) => response && response.data && response.data);
}

export function findCapability(capabilityId: string): Promise<Skill> {
  return axios
    .get<Skill>(`${BASE_URL_NEW}/${capabilityId}`)
    .then((response) => response && response.data && response.data);
}

export function modifyCapability(capabilityId: string, nameValueList: NameValueList): Promise<any> {
  return axios
    .put(`${BASE_URL_NEW}/${capabilityId}`, nameValueList)
    .then((response) => response && response.data && response.data);
}

export function existsCapability(capabilityCdo: CapabilityCdo): Promise<boolean> {
  return axios
    .get<boolean>(`${BASE_URL_NEW}/exists`, {
      params: capabilityCdo,
    })
    .then((response) => response && response.data && response.data);
}

// export function existsCapability(skillCdo: SkillCdo): Promise<boolean> {
//   return axios
//     .get<boolean>(`${BASE_URL_NEW}/exists`, {
//       params: skillCdo,
//     })
//     .then((response) => response && response.data && response.data);
// }
