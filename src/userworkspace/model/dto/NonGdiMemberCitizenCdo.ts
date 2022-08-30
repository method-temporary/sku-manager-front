import { NonGdiMemberSdo } from './NonGdiMemberSdo';

export class NonGdiMemberCitizenCdo {
  //
  workspaceCineroomId: string = '';
  companyCode: string = '';
  companyName: string = '';

  nonGdiMemberSdo: NonGdiMemberSdo = new NonGdiMemberSdo();

  constructor(nonGdiMemberCitizenCdo?: NonGdiMemberCitizenCdo) {
    if (nonGdiMemberCitizenCdo) {
      Object.assign(this, { ...nonGdiMemberCitizenCdo });
    }
  }
}
