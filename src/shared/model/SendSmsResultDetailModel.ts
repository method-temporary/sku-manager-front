import { requestLabelTree } from 'labelManagement/labelTree/labelTree.request.servies';
import { SendSmsFailedModel } from './SendSmsFailedModel';
import { SendSmsResultModel } from './SendSmsResultModel';
import { decorate, observable } from 'mobx';

export class SendSmsResultDetailModel {
  //
  sentSms: SendSmsResultModel = new SendSmsResultModel();
  smsRsltValMsgAndCountRoms: SendSmsFailedModel[] = [];
  totalCount: number = 0;
  totalFailedCount: number = 0;

  constructor(rdoModel?: SendSmsResultDetailModel) {
    //
    if (rdoModel) {
      Object.assign(this, { ...rdoModel });
      this.smsRsltValMsgAndCountRoms =
        (rdoModel.smsRsltValMsgAndCountRoms && [...rdoModel.smsRsltValMsgAndCountRoms]) || [];
    }
  }
}

decorate(SendSmsResultDetailModel, {
  sentSms: observable,
  smsRsltValMsgAndCountRoms: observable,
  totalCount: observable,
  totalFailedCount: observable,
});

export default SendSmsResultDetailModel;
