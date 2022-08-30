import { PolyglotString } from 'shared/model';

export interface LabelInputTable {
  id: string;
  name: string;
  memo: string;
  i18nResourcePathId?: string;
  modifiedTime?: number;
  content?: PolyglotString;
  isParent: boolean;
}
