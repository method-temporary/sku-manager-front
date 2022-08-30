import useSWR from 'swr';
import { axiosApi as axios } from 'shared/axios/Axios';
import {
  OffsetElementList,
  CardStudentSendEmailOrSmsCdo,
  CubeStudentSendEmailOrSmsCdo,
  SendSmsMainNumberModel,
  SendSmsResultDetailModel,
  SendSmsSenderQualifiedModel,
} from 'shared/model';
import { AxiosReturn } from './AxiosReturn';

const sendSmsApi = {
  findEnableRepresentativeNumber:
    '/api/support/admin/representativeNumbers/findByRepresentativeNumberRdo?enabled=true&limit=999999&offset=0',
};

function findEnableRepresentativeNumber(url: string) {
  return axios.get<OffsetElementList<{ representativeNumber: SendSmsMainNumberModel }>>(url).then(AxiosReturn);
}

export function useFindEnableRepresentativeNumber() {
  const {
    data: enableRepresentativeNumbers,
    error,
    mutate: enableRepresentativeNumberMutate,
  } = useSWR(sendSmsApi.findEnableRepresentativeNumber, findEnableRepresentativeNumber);

  return {
    enableRepresentativeNumbers,
    isLoading: !enableRepresentativeNumbers && !error,
    enableRepresentativeNumberMutate,
  };
}

export default class SendSmsApi {
  //
  URL = `/api/pigeon`;
  LECTURE_URL = `/api/lecture`;
  SUPPORT_URL = `/api/support`;
  USER_URL = `/api/user`;

  static instance: SendSmsApi;

  //cube, card 결과관리에서 사용
  findEnableRepresentativeNumber() {
    return axios
      .get<OffsetElementList<{ representativeNumber: SendSmsMainNumberModel }>>(
        this.SUPPORT_URL +
          '/admin/representativeNumbers/findByRepresentativeNumberRdo?enabled=true&offset=0&limit=9999999'
      )
      .then((response: any) => {
        return response && response.data && response.data.results;
      });
  }

  findSendSmsResult(sentSmsId: string) {
    return axios.get<SendSmsResultDetailModel>(this.URL + `/sentSms/detail/${sentSmsId}`).then((response: any) => {
      return response && response.data;
    });
  }

  //cube, card 결과관리에서 사용
  findMySmsSenderQualified() {
    return axios.get<SendSmsSenderQualifiedModel>(this.USER_URL + '/users/mySmsSender').then(AxiosReturn);
  }

  //cube, card 결과관리에서 사용
  sendCubeStudentEmailOrSms(cubeStudentSendEmailOrSmsCdo: CubeStudentSendEmailOrSmsCdo) {
    return axios.post<void>(
      this.LECTURE_URL + '/students/admin/sendCubeStudentEmailOrSms',
      cubeStudentSendEmailOrSmsCdo
    );
  }

  //cube, card 결과관리에서 사용
  sendCardStudentEmailOrSms(cardStudentSendEmailOrSmsCdo: CardStudentSendEmailOrSmsCdo) {
    return axios.post<void>(
      this.LECTURE_URL + '/students/admin/sendCardStudentEmailOrSms',
      cardStudentSendEmailOrSmsCdo
    );
  }
}

Object.defineProperty(SendSmsApi, 'instance', {
  value: new SendSmsApi(),
  writable: false,
  configurable: false,
});
