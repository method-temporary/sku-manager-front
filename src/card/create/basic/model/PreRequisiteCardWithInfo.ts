import { PrerequisiteCard } from '_data/lecture/cards/model/vo/PrerequisiteCard';
import { CardCategory } from '../../../../shared/model';

export interface PreRequisiteCardWithInfo extends PrerequisiteCard {
  //
  mainCategory: CardCategory;
  learningTime: number;
  hasStamp: boolean;
  registeredTime: number;
  accessible: boolean;
}
