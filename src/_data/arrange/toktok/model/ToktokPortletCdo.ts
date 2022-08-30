import { Content } from './vo';

export interface ToktokPortletCdo {
  title: string;
  cinerooms: string[];
  contents: Content[];
  startTime: number;
  endTime: number;
}
