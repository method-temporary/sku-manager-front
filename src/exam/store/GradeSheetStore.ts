import { GradeSheetViewModel } from 'exam/viewmodel/GradeSheetViewModel';
import { createStore } from 'shared/store';

const [setGradeSheetViewModel, onGradeSheetViewModel, getGradeSheetViewModel, useGradeSheetViewModel] =
  createStore<GradeSheetViewModel>();

export { setGradeSheetViewModel, onGradeSheetViewModel, getGradeSheetViewModel, useGradeSheetViewModel };
