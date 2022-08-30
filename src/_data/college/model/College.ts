// front 개선 필요 > Model Import 변경
import { PolyglotModel } from 'shared/model/PolyglotModel';
import { PatronKey } from '../../../shared/model';
import { Creator } from './vo';

export interface College {
  //
  creator: Creator;
  description: PolyglotModel;
  displayOrder: number;
  enabled: boolean;
  id: string;
  name: PolyglotModel;
  panoptoFolderId: string;
  patronKey: PatronKey;
  registeredTime: number;
}
