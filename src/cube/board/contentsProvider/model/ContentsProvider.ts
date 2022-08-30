import { DenizenKey } from '@nara.platform/accent';

import { PatronKey, PolyglotModel } from 'shared/model';
import { LangSupport } from 'shared/components/Polyglot';

import { AreaType } from './AreaType';

export default interface ContentsProvider {
  id?: string;
  entityVersion?: number;
  patronKey?: PatronKey;

  providerId?: string;
  cubeCnt?: number;

  areaType?: AreaType;
  time?: number;

  thumbnail?: string;
  depotId?: string;
  remark?: string;

  name?: PolyglotModel;
  phoneNumber?: string;
  email?: string;
  url?: string;
  enabled?: boolean;
  creator?: DenizenKey;

  langSupports?: LangSupport[];
}

export function getEmptyContentsProvider(): ContentsProvider {
  return {};
}
