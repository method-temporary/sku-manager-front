import { createStore } from 'shared/store';
import { getInitialLectureTestListViewModel, LectureTestListViewModel } from 'exam/viewmodel/LectureTestListViewModel';

export const [
  setLectureTestListViewModel,
  onLectureTestListViewModel,
  getLectureTestListViewModel,
  useLectureTestListViewModel,
] = createStore<LectureTestListViewModel>(getInitialLectureTestListViewModel());
