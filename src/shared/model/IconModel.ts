export class IconModel {
  //
  groupId: string = '';
  fileName: string = '';
  extension: string = '';
  path: string = '';
  fileUri: string = '';
  size: number = 0;
  time: number = 0;

  constructor(icon?: IconModel) {
    //
    if (icon) {
      Object.assign(this, { ...icon });
    }
  }
}
