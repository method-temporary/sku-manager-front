import { decorate, observable } from 'mobx';

export class InternalMediaConnection {
  //
  panogtoSessionId: string = '';
  viewUrl: string = '';
  thumbUrl: string = '';
  startTime: string = '';
  name: string = '';
  duration: number = 0;
  folderName: string = '';
  folderId: string = '';

  constructor(internalMediaConnection?: InternalMediaConnection) {
    if (internalMediaConnection) {
      Object.assign(this, { ...internalMediaConnection });
    }
  }
}

decorate(InternalMediaConnection, {
  panogtoSessionId: observable,
  viewUrl: observable,
  thumbUrl: observable,
  startTime: observable,
  name: observable,
  duration: observable,
  folderName: observable,
  folderId: observable,
});
