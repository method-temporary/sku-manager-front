import { Category } from '../../college/model';
import { LangSupport } from '../../../shared/components/Polyglot';
import { PatronKey, PolyglotModel } from '../../../shared/model';
import { DramaEntity } from '@nara.platform/accent';
import { CubeType } from './CubeType';

export interface Cube extends DramaEntity {
  categories: Category[];
  defaultLanguage: string;
  enabled: boolean;
  enrollmentCardId: string;
  hasTest: boolean;
  langSupports: LangSupport[];
  learningTime: number;
  name: PolyglotModel;
  registeredTime: number;
  reportName: PolyglotModel;
  sharingCineroomIds: string[];
  subType: string;
  surveyCaseId: string;
  type: CubeType;
}

export function getIntiCube(): Cube {
  //
  return {
    categories: [] as Category[],
    defaultLanguage: '',
    enabled: false,
    enrollmentCardId: '',
    hasTest: false,
    langSupports: [] as LangSupport[],
    learningTime: 0,
    name: new PolyglotModel(),
    registeredTime: 0,
    reportName: new PolyglotModel(),
    sharingCineroomIds: [] as string[],
    subType: '',
    surveyCaseId: '',
    type: '',
    id: '',
    patronKey: new PatronKey(),
    entityVersion: 0,
  };
}

function getMainCategory(cube: Cube) {
  return (cube.categories && cube.categories.find((category) => category.mainCategory)) || null;
}

function getCollegeAndChannelName(cube: Cube, collegeMap: Map<string, string>, channelMap: Map<string, string>) {
  const mainCategory = getMainCategory(cube);
  return (
    (mainCategory && `${collegeMap.get(mainCategory.collegeId)} > ${channelMap.get(mainCategory.channelId)}`) || ''
  );
}

export const CubeFunc = { getMainCategory, getCollegeAndChannelName };
