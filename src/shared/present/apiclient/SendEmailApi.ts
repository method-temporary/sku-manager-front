import { axiosApi as axios } from 'shared/axios/Axios';
import {
  CardStudentSendEmailOrSmsCdo,
  CubeStudentSendEmailOrSmsCdo,
  SendEmailCdoModel,
  SendEmailRdoModel,
} from 'shared/model';

export default class SendEmailApi {
  //
  URL = `/api/pigeon`;
  LECTURE_URL = `/api/lecture`;

  static instance: SendEmailApi;

  sendEmail(sendEmail: SendEmailCdoModel) {
    //
    return axios.post<void>(this.URL + '/mailSend', sendEmail);
  }

  sendRjEmail(sendEmail: SendEmailCdoModel[]) {
    //
    return axios.post<void>(this.URL + '/mailSend/list', sendEmail);
  }

  // email 정합성 체크
  confirmEmail(sendEmailCdoModelList: SendEmailRdoModel[]) {
    const data = {
      emails: sendEmailCdoModelList.map((item) => item.email),
    };
    return axios
      .post<[]>(`/api/approval/members/searchEmail`, data)
      .then((response) => (response && response.data) || null);
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

Object.defineProperty(SendEmailApi, 'instance', {
  value: new SendEmailApi(),
  writable: false,
  configurable: false,
});
