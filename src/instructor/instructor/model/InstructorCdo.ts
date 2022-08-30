import { PolyglotModel } from 'shared/model';
import { LangSupport } from 'shared/components/Polyglot';

export interface InstructorCdo {
  internal: boolean;
  resting: boolean;
  collegeId: string;
  employeeId: string;
  denizenId: string;

  // 사내 강사일 경우 undefined
  name: PolyglotModel;
  position: PolyglotModel;
  organization: PolyglotModel;
  email: string;
  phone: string;

  tag: PolyglotModel;

  photoFilePath: string;
  lectureField: PolyglotModel;
  career: PolyglotModel;
  appointmentDate: string;

  // 사외 강사일 경우 undefined
  accountCreationTime: number | undefined;

  langSupports: LangSupport[];
}
