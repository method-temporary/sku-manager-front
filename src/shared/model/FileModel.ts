import { DenizenKey } from '@nara.platform/accent/src/snap/index';
import { PatronKey } from './PatronKey';

export default class FileModel {
  //
  extension: string = '';
  fileName: string = '';
  fileUri: string = '';
  // imageCategory: PUBLIC,
  imageCategory: string = '';
  path: string = '';
  patronKey: DenizenKey = new PatronKey();
  size: number = 0;
  time: number = 0;

  constructor(fileModel?: FileModel | Promise<FileModel>) {
    //
    if (fileModel) {
      Object.assign(this, { ...fileModel });
    }
  }
}
