import { NewDatePeriod, PolyglotModel } from 'shared/model';

import { BoardConfigModel } from './BoardConfigModel';
import { BoardCompletionConditionModel } from './BoardCompletionConditionModel';

export class BoardCdoModel {
  //
  audienceKey: string = 'r2p8-r@nea-m5-c5';
  name: PolyglotModel = new PolyglotModel();
  config: BoardConfigModel = new BoardConfigModel();
  learningPeriod: NewDatePeriod = new NewDatePeriod();
  automaticCompletion: boolean = false;
  completionCondition: BoardCompletionConditionModel = new BoardCompletionConditionModel();
}
