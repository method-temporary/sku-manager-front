export interface CubeReactiveModel {
  id: string;
  passedStudentCount: number;
  starCount: number;
  studentCount: number;
  usedInCard: boolean;
  usingCardCount: number;
}

export function getInitCubeReactiveModel(): CubeReactiveModel {
  //
  return {
    id: '',
    passedStudentCount: 0,
    starCount: 0,
    studentCount: 0,
    usedInCard: false,
    usingCardCount: 0,
  };
}
