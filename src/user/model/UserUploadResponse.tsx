import { UserExcelUploadModel } from './UserExcelUploadModel';
import { computed, decorate, observable } from 'mobx';

export class UserUploadResponse {
  //
  success: boolean = true;
  list: UserExcelUploadModel[] = [];
  message: string = '';

  constructor(skProfileUploadResponse?: UserUploadResponse) {
    //
    if (skProfileUploadResponse) {
      Object.assign(this, { ...skProfileUploadResponse });
    }
  }

  setSuccess(success: boolean) {
    //
    this.success = success;
  }

  setList(list: UserExcelUploadModel[]) {
    //
    this.list = list;
  }

  setMessage(message: string) {
    //
    this.message = message;
  }

  @computed
  get getSuccess() {
    return this.success;
  }

  @computed
  get getList() {
    return this.list;
  }

  @computed
  get getMessage() {
    return this.message;
  }
}

decorate(UserUploadResponse, {
  success: observable,
  list: observable,
  message: observable,
});
