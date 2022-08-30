import { useMutation, useQuery, useQueryClient, UseQueryResult } from 'react-query';
import { axiosApi as axios } from 'shared/axios/Axios';
import { AxiosReturn } from '../shared/present';
import { queryKeys } from '../query/queryKeys';
import { CapabilityQdo } from './model/CapabilityQdo';
import { OffsetElementList } from 'shared/model';
import { AssessmentResultRdo } from './model/AssessmentResultRdo';
import { download } from '../transcript/present/apiclient/FileApi';

export const useFindAssessments = () => {
  //
  return useQuery(queryKeys.findAssessments(), () => findAssessments(), { refetchOnWindowFocus: false });
};

export const useFindAssessmentResults = (
  qdo: CapabilityQdo
): UseQueryResult<OffsetElementList<AssessmentResultRdo>> => {
  return useQuery(queryKeys.findAssessmentResults(qdo), () => findAssessmentResults(qdo), {
    refetchOnWindowFocus: false,
  });
};

// export const useFindAssessmentResultDetail = (id: string) => {
//   return useQuery(
//     queryKeys.findAssessmentResultDetail(id),
//     () => findAssessmentResultDetail(id),
//   );
// };

export const useFindAssessmentResultDetail = () => {
  return useMutation((id: string) => findAssessmentResultDetail(id));
};

export const useExcelDownload = () => {
  return useMutation((qdo: CapabilityQdo) => excelDownload(qdo));
};

// export const useExcelDownloadTest = () => {
// return useMutation((assessmentId: string) => excelDownloadTest(assessmentId));
// };

export const useCapabilityReset = (qdo: CapabilityQdo) => {
  //
  const queryClient = useQueryClient();
  return useMutation((id: string) => capabilityReset(id), {
    onSuccess: () => {
      queryClient.invalidateQueries(queryKeys.findAssessmentResults(qdo));
    },
  });
};

const BASE_URL = '/api/capability/assessments/admin';
const BASE_URL_RESULTS = '/api/capability/assessmentResults/admin';
const BASE_URL_DATA_SEARCH = '/api/data-search/excel/assessmentResults';

const findAssessments = () => {
  return axios.get(`${BASE_URL}`).then(AxiosReturn);
};

const findAssessmentResults = (qdo: CapabilityQdo): Promise<OffsetElementList<AssessmentResultRdo>> => {
  return axios
    .get(`${BASE_URL_RESULTS}`, {
      params: qdo,
    })
    .then(AxiosReturn);
};

const findAssessmentResultDetail = (id: string) => {
  return axios.get(`${BASE_URL_RESULTS}/detail/${id}`).then(AxiosReturn);
};

const excelDownload = (qdo: CapabilityQdo) => {
  return axios
    .get(`${BASE_URL_RESULTS}/excel`, {
      params: qdo,
    })
    .then(AxiosReturn);
};

export const excelDownloadFile = (assessmentId: string) => {
  // return axios.get(`${BASE_URL_DATA_SEARCH}/${assessmentId}`, { responseType: 'blob' }).then(AxiosReturn);
  download(`${BASE_URL_DATA_SEARCH}/${assessmentId}`, 'DigitalLiteracy.xlsx');
};

const capabilityReset = (id: string) => {
  return axios.delete(`${BASE_URL_RESULTS}/${id}`).then(AxiosReturn);
};
