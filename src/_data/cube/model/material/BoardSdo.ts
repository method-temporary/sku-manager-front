import { TaskCubeCompletionCondition } from './TaskCubeCompletionCondition';
import { BoardConfig } from './BoardConfig';
import { DatePeriod } from '../../../shared';
import { Board } from './Board';

export interface BoardSdo {
  automaticCompletion: boolean;
  completionCondition: TaskCubeCompletionCondition;
  config: BoardConfig;
  learningPeriod: DatePeriod;
}

function fromBoard(board: Board): BoardSdo {
  return {
    ...board,
  };
}

export const BoardSdoFunc = { fromBoard };
