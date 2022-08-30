import { PolyglotModel } from '../../../../shared/model';
import { LangSupport } from '../../../../shared/components/Polyglot';

export interface Instructor {
  id: string;
  usid: string;
  internal: boolean;
  name: PolyglotModel;
  denizenId: string;
  email: string;
  organization: PolyglotModel;
  position: PolyglotModel;
  photoFilePath: string;
  collegeId: string;
  appointmentDate: string;
  career: PolyglotModel;
  lectureField: PolyglotModel;
  tag: PolyglotModel;
  resting: boolean;
  registeredTime: string;
  modifiedTime: string;
  registrant: string;
  modifierId: string;
  accountCreationTime: number;
  signedDate: number;
  phone: string;
  langSupports: LangSupport[];
}

export function getInitInstructor(): Instructor {
  //
  return {
    id: '',
    usid: '',
    internal: true,
    name: new PolyglotModel(),
    denizenId: '',
    email: '',
    organization: new PolyglotModel(),
    position: new PolyglotModel(),
    photoFilePath: '',
    collegeId: '',
    appointmentDate: '',
    career: new PolyglotModel(),
    lectureField: new PolyglotModel(),
    tag: new PolyglotModel(),
    resting: false,
    registeredTime: '',
    modifiedTime: '',
    registrant: '',
    modifierId: '',
    accountCreationTime: 0,
    signedDate: 0,
    phone: '',
    langSupports: [],
  };
}
