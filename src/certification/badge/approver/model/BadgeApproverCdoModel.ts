export class BadgeApproverCdoModel {
  email: string = '';
  companyCode: string = '';
  companyName: string = '';
  name: string = '';

  constructor(approver?: BadgeApproverCdoModel) {
    if (approver) {
      Object.assign(this, approver);
    }
  }
}
