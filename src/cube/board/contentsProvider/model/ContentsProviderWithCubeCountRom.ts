import { AreaType } from './AreaType';

import { PolyglotModel, LangStringsModel } from 'shared/model';
import { DEFAULT_LANGUAGE, LangSupport } from 'shared/components/Polyglot';

export default class ContentsProviderWithCubeCountRom {
  areaType?: AreaType;
  creatorEmail?: string;
  creatorId?: string;
  creatorName?: LangStringsModel;
  cubeCnt?: number;
  enabled?: boolean;
  id?: string;
  name?: PolyglotModel = new PolyglotModel();
  time?: string;
  registrantName?: PolyglotModel = new PolyglotModel();

  langSupports?: LangSupport[] = [DEFAULT_LANGUAGE];
}

export function getEmptyContentsProvider(): ContentsProviderWithCubeCountRom {
  return {};
}

export function getCreatorName(creatorName: LangStringsModel | undefined): string {
  const name = new LangStringsModel(creatorName);
  if (name !== undefined) {
    return name.langStringMap.get(name.defaultLanguage) || '';
  }
  return '';
}
