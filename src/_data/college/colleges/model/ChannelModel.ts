import { PatronKey } from '@nara.platform/accent';
import { PolyglotModel } from 'shared/model/PolyglotModel';

export interface ChannelModel {
  id: string;
  entityVersion: number;
  patronKey: PatronKey;
  name: PolyglotModel;
  iconFileBoxId: string;
  description: string;
  displayOrder: number;
  registeredTime: number;
  useFlag: boolean;
}
