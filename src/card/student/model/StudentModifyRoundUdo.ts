export interface StudentModifyRoundUdo {
  //
  studentId: string;
  round: number;
}

export function initializeStudentModifyRoundUdo() {
  //
  return {
    studentId: '',
    round: 1,
  };
}
