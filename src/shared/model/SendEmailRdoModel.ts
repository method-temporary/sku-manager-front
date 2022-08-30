import { PolyglotModel } from './PolyglotModel';

export class SendEmailRdoModel {
  //
  company: string = ''; //소속사
  team: string = ''; //소속 조직(팀)
  name: string = ''; //성명
  result: string = 'Fail'; //학습처리상태(Fail, Success)

  department: string = '';
  companyName: PolyglotModel = new PolyglotModel();
  departmentName: PolyglotModel = new PolyglotModel();
  userName: PolyglotModel = new PolyglotModel();
  email: string = ''; //e-mail
  member: boolean = true; //학습처리상태(Fail, Success)
  currPage: number = 0;

  constructor(emails: SendEmailRdoModel) {
    Object.assign(this, {
      ...emails,
    });
  }
}
export default SendEmailRdoModel;
