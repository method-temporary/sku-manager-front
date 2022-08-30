import { Content } from './vo';

export interface ToktokPortletUdo {
  title: string;
  cinerooms: string[];
  contents: Content[];
  startTime: number;
  endTime: number;
}
