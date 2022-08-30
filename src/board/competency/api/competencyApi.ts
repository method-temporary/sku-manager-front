import { axiosApi as axios, NameValueList } from '@nara.platform/accent';
import { NaOffsetElementList } from 'shared/model';
import Competency from '../model/Competency';
import CompetencyCdo from '../model/CompetencyCdo';
import CompetencyRdo from '../model/CompetencyRdo';
import { SearchBox } from '../model/SearchBox';
import { setExcelHistoryParams } from 'shared/components/SubActions/sub/ExcelButton/store/ExcelHistoryStore';

const BASE_URL = '/api/cube/searchtags';
const BASE_URL_NEW = '/api/cube/competency';

export function findAllCompetency(searchBox: SearchBox): Promise<NaOffsetElementList<Competency>> {
  // const params = `startDate=${searchBox.startDate}&endDate=${searchBox.endDate}&text=${searchBox.text}&limit=${competencyRdo.limit}&offset=${competencyRdo.offset}`;
  const params = `startDate=${searchBox.startDate}&endDate=${searchBox.endDate}&limit=${searchBox.limit}&offset=${searchBox.offset}`;
  return axios
    .get<NaOffsetElementList<Competency>>(`${BASE_URL_NEW}`, {
      params: searchBox,
    })
    .then((response) => response && response.data && response.data);
}

export function findCompetencyNames(competencyName: string): Promise<string[]> {
  // const params = `startDate=${searchBox.startDate}&endDate=${searchBox.endDate}&text=${searchBox.text}&limit=${competencyRdo.limit}&offset=${competencyRdo.offset}`;
  const params = `competencyName=${competencyName}`;
  return axios
    .get<string[]>(`${BASE_URL_NEW}/competencyNames?${params}`)
    .then((response) => response && response.data && response.data);
}

export function findAllCompetencyExcel(searchBox: SearchBox): Promise<NaOffsetElementList<Competency>> {
  searchBox.limit = 1000;
  searchBox.offset = 0;

  const apiUrl = `${BASE_URL_NEW}`;

  setExcelHistoryParams({
    searchUrl: apiUrl,
    searchParam: searchBox,
    workType: 'Excel Download'
  })

  return axios
    .get<NaOffsetElementList<Competency>>(apiUrl, {
      params: searchBox,
    })
    .then((response) => response && response.data && response.data);
}

export function registerCompetency(competencyCdo: CompetencyCdo): Promise<string> {
  return axios
    .post<string>(`${BASE_URL_NEW}`, competencyCdo)
    .then((response) => response && response.data && response.data);
}

export function registerCompetencys(competencyCdos: CompetencyCdo[]): Promise<string> {
  return axios
    .post<string>(`${BASE_URL_NEW}/multi`, competencyCdos)
    .then((response) => response && response.data && response.data);
}

export function findbyTag(tag: string): Promise<Competency> {
  const params = `tag=${tag}`;
  return axios
    .get<Competency>(`${BASE_URL}/findByTag?${params}`)
    .then((response) => response && response.data && response.data);
}

export function removeCompetency(competencyId: string): Promise<any> {
  return axios.delete(`${BASE_URL}/${competencyId}`).then((response) => response && response.data && response.data);
}

//역량군,  역량명, skill 중복 체크
export function findbyCompetency(competencyGroup: string, competencyName: string, skill: string): Promise<Competency> {
  const params = `competencyGroup=${competencyGroup}&competencyName=${competencyName}&skill=${skill}`;
  return axios
    .get<Competency>(`${BASE_URL}/findByCompetency?${params}`)
    .then((response) => response && response.data && response.data);
}

//역량 여러개 삭제
export function removeCompetencys(competencyIds: (string | undefined)[]): Promise<any> {
  return axios
    .delete(`${BASE_URL_NEW}/${competencyIds.join(',')}`)
    .then((response) => response && response.data && response.data);
}

export function findCompetency(competencyId: string): Promise<Competency> {
  return axios
    .get<Competency>(`${BASE_URL_NEW}/${competencyId}`)
    .then((response) => response && response.data && response.data);
}

export function modifyCompetency(competencyId: string, nameValueList: NameValueList): Promise<any> {
  return axios
    .put(`${BASE_URL_NEW}/${competencyId}`, nameValueList)
    .then((response) => response && response.data && response.data);
}

export function existsCompetency(competencyCdo: CompetencyCdo): Promise<boolean> {
  return axios
    .get<boolean>(`${BASE_URL_NEW}/exists`, {
      params: competencyCdo,
    })
    .then((response) => response && response.data && response.data);
}
