import { PolyglotModel } from 'shared/model';
import { getEmailWithDash } from 'shared/helper';
import { LangSupport, DEFAULT_LANGUAGE } from 'shared/components/Polyglot';

export class InstructorModel {
  id: string = '';
  usid: string = '';
  internal: boolean = false;
  name: PolyglotModel = new PolyglotModel();
  denizenId: string = '';
  email: string = '';
  organization: PolyglotModel = new PolyglotModel();
  position: PolyglotModel = new PolyglotModel();
  photoFilePath: string = '';
  collegeId: string = '';
  appointmentDate: string = '';
  career: PolyglotModel = new PolyglotModel();
  lectureField: PolyglotModel = new PolyglotModel();
  tag: PolyglotModel = new PolyglotModel();
  resting: boolean = false;
  registeredTime: string = '';
  modifiedTime: string = '';
  registrant: string = '';
  modifierId: string = '';
  accountCreationTime: number = 0;
  signedDate: number = 0;
  phone: string = '';

  // languages: string[] = [];
  // defaultLanguage: string = '';
  langSupports: LangSupport[] = [DEFAULT_LANGUAGE];

  constructor(instructor?: InstructorModel) {
    //
    if (instructor) {
      const name = (instructor.name && new PolyglotModel(instructor.name)) || instructor.name;
      const organization =
        (instructor.organization && new PolyglotModel(instructor.organization)) || instructor.organization;
      const position = (instructor.position && new PolyglotModel(instructor.position)) || instructor.position;
      const career = (instructor.career && new PolyglotModel(instructor.career)) || instructor.career;
      const lectureField =
        (instructor.lectureField && new PolyglotModel(instructor.lectureField)) || instructor.lectureField;
      const tag = (instructor.tag && new PolyglotModel(instructor.tag)) || instructor.tag;

      const phone = (instructor.phone && getEmailWithDash(instructor.phone)) || instructor.phone;

      const langSupports = instructor.langSupports?.map((langSupport) => new LangSupport(langSupport));

      Object.assign(this, {
        ...instructor,
        name,
        organization,
        position,
        career,
        lectureField,
        phone,
        tag,
        langSupports,
      });
    }
  }
}
