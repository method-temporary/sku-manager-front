import { PolyglotModel } from 'shared/model';
import { LearningContentType } from './LearningContentType';
import { CubeType } from '../../../../cube/model/CubeType';

export interface LearningContent {
  //
  chapter: boolean;
  contentDetailType: CubeType;
  contentId: string;
  description: PolyglotModel | null;
  enrollmentRequired: boolean;
  learningContentType: LearningContentType;
  name: PolyglotModel;
  parentId: string;
  children?: LearningContent[];
}

export function getInitLearningContent(): LearningContent {
  //
  return {
    chapter: false,
    contentDetailType: '',
    contentId: '',
    description: null,
    enrollmentRequired: false,
    learningContentType: '',
    name: new PolyglotModel(),
    parentId: '',
    children: [],
  };
}
