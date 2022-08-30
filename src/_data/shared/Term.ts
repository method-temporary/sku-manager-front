import { Concept } from './Concept';
import { PolyglotModel } from '../../shared/model';
import { NameValueList } from '@nara.platform/accent';

export interface Term {
  concept: Concept;
  id: string;
  modifiedTime: number;
  modifiedName: PolyglotModel;
  name: string;
  registeredTime: number;
  registrantName: PolyglotModel;
  synonymTag: string;
  value: NameValueList;
}
