import { NonGdiMemberSdo } from './NonGdiMemberSdo';

export class NonGdiMemberCitizenUdo {
  //
  workspaceCineroomId: string = '';
  companyCode: string = '';
  companyName: string = '';
  citizenId: string = '';

  nonGdiMemberSdo: NonGdiMemberSdo = new NonGdiMemberSdo();

  constructor(nonGdiMemberCitizenUdo?: NonGdiMemberCitizenUdo) {
    if (nonGdiMemberCitizenUdo) {
      Object.assign(this, { ...nonGdiMemberCitizenUdo });
    }
  }
}
