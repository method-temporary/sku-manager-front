import { getInitInstructor, Instructor } from './Instructor';
import { Invitation } from './Invitation';
import { getInitUser, User } from './User';

export interface InstructorWithUserRdo {
  //
  instructor: Instructor;
  user: User;
}

function initializer(): InstructorWithUserRdo {
  return {
    instructor: getInitInstructor(),
    user: getInitUser(),
  };
}

export const InstructorWithUserRdoFunc = { initializer };
