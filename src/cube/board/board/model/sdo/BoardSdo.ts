import { decorate, observable } from 'mobx';
import { NewDatePeriod, PolyglotModel } from 'shared/model';
import { BoardConfig } from '../vo/BoardConfig';
import { BoardCompletionCondition } from '../vo/BoardCompletionCondition';

export class BoardSdo {
  //
  name: PolyglotModel = new PolyglotModel();
  config: BoardConfig = new BoardConfig();
  learningPeriod: NewDatePeriod = new NewDatePeriod();
  automaticCompletion: boolean = false;
  completionCondition: BoardCompletionCondition = new BoardCompletionCondition();

  constructor(boardSdo?: BoardSdo) {
    if (boardSdo) {
      const name = new PolyglotModel(boardSdo.name);
      const config = new BoardConfig(boardSdo.config);
      const completionCondition = new BoardCompletionCondition(boardSdo.completionCondition);
      Object.assign(this, { ...boardSdo, config, completionCondition });
    }
  }
}

decorate(BoardSdo, {
  name: observable,
  config: observable,
  learningPeriod: observable,
  automaticCompletion: observable,
  completionCondition: observable,
});
