import moment from 'moment';

import { InstructorWithUserIdentity } from './InstructorWithUserIdentity';

export interface InstructorExcelModel {
  //
  강사구분: string;
  Category: string;
  '성명(Ko)': string;
  '성명(En)': string;
  '성명(Zh)': string;
  '소속기관/부서(Ko)': string;
  '소속기관/부서(En)': string;
  '소속기관/부서(Zh)': string;
  '직위(Ko)': string;
  '직위(En)': string;
  '직위(Zh)': string;
  Email: string;
  등록일자: string;
  활동여부: string;
  계정정보: string;
}

export function getInstructorInstructorExcelModel(
  instructorWiths: InstructorWithUserIdentity,
  collegesMap: Map<string, string>
): InstructorExcelModel {
  //
  const { instructor, user } = instructorWiths;

  return {
    강사구분: instructor.internal ? '사내' : '사외',
    Category: collegesMap.get(instructor.collegeId) || '',
    '성명(Ko)': instructor.internal ? user?.name.ko : instructor?.name.ko || '-',
    '성명(En)': instructor.internal ? user?.name.en : instructor?.name.en || '-',
    '성명(Zh)': instructor.internal ? user?.name.zh : instructor?.name.zh || '-',
    '소속기관/부서(Ko)': instructor.internal ? user?.departmentName.ko : instructor?.organization.ko || '-',
    '소속기관/부서(En)': instructor.internal ? user?.departmentName.en : instructor?.organization.en || '-',
    '소속기관/부서(Zh)': instructor.internal ? user?.departmentName.zh : instructor?.organization.zh || '-',
    '직위(Ko)': instructor.position.ko || '-',
    '직위(En)': instructor.position.en || '-',
    '직위(Zh)': instructor.position.zh || '-',
    Email: instructor.internal ? user.email : instructor.email,
    등록일자: instructor.appointmentDate,
    활동여부: instructor.resting ? '비활동' : '활동',
    계정정보:
      instructor.denizenId && instructor.accountCreationTime
        ? moment(instructor.accountCreationTime).format('YYYY-MM-DD')
        : '-',
  };
}
