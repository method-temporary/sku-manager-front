import { decorate, observable } from 'mobx';
import moment from 'moment';

import { DramaEntity } from '@nara.platform/accent';

import { PatronKey, PolyglotModel } from 'shared/model';
import { EnumUtil, BadgeIssueStateView } from 'shared/ui';
import { booleanToYesNo } from 'shared/helper';

import { MemberModel } from '_data/approval/members/model';

import { BadgeIssueState } from './BadgeIssueState';
import { BadgeStudentXlsxModel } from './BadgeStudentXlsxModel';
import { BadgeMissionState } from './BadgeMissionState';

export class BadgeStudentModel implements DramaEntity {
  entityVersion: number = 0;
  id: string = '';
  patronKey: PatronKey = new PatronKey();
  studentInfo: MemberModel = new MemberModel();
  registeredTime: number = 0; // 시작일
  badgeIssueState: BadgeIssueState = BadgeIssueState.None; // 배지 발급 상태
  badgeIssueStateModifiedTime: number = 0; // 배지 발급 상태 변경 시간
  learningCanceledTime: number = 0; // 학습 취소 시간
  learningCompletedTime: number = 0; // 학습 완료 시간
  additionalRequirementsMailSentTime: number = 0; // 추가발급조건 메일발송 시간
  additionalRequirementsConfirmedTime: number = 0; // 추가발급조건 확인시간
  additionalRequirementsPassed: boolean | undefined = undefined; // 추가발급조건(추가미션) 수행
  badgeIssueMailSentTime: number = 0; // 배지 이수 메일 발송 시간
  name: PolyglotModel = new PolyglotModel();

  badgeId: string = '';
  completedCardIds: string[] = [];

  constructor(student?: BadgeStudentModel) {
    //
    if (student) {
      const studentInfo = (student.studentInfo && new MemberModel(student.studentInfo)) || this.studentInfo;
      const name = (student.name && new PolyglotModel(student.name)) || this.name;
      Object.assign(this, { ...student, studentInfo, name });
    }
  }

  static formattedIssuedTime(student: BadgeStudentModel) {
    return student.badgeIssueState === BadgeIssueState.Issued
      ? moment(student.badgeIssueStateModifiedTime).format('YY.MM.DD')
      : '-';
  }

  static formattedIssueRequestTime(student: BadgeStudentModel) {
    if (student.registeredTime === 0) {
      return '-';
    }
    return student.badgeIssueState !== BadgeIssueState.None ? moment(student.registeredTime).format('YY.MM.DD') : '-';
  }

  static formattedIssuedState(student: BadgeStudentModel) {
    return student.learningCanceledTime
      ? BadgeIssueStateView.ChallengeCancel
      : EnumUtil.getEnumValue(BadgeIssueStateView, student.badgeIssueState).get(student.badgeIssueState) || '-';
  }

  static asXLSX(student: BadgeStudentModel, totalCardCount: number): BadgeStudentXlsxModel {
    //
    return {
      '소속사(Ko)': student.studentInfo?.companyName?.ko || '-',
      '소속사(En)': student.studentInfo?.companyName?.en || '-',
      '소속사(Zh)': student.studentInfo?.companyName?.zh || '-',
      '소속 조직(팀) (Ko)': student.studentInfo?.departmentName.ko || '-',
      '소속 조직(팀) (En)': student.studentInfo?.departmentName.en || '-',
      '소속 조직(팀) (Zh)': student.studentInfo?.departmentName.zh || '-',
      '성명(Ko)': student.name.ko || '-',
      '성명(En)': student.name.en || '-',
      '성명(Zh)': student.name.zh || '-',
      'E-mail': student.studentInfo?.email,
      신청일자: BadgeStudentModel.formattedIssueRequestTime(student),
      진도율: `${student.completedCardIds ? student.completedCardIds.length : 0} / ${totalCardCount}`,
      '추가미션 메일발송': student.additionalRequirementsMailSentTime > 0 ? 'YES' : 'NO',
      추가미션수행: !student.additionalRequirementsMailSentTime
        ? '-'
        : booleanToYesNo(student.additionalRequirementsPassed)
        ? BadgeMissionState.Passed
        : BadgeMissionState.Failed,
      발급일자: BadgeStudentModel.formattedIssuedTime(student),
      'Badge 획득여부': BadgeStudentModel.formattedIssuedState(student),
      재직여부: student.studentInfo && student.studentInfo.id && student.studentInfo.id !== '' ? 'Y' : 'N',
    };
  }
}

decorate(BadgeStudentModel, {
  registeredTime: observable,
  badgeIssueState: observable,
  badgeIssueStateModifiedTime: observable,
  learningCanceledTime: observable,
  learningCompletedTime: observable,
  additionalRequirementsMailSentTime: observable,
  additionalRequirementsConfirmedTime: observable,
  additionalRequirementsPassed: observable,
  badgeIssueMailSentTime: observable,
  badgeId: observable,
  completedCardIds: observable,
  studentInfo: observable,
  name: observable,
});
