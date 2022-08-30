export default class CineroomModel {
  //
  id: string = '';
  name: string = '';
  pavilionId: string = '';
  state: string = '';
  teamId: string = '';

  constructor(cineroom: CineroomModel) {
    //
    if (cineroom) {
      Object.assign(this, { ...cineroom });
    }
  }
}
