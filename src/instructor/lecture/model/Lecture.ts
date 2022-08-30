import { CategoryModel } from './CategoryModel';
import { CubeContentsModel } from '../../../personalcube/model/old/CubeContentsModel';
import { IdName } from '@nara.platform/accent';
import Instructor from '../../instructor/model/Instructor';

export default interface Lecture {
  id?: string;
  employeeId?: string;

  personalCubeId?: string;
  organizer?: IdName;
  studentCount?: number;
  passedStudentCount?: number;
  name?: string;
  lectureList?: string;
  category?: CategoryModel;
  contents?: CubeContentsModel;
  instructor?: Instructor;
  time?: number;
}

export function getEmptyLecture(): Lecture {
  return {};
}
