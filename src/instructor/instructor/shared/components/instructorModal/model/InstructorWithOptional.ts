import { InstructorDetailRdo } from '_data/user/instructors/model/InstructorDetailRdo';
import { InstructorWithUserRdo } from '../../../../../../_data/user/instructors/model/InstructorWithUserRdo';

export interface InstructorWithOptional extends InstructorDetailRdo {
  //
  representative?: boolean;
  lectureTime?: number;
  instructorLearningTime?: number;
  round?: number;
}

function fromInstructorWithUserRdo(instructor: InstructorWithUserRdo): InstructorWithOptional {
  return {
    ...instructor,
    invitation: null,
    representative: false,
    instructorLearningTime: 0,
    lectureTime: 0,
    round: 1,
  };
}

export const InstructorWithOptionalFunc = { fromInstructorWithUserRdo };
