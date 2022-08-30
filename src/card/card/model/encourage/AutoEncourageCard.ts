import { PolyglotString } from 'shared/model';

export interface AutoEncourageCard {
  cardId: string;
  name: PolyglotString;
  registeredTime: number;
  registrantName: PolyglotString;
}

export interface AutoEncourageCardParams {
  cardName?: string;
  channelId?: string;
  collegeId?: string;
  limit: number;
  offset: number;
}
