import { NonGdiMemberSdo } from './NonGdiMemberSdo';

export default class NonGdiMemberCitizensApplicationSdo {
  //
  workspaceCineroomId: string = '';
  companyCode: string = '';
  companyName: string = '';

  toRegisterList: NonGdiMemberSdo[] = [];
  toModifyList: NonGdiMemberSdo[] = [];
  toDeactivateCitizenIds: string[] = [];

  constructor(nonGdiMemberCitizensApplicationSdo?: NonGdiMemberCitizensApplicationSdo) {
    if (nonGdiMemberCitizensApplicationSdo) {
      Object.assign(this, { ...NonGdiMemberCitizensApplicationSdo });
    }
  }

  static getCopiedSdo(sdo: NonGdiMemberCitizensApplicationSdo): NonGdiMemberCitizensApplicationSdo {
    const copied = new NonGdiMemberCitizensApplicationSdo();
    copied.workspaceCineroomId = sdo.workspaceCineroomId;
    copied.companyCode = sdo.companyCode;
    copied.companyName = sdo.companyName;
    return copied;
  }
}
