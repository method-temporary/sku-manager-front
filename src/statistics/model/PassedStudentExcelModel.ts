import PassedStudent from './dto/PassedStudent';

export class PassedStudentExcelModel {
  //
  성명: string = '';
  이메일: string = '';
  회사명: string = '';
  소속부서: string = '';
  '멤버십 그룹': string = '';
  '학습 구분': string = '';
  College명: string = '';
  Channel명: string = '';
  Card명: string = '';
  Cube명: string = '';
  '학습시간(분)': string = '';
  '복습시간(초)': string = '';
  '유료과정 여부': string = '';
  '메인 카테고리 여부': string = '';
  '공개 여부': string = '';
  완료일자: string = '';
  '사용자 그룹': string = '';

  constructor(passedStudent?: PassedStudent) {
    //
    if (passedStudent) {
      let membershipType = 'Other';
      if (passedStudent.membershipType === 'Membership200') {
        membershipType = '200시간';
      } else if (passedStudent.membershipType === 'Membership20') {
        membershipType = '20시간';
      } else if (passedStudent.membershipType === 'MembershipNa') {
        membershipType = 'N/A';
      }

      Object.assign(this, {
        성명: passedStudent.name,
        이메일: passedStudent.email,
        회사명: passedStudent.companyName,
        소속부서: passedStudent.departmentName,
        '멤버십 그룹': membershipType,
        '학습 구분': passedStudent.studentType === 'Cube' ? '큐브 학습' : '카드 학습',
        College명: passedStudent.collegeName,
        Channel명: passedStudent.channelName,
        Card명: passedStudent.cardName,
        Cube명: passedStudent.cubeName,
        '학습시간(분)': passedStudent.learningTime,
        '복습시간(초)': passedStudent.replayLearningTime,
        '유료과정 여부': passedStudent.freeOfCharge ? '유료 과정' : '-',
        '메인 카테고리 여부': passedStudent.mainCategoryYn,
        '공개 여부': passedStudent.searchableYn,
        완료일자: passedStudent.passedDate,
        '사용자 그룹': '',
      });
    }
  }
}
