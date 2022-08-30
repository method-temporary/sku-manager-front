import { useEffect } from 'react';
import { useStudentLectureId } from 'lecture/student/store/StudentLectureIdStore';
import { getInitialStudentLectureId } from 'lecture/student/viewModel/StudentLectureId';
import { requestGradeSheet } from 'exam/service/requestGradeSheet';

export function useRequestGradeSheet(): void {
  const { studentDenizenId, lectureId } = useStudentLectureId() || getInitialStudentLectureId();

  useEffect(() => {
    if (studentDenizenId === undefined || studentDenizenId === '' || lectureId === undefined || lectureId === '') {
      return;
    }

    requestGradeSheet(studentDenizenId, lectureId);
  }, [studentDenizenId, lectureId]);
}
