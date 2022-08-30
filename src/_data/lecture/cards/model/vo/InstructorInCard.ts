export interface InstructorInCard {
  //
  instructorId: string;
  representative: boolean;
}

export function getInitInstructor() {
  //
  return {
    instructorId: '',
    representative: false,
  };
}
