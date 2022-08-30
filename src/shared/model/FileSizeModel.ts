export class FileSizeModel {
  //
  width: number = 99999999;
  height: number = 99999999;

  constructor(fileSizeModel?: FileSizeModel) {
    //
    if (fileSizeModel) {
      //
      Object.assign(this, { ...fileSizeModel });
    }
  }

  init(width: number, height: number) {
    //
    this.width = width;
    this.height = height;
  }
}
