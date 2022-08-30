import { TrainingListViewModel } from './TrainingListViewModel';
import { decorate, observable } from 'mobx';

export class TrainingForCardListViewModel {
  //
  cubeStudents: TrainingListViewModel[] = [];
}

decorate(TrainingForCardListViewModel, {
  cubeStudents: observable,
});
