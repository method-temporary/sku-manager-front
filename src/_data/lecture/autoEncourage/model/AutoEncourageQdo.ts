import PolyglotString from 'shared/model/PolyglotString';
import { Target } from './Target';

export interface AutoEncourageQdo {
  cardId: string;
  id: string;
  registrantId: string;
  registrantName: PolyglotString;
  title: string;
  scheduledSendTime: number;
  sentTime?: number;
  round?: number;
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
  round?: number;
  startTime?: number;
  endTime?: number;
  target: Target;
}
