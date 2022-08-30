import { PolyglotModel } from 'shared/model';
import { MemberSummaryModel } from './MemberSummaryModel';
import { CategoryModel } from './vo/CategoryModel';
import { LocalDateModel } from './vo/LocalDateModel';

export default interface Instructor {
  id?: string;
  employeeId?: string;
  specialty?: string;
  career?: PolyglotModel;
  feedbackId?: string;
  tag?: PolyglotModel;
  resting?: boolean;
  internal?: boolean;
  lectureCount?: string;
  lectureHour?: string;
  // careerYear?: string;
  appointedDate?: LocalDateModel;
  // repSubject?: string;
  // subjects?: string;
  memberSummary?: MemberSummaryModel;
  lectureList?: string;
  category?: CategoryModel;
  instructorLearningTime?: number;
  lectureTime?: number;
  thumbnailId?: string;
}

export function getEmptyInstructor(): Instructor {
  return {};
}
