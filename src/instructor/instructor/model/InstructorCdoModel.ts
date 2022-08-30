import { decorate, observable } from 'mobx';
import moment from 'moment';

import { PolyglotModel } from 'shared/model';
import { LangSupport, langSupportCdo, DEFAULT_LANGUAGE } from 'shared/components/Polyglot';
import { replaceAll } from 'shared/helper';

import { InstructorWithUserIdentity } from './InstructorWithUserIdentity';
import { InstructorCdo } from './InstructorCdo';

export class InstructorCdoModel {
  //
  internal: boolean = true; // 강사 구분 ( 사내, 사외 )
  resting: boolean = false; // 활동, 비활동
  collegeId: string = ''; // College

  employeeId: string = ''; // 사번

  denizenId: string = ''; // 사내일 경우
  name: PolyglotModel = new PolyglotModel(); // 이름
  position: PolyglotModel = new PolyglotModel(); // Position
  organization: PolyglotModel = new PolyglotModel(); // 소소기관/부서

  email: string = ''; // email
  phone: string = ''; // phone
  tag: PolyglotModel = new PolyglotModel(); // Tag

  previewPhotoPath: string = ''; // 데이터 입력 전 미리보기 경로
  photoFilePath: string = ''; // 사진

  lectureField: PolyglotModel = new PolyglotModel(); // 세부 강의 분야
  career: PolyglotModel = new PolyglotModel(); // 경력

  appointmentDate: string = moment().format('YYYY-MM-DD');

  accountCreationTime: number = 0;

  fileName: string = '';

  // languages: string[] = [];
  // defaultLanguage: string = '';
  langSupports: LangSupport[] = [DEFAULT_LANGUAGE];

  constructor(instructorCdo?: InstructorCdoModel) {
    //
    if (instructorCdo) {
      const name = (instructorCdo.name && new PolyglotModel(instructorCdo.name)) || instructorCdo.name;
      const position = (instructorCdo.position && new PolyglotModel(instructorCdo.position)) || instructorCdo.position;
      const organization =
        (instructorCdo.organization && new PolyglotModel(instructorCdo.organization)) || instructorCdo.organization;
      const lectureField =
        (instructorCdo.lectureField && new PolyglotModel(instructorCdo.lectureField)) || instructorCdo.lectureField;
      const career = (instructorCdo.career && new PolyglotModel(instructorCdo.career)) || instructorCdo.career;
      const tag = (instructorCdo.tag && new PolyglotModel(instructorCdo.tag)) || instructorCdo.tag;

      const email = instructorCdo.email || '';
      const phone = instructorCdo.phone || '';

      const langSupports = instructorCdo.langSupports.map((langSupport) => new LangSupport(langSupport));

      Object.assign(this, {
        ...instructorCdo,
        name,
        position,
        organization,
        lectureField,
        career,
        email,
        phone,
        tag,
        langSupports,
      });
    }
  }

  static asCdoByInstructorWiths(instructorWiths: InstructorWithUserIdentity): InstructorCdoModel {
    //
    const { instructor, user } = instructorWiths;

    return {
      internal: instructor.internal,
      resting: instructor.resting,
      collegeId: instructor.collegeId,
      employeeId: user.employeeId || '',
      denizenId: instructor.denizenId || '',
      name: instructor.internal
        ? user.name
        : (instructor.name && new PolyglotModel(instructor.name)) || new PolyglotModel(),
      position: new PolyglotModel(instructor.position) || new PolyglotModel(),
      organization: instructor.internal
        ? user.departmentName
        : (instructor.organization && new PolyglotModel(instructor.organization)) || new PolyglotModel(),
      email: instructor.internal ? user.email : instructor.email,
      phone: instructor.internal ? user.phone : instructor.phone,
      tag: instructor.tag,
      previewPhotoPath: instructor.photoFilePath,
      photoFilePath: instructor.photoFilePath,
      lectureField: instructor.lectureField ? new PolyglotModel(instructor.lectureField) : new PolyglotModel(),
      career: instructor.career ? new PolyglotModel(instructor.career) : new PolyglotModel(),
      appointmentDate: instructor.appointmentDate || moment().format('YYYY-MM-DD'),
      fileName: '',
      accountCreationTime: instructor.accountCreationTime,
      langSupports: instructor.langSupports.map((langSupport) => new LangSupport(langSupport)),
    };
  }

  static asInstructorCdo(instructorCdo: InstructorCdoModel): InstructorCdo {
    //
    return {
      internal: instructorCdo.internal,
      resting: instructorCdo.resting,
      collegeId: instructorCdo.collegeId,
      employeeId: instructorCdo.employeeId,
      denizenId: instructorCdo.denizenId,
      name: instructorCdo.name,
      position: instructorCdo.position,
      organization: instructorCdo.organization,
      email: instructorCdo.email.trim(),
      phone: replaceAll(instructorCdo.phone, '-', '').trim(),
      tag: instructorCdo.tag,
      photoFilePath: instructorCdo.photoFilePath,
      lectureField: instructorCdo.lectureField,
      career: instructorCdo.career,
      appointmentDate: instructorCdo.appointmentDate,
      accountCreationTime: !instructorCdo.internal ? undefined : instructorCdo.accountCreationTime,
      langSupports: langSupportCdo(instructorCdo.langSupports),
    };
  }
}

decorate(InstructorCdoModel, {
  internal: observable,
  resting: observable,
  collegeId: observable,
  employeeId: observable,
  denizenId: observable,
  name: observable,
  position: observable,
  organization: observable,
  email: observable,
  phone: observable,
  tag: observable,
  previewPhotoPath: observable,
  photoFilePath: observable,
  lectureField: observable,
  career: observable,
  appointmentDate: observable,
  langSupports: observable,
});
