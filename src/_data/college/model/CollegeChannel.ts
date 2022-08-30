import { PatronKey, PolyglotModel } from 'shared/model';
import { Channel } from './Channel';
import { Creator } from './vo';

export interface CollegeChannel {
  //
  channels: Channel[];
  collegeType: string;
  creator: Creator;
  description: PolyglotModel;
  displayOrder: number;
  enabled: boolean;
  id: string; // collegeId
  name: PolyglotModel;
  panoptoFolderId: string;
  patronKey: PatronKey;
  registeredTime: number;
}
