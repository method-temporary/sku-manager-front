import { PermittedCineroom } from '_data/lecture/cards/model/vo';

export interface PermittedCineroomWithParentId extends PermittedCineroom {
  parentId: string;
}
