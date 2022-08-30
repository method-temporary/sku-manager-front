import { decorate, observable } from 'mobx';

export class ApprovedResponse {
  //
  error: string = '';
  message: string = '';
  
  constructor(approvedResponse?: ApprovedResponse) {
    //
    if (approvedResponse) Object.assign(this, { ...approvedResponse });
  }
}

decorate(ApprovedResponse, {
  error: observable,
  message: observable,
});
