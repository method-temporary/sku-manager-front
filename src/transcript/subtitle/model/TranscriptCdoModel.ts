import { TranscriptState } from "./TranscriptState";

export class TranscriptCdoModel {

  id: string = '';
  audienceKey: string = '';
  deliveryId: string = '';
  locale: string = '';
  idx: number = 0;
  
  text: string = '';
  state: string = '';

  creatorId: string = '';

  startTime: string = '';
  endTime: string = '';
}
