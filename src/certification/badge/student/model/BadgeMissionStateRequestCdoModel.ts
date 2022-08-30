export class BadgeMissionStateRequestCdoModel {
  //
  badgeStudentId: string = '';

  constructor(cdo?: BadgeMissionStateRequestCdoModel) {
    if (cdo) {
      Object.assign(this, { ...cdo });
    }
  }
}
