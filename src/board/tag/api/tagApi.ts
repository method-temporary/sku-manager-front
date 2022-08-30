import { axiosApi as axios, NameValueList } from '@nara.platform/accent';
import { NaOffsetElementList } from 'shared/model';
import ConceptCdo from '../model/ConceptCdo';
import { SearchBox } from '../model/SearchBox';
import Concept from '../model/Concept';
import Term from '../model/Term';
import { setExcelHistoryParams } from 'shared/components/SubActions/sub/ExcelButton/store/ExcelHistoryStore';

const BASE_URL = '/api/cube/searchtags';
const BASE_URL_NEW = '/api/cube/tag';

export function findAllConcept(searchBox: SearchBox): Promise<NaOffsetElementList<Term>> {
  // const params = `startDate=${searchBox.startDate}&endDate=${searchBox.endDate}&text=${searchBox.text}&limit=${conceptRdo.limit}&offset=${conceptRdo.offset}`;
  // const params = `conceptName=${conceptName}`;
  return (
    axios
      // .get<NaOffsetElementList<Term>>(`${BASE_URL_NEW}?${params}`)
      .get<NaOffsetElementList<Term>>(`${BASE_URL_NEW}`, { params: searchBox })
      .then((response) => response && response.data && response.data)
  );
}

export function findAllTerm(searchBox: SearchBox): Promise<Term[]> {
  // const params = `startDate=${searchBox.startDate}&endDate=${searchBox.endDate}&text=${searchBox.text}&limit=${conceptRdo.limit}&offset=${conceptRdo.offset}`;
  // const params = `conceptName=${conceptName}`;
  return (
    axios
      // .get<NaOffsetElementList<Term>>(`${BASE_URL_NEW}?${params}`)
      .get<Term[]>(`${BASE_URL_NEW}/termList`, { params: searchBox })
      .then((response) => response && response.data && response.data)
  );
}

export function findConceptNames(conceptName: string): Promise<string[]> {
  // const params = `startDate=${searchBox.startDate}&endDate=${searchBox.endDate}&text=${searchBox.text}&limit=${conceptRdo.limit}&offset=${conceptRdo.offset}`;
  const params = `conceptName=${conceptName}`;
  return axios
    .get<string[]>(`${BASE_URL_NEW}/conceptNames?${params}`)
    .then((response) => response && response.data && response.data);
}

export function findConcepts(conceptId?: string): Promise<Concept[]> {
  const params = `conceptId=${conceptId}`;
  return axios
    .get<Concept[]>(`${BASE_URL_NEW}/groups?${params}`)
    .then((response) => response && response.data && response.data);
}

export function findConceptModal(
  searchBox: SearchBox
  // conceptId: string
): Promise<Concept[]> {
  // const params = `conceptId=${conceptId}`;
  return (
    axios
      // .get<Concept[]>(`${BASE_URL_NEW}/concept?${params}`)
      .get<Concept[]>(`${BASE_URL_NEW}/concept`, {
        params: searchBox,
      })
      .then((response) => response && response.data && response.data)
  );
}

// /concept/concept?conceptId=AI

export function findAllConceptExcel(searchBox: SearchBox): Promise<NaOffsetElementList<Term>> {

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
    .get<NaOffsetElementList<Term>>(apiUrl, {
      params: searchBox,
    })
    .then((response) => response && response.data && response.data);
}

export function registerConcept(conceptCdo: ConceptCdo): Promise<string> {
  return axios
    .post<string>(`${BASE_URL_NEW}`, conceptCdo)
    .then((response) => response && response.data && response.data);
}

export function registerConcepts(conceptCdos: ConceptCdo[]): Promise<string> {
  return axios
    .post<string>(`${BASE_URL_NEW}/multi`, conceptCdos)
    .then((response) => response && response.data && response.data);
}

export function removeConcept(conceptId: string): Promise<any> {
  return axios.delete(`${BASE_URL}/${conceptId}`).then((response) => response && response.data && response.data);
}

//역량군,  역량명, term 중복 체크
export function findbyConcept(concept: string, conceptName: string, term: string): Promise<Term> {
  const params = `concept=${concept}&conceptName=${conceptName}&term=${term}`;
  return axios
    .get<Term>(`${BASE_URL}/findByConcept?${params}`)
    .then((response) => response && response.data && response.data);
}

//역량 여러개 삭제
export function removeConcepts(conceptIds: (string | undefined)[]): Promise<any> {
  return axios
    .delete(`${BASE_URL_NEW}/${conceptIds.join(',')}`)
    .then((response) => response && response.data && response.data);
}

export function findConcept(conceptId: string): Promise<Term> {
  return axios.get<Term>(`${BASE_URL_NEW}/${conceptId}`).then((response) => response && response.data && response.data);
}

export function modifyConcept(conceptId: string, nameValueList: NameValueList): Promise<any> {
  return axios
    .put(`${BASE_URL_NEW}/${conceptId}`, nameValueList)
    .then((response) => response && response.data && response.data);
}

export function existsConcept(conceptCdo: ConceptCdo): Promise<boolean> {
  return axios
    .get<boolean>(`${BASE_URL_NEW}/exists`, {
      params: conceptCdo,
    })
    .then((response) => response && response.data && response.data);
}

// export function existsConcept(termCdo: TermCdo): Promise<boolean> {
//   return axios
//     .get<boolean>(`${BASE_URL_NEW}/exists`, {
//       params: termCdo,
//     })
//     .then((response) => response && response.data && response.data);
// }
