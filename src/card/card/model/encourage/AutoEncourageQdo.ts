import { PolyglotString } from 'shared/model';
import { Target } from '_data/lecture/autoEncourage/model/Target';

export interface AutoEncourageQdo {
  cardId: string;
  id: string;
  registrantId: string;
  registrantName: PolyglotString;
  title: string;
  scheduledSendTime?: number;
  sentTime?: number;
  target: Target;
  targetUsers?: string[];
}

export type DeliveryType = 'Sms' | 'Email' | '';

export interface AutoEncourageParams {
  cardId: string;
  title: string;
  deliveryType: DeliveryType;
  limit: number;
  offset: number;
  startTime?: number;
  endTime?: number;
  target: Target;
  round?: number;
}
