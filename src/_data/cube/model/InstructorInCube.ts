import { InstructorWithOptional } from '../../../instructor/instructor/shared/components/instructorModal/model/InstructorWithOptional';

export interface InstructorInCube {
  //
  instructorId: string;
  lectureTime: number;
  instructorLearningTime: number;
  representative: boolean;
  round: number;
}

function fromInstructorWithOptional(instructor: InstructorWithOptional): InstructorInCube {
  //
  return {
    instructorId: instructor.instructor.id || '',
    lectureTime: instructor.lectureTime || 0,
    instructorLearningTime: instructor.instructorLearningTime || 0,
    representative: instructor.representative || false,
    round: instructor.round || 1,
  };
}

export const InstructorInCubeFunc = { fromInstructorWithOptional };
