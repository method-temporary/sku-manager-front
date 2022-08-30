export interface CardRelatedCount {
  //
  id: string;

  passedStudentCount: number;
  studentCount: number;
  starCount: number;
  badgeCount: number;
}

export function getInitCardRelatedCount(): CardRelatedCount {
  return {
    badgeCount: 0,
    id: '',
    passedStudentCount: 0,
    starCount: 0,
    studentCount: 0,
  };
}
