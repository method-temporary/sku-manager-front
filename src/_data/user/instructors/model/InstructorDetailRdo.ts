import { Invitation } from './Invitation';
import { InstructorWithUserRdo } from './InstructorWithUserRdo';

export interface InstructorDetailRdo extends InstructorWithUserRdo {
  //
  invitation: Invitation | null;
}
