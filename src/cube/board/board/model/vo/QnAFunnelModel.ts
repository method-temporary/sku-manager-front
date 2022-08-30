export class QnAFunnelModel {
  //
  id: string = '';
  name: string = '';
  type: string = '';
  channel: string = '';
  time: number = 0;
  creatorName: string = '';

  constructor(qnaFunnelModel?: QnAFunnelModel) {
    //
    if (qnaFunnelModel) {
      Object.assign(this, { ...qnaFunnelModel });
    }
  }
}
