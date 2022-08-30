import { getInitTaskCubeCompletionCondition, TaskCubeCompletionCondition } from './TaskCubeCompletionCondition';
import { BoardConfig, getInitBoardConfig } from './BoardConfig';
import { DatePeriod, DatePeriodFunc } from '../../../shared';
import { DramaEntity } from '@nara.platform/accent';
import { PatronKey, PolyglotModel } from '../../../../shared/model';
import { Post } from './Post';

export interface Board extends DramaEntity {
  //
  automaticCompletion: boolean;
  completionCondition: TaskCubeCompletionCondition;
  config: BoardConfig;
  learningPeriod: DatePeriod;
  name: PolyglotModel;
  posts: Post[];
}

export function getInitBoard(): Board {
  //
  return {
    automaticCompletion: false,
    completionCondition: getInitTaskCubeCompletionCondition(),
    config: getInitBoardConfig(),
    learningPeriod: DatePeriodFunc.initialize(),
    name: new PolyglotModel(),
    posts: [],
    id: '',
    patronKey: new PatronKey(),
    entityVersion: 0,
  };
}
