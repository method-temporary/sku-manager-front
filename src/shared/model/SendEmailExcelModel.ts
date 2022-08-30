import { decorate, observable } from 'mobx';
import { SendEmailRdoModel } from './SendEmailRdoModel';

export class SendEmailExcelModel {
  Email: string = ''; //e-mail = LearningCompleteProcModel.email

  constructor(sendEmailTempExcel?: SendEmailExcelModel) {
    if (sendEmailTempExcel) {
      Object.assign(this, { ...sendEmailTempExcel });
    }
  }

  /**
   * 엑셀 데이터 칼럼에서 Model 칼럼 객체로 전화
   * @param sendEmailTempExcel
   */
  static asCdo(sendEmailTempExcel: SendEmailExcelModel): SendEmailRdoModel {
    return {
      email: sendEmailTempExcel.Email,
    } as SendEmailRdoModel;
  }
}

decorate(SendEmailExcelModel, {
  Email: observable,
});
