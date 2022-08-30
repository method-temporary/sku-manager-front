import { AutoEncourageSdo } from './AutoEncourageSdo';

export interface AutoEncourage extends AutoEncourageSdo {
  round?: number;
  sentTime: number;
  targetUsers?: string[];
  deliveryEvent: DeliveryEvent;
}

interface DeliveryEvent {
  emailEventIds: string[];
  smsEventIds?: string[];
}
