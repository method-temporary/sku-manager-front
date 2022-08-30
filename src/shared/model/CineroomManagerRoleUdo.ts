export default class CineroomManagerRoleUdo {
  //
  citizenIds: string[] = [];
  cineroomId: string = '';

  constructor(cineroomManagerRoleUdo?: CineroomManagerRoleUdo) {
    if (cineroomManagerRoleUdo) {
      Object.assign(this, { ...cineroomManagerRoleUdo });
    }
  }
}
