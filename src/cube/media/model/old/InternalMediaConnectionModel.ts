import { decorate, observable } from 'mobx';

export class InternalMediaConnectionModel {
  panoptoSessionId: string = '';
  viewUrl: string = '';
  thumbUrl: string = '';
  name: string = '';
  startTime: string = '';
  folderName: string = '';
  duration: number = 0;
  folderId: string = '';
  quizIds: string[] = [''];
  transcriptExists: boolean = false;

  constructor(internalMediaConnection?: InternalMediaConnectionModel) {
    //
    if (internalMediaConnection) Object.assign(this, { ...internalMediaConnection });
  }
}

decorate(InternalMediaConnectionModel, {
  panoptoSessionId: observable,
  viewUrl: observable,
  thumbUrl: observable,
  name: observable,
  startTime: observable,
  folderName: observable,
  duration: observable,
  folderId: observable,
  quizIds: observable,
  transcriptExists: observable,
});
