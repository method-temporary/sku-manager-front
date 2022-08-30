export interface StudentLectureId {
  studentDenizenId: string;
  lectureId: string;
}

export function getInitialStudentLectureId(): StudentLectureId {
  return {
    studentDenizenId: '',
    lectureId: '',
  };
}