import { CpContentStatus } from '../../../contentProvider/cpContent/model/CpContentStatus';

export interface ContentProviderContent {
  //
  contentProviderId: string;
  id: string;
  linkMediaUrl: string;
  modifiedTime: number;
  registeredTime: number;
  status: CpContentStatus;
  title: string;
  type: string;
  usid: string;
}
