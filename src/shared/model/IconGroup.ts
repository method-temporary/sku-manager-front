export class IconGroup {
  //
  groupId: string = '';
  groupName: string = '';

  constructor(iconGroup?: IconGroup) {
    //
    if (iconGroup) {
      Object.assign(this, { ...iconGroup });
    }
  }
}
