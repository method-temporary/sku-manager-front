import { createStore } from 'shared/store';
import { getInitialStudentLectureId, StudentLectureId } from '../viewModel/StudentLectureId';

export const [setStudentLectureId, onStudentLectureId, getStudentLectureId, useStudentLectureId] =
  createStore<StudentLectureId>(getInitialStudentLectureId());
