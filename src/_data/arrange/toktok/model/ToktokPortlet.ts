import { Content } from './vo';

export interface ToktokPortlet {
  id: string;
  patronKey: {
    keyString: string;
  };
  title: string;
  cinerooms: string[];
  contents: Content[];
  startTime: number;
  endTime: number;
  registeredTime: number;
  registrantName: string;
  modifiedTime: number;
  modifier: string;
  modifierName: string;
}
