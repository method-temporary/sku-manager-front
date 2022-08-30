import { decorate, observable } from 'mobx';

import { DramaEntityObservableModel, NewDatePeriod, NameValueList, PolyglotModel } from 'shared/model';

import { PostModel } from './PostModel';
import { BoardCdoModel } from './sdo/BoardCdoModel';
import { BoardSdo } from './sdo/BoardSdo';
import { BoardConfig } from './vo/BoardConfig';
import { BoardCompletionCondition } from './vo/BoardCompletionCondition';

export class BoardModel extends DramaEntityObservableModel {
  //
  name: PolyglotModel = new PolyglotModel();
  config: BoardConfig = new BoardConfig();
  learningPeriod: NewDatePeriod = new NewDatePeriod();
  automaticCompletion: boolean = false;
  completionCondition: BoardCompletionCondition = new BoardCompletionCondition();

  posts: PostModel[] = [];

  constructor(board?: BoardModel) {
    super();
    if (board) {
      const name = new PolyglotModel(board.name);
      const config = new BoardConfig(board.config);
      const cubeCompletion = new BoardCompletionCondition(board.completionCondition);
      const posts = board.posts && board.posts.map((post) => new PostModel(post));
      Object.assign(this, { ...board, name, config, cubeCompletion, posts });
    }
  }

  static asSdo(board: BoardModel): BoardSdo {
    //
    return {
      name: board.name,
      config: board.config,
      learningPeriod: board.learningPeriod,
      automaticCompletion: board.automaticCompletion,
      completionCondition: board.completionCondition,
    };
  }

  static asNameValues(board: BoardModel): NameValueList {
    //
    return {
      nameValues: [
        {
          name: 'name',
          value: JSON.stringify(board.name),
        },
        {
          name: 'config',
          value: JSON.stringify(board.config),
        },
        {
          name: 'learningPeriod',
          value: JSON.stringify(board.learningPeriod),
        },
        {
          name: 'automaticCompletion',
          value: JSON.stringify(board.automaticCompletion),
        },
        {
          name: 'completionCondition',
          value: JSON.stringify(board.automaticCompletion),
        },
      ],
    };
  }

  static asCdo(board: BoardModel): BoardCdoModel {
    //
    return {
      audienceKey: 'r2p8-r@nea-m5-c5',
      name: board.name,
      config: board.config,
      learningPeriod: board.learningPeriod,
      automaticCompletion: board.automaticCompletion,
      completionCondition: board.completionCondition,
    };
  }
}

decorate(BoardModel, {
  name: observable,
  config: observable,
  learningPeriod: observable,
  automaticCompletion: observable,
  completionCondition: observable,
  posts: observable,
});
