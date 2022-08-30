import { CpContentStatus } from './CpContentStatus';

export interface CpContent {
  //
  usid: string;
  contentProviderId: string;
  title: string;
  type: string;
  registeredTime: number;
  modifiedTime: number;
  status: CpContentStatus;
  linkMediaUrl: string;
}
