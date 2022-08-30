import { NonGdiMemberSdo } from './NonGdiMemberSdo';

export default class NonGdiMemberCitizensApplicationResult {
  //
  failedToRegisterSdos: NonGdiMemberSdo[] = [];
  failedToModifySdos: NonGdiMemberSdo[] = [];
  failedToDeactivateCitizenIds: string[] = [];
}
