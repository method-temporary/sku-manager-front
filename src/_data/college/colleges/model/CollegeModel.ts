import { PatronKey } from '@nara.platform/accent';
import LangSupport from 'shared/components/Polyglot/model/LangSupport';
import { PolyglotModel } from 'shared/model/PolyglotModel';
import { ChannelModel } from './ChannelModel';
import { CollegeType } from './CollegeType';
import { CreatorModel } from './CreatorModel';

export interface CollegeModel {
  id: string;
  entityVersion: number;
  patronKey: PatronKey;
  collegeType: CollegeType;
  name: PolyglotModel;
  description: string;
  iconFileBoxId: string;
  panoptoFolderId: string;
  channels: ChannelModel[];
  creator: CreatorModel;
  time: number;
  displayOrder: number;
  opened: boolean;
  enabled: boolean;
  langSupports: LangSupport[];
}
