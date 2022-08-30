import { LearningContent } from '_data/lecture/cards/model/vo';
import { CubeDetail } from '_data/cube/model/CubeDetail';
import { CardDiscussion } from '_data/lecture/cards/model/CardDiscussion';

export interface LearningContentWithOptional extends LearningContent {
  //
  cubeWithMaterial?: CubeDetail;
  cardDiscussion?: CardDiscussion;
  children?: LearningContentWithOptional[];
  inChapter: boolean;
  selected: boolean;
}
