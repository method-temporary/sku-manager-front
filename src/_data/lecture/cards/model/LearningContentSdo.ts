import { CubeType } from '../../../cube/model/CubeType';
import { PolyglotModel } from '../../../../shared/model';
import { LearningContent, LearningContentType } from './vo';

export interface LearningContentSdo {
  children?: LearningContentSdo[];
  contentDetailType: CubeType;
  contentId: string;
  description: PolyglotModel;
  enrollmentRequired: boolean;
  learningContentType: LearningContentType;
  name: PolyglotModel;
}

function fromLearningContent(learningContent: LearningContent): LearningContentSdo {
  const subContents: LearningContentSdo[] =
    (learningContent.children &&
      learningContent.children.length > 0 &&
      learningContent.children.map((content) => fromLearningContent(content))) ||
    [];

  return { ...learningContent, children: subContents, description: learningContent.description || new PolyglotModel() };
}

export const LearningContentSdoFunc = { fromLearningContent };
