import { DataChannelModel } from './DataChannelModel';

class DataChannelExcelModel {
  //
  email: string = '';
  회원명: string = '';
  회사명: string = '';
  '소속부서명': string = '';
  채널명: string = '';

  constructor(model?: DataChannelModel) {
    //
    if (model) {
      Object.assign(this, {
        email: model.email,
        회원명: model.name,
        회사명: model.companyName,
        소속부서명: model.departmentName,
        채널명: model.channelName,
      });
    }
  }
}

export default DataChannelExcelModel;
