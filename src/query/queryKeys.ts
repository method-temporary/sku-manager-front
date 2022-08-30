import { AutoEncourageParams } from '_data/lecture/autoEncourage/model/AutoEncourageQdo';
import { CopyAutoEncourageCdo } from '_data/lecture/autoEncourage/model/CopyAutoEncourageCdo';
import { AutoEncourageExcludedStudentParams } from '_data/lecture/autoEncourageExcludedStudents/model/AutoEncourageExcludedStudentParams';
import { AutoEncourageCardParams } from '_data/lecture/cards/model/AutoEncourageCardParams';
import { findByRepresentativeNumberRdo } from '_data/support/model/FindByRepresentativeNumberRdo';
import { ContentProviderContentQdo } from '../_data/cube/contentProviderAdmin/model/ContentProviderContentQdo';
import { CpHistoryQdo } from '../_data/contentProvider/cpHistories/model/CpHistoryQdo';
import { CardStudentQdo } from '../_data/lecture/students/model/CardStudentQdo';
import CardRdo from '../_data/lecture/cards/model/CardRdo';
import { GroupBasedAccessRule } from '../shared/model';
import { ExamPaperAdminRdo } from '../exam/model/sdo/ExamPaperAdminRdo';
import { StudentLearningStateUdo } from '../card/student/model/vo/StudentLearningStateUdo';
import { StudentCountQdo } from '../_data/lecture/students/model/sdo/StudentCountQdo';
import { CardRelatedStudentCdo } from '../_data/lecture/students/model/sdo/CardRelatedStudentCdo';
import { InstructorSdo } from '../_data/user/instructors/model/InstructorSdo';
import { StudentAcceptOrRejectUdo } from '../_data/lecture/students/model/sdo/StudentAcceptOrRejectUdo';
import { CubeAdminRdo } from '../cube/cube';
import { CardIconType } from '_data/imagesUpload/model/CardIconType';
import { PaidCourseQueryModel } from '_data/lecture/students/model/PaidCourseQueryModel';
import { useFindAssessmentResultDetail } from '../capability/capability.hook';
import { CapabilityQdo } from '../capability/model/CapabilityQdo';

export const queryKeys = {
  findAutoEncourageById: (autoEncourageId?: string) => ['findAutoEncourageById', autoEncourageId] as const,
  findAutoEncourageQdo: (autoEncourageParams: AutoEncourageParams) =>
    ['findAutoEncourageQdo', autoEncourageParams] as const,
  findAutoEncourageExcludedStudent: (ExcludedStudentParams: AutoEncourageExcludedStudentParams) =>
    ['findAutoEncourageExcludedStudent', ExcludedStudentParams] as const,
  copyAutoEncouragesByCardIds: (copyAutoEncourageCdo: CopyAutoEncourageCdo) =>
    ['copyAutoEncouragesByCardIds', copyAutoEncourageCdo] as const,
  findUser: ['findUser'],
  findEnableRepresentativeNumber: (findByRepresentativeNumberParams: findByRepresentativeNumberRdo) =>
    ['findEnableRepresentativeNumber', findByRepresentativeNumberParams] as const,

  findAutoEncourageCards: (autoEncourageCardParams: AutoEncourageCardParams) => [
    'findAutoEncourageCards',
    autoEncourageCardParams,
  ],
  // contentProvider
  findContentProviderContents: (contentProviderContentQdo: ContentProviderContentQdo) =>
    ['findContentProviderContents', contentProviderContentQdo] as const,
  findLinkedInContentByUrn: (urn: string) => ['findLinkedInContentByUrn', urn] as const,
  registerLinkedInContentByUrn: (urn: string) => ['registerLinkedInContentByUrn', urn] as const,
  modifyLinkedInCpContents: ['modifyLinkedInCpContents'],
  // cpHistory
  findAllCpHistories: (cpHistoryQdo: CpHistoryQdo) => ['findAllCpHistories', cpHistoryQdo] as const,
  findCoursera: (cpHistoryQdo: CpHistoryQdo) => ['findCoursera', cpHistoryQdo] as const,
  findCpHistoryById: (id: string) => ['findCpHistoryById', id] as const,
  // cardStudent
  findCardStudentForAdmin_Student: (cardStudentQdo: CardStudentQdo) =>
    ['findCardStudentForAdmin_Student', cardStudentQdo] as const,
  findCardStudentForAdmin_Student_ExcelDown: (cardStudentQdo: CardStudentQdo) =>
    ['findCardStudentForAdmin_Student_ExcelDown', cardStudentQdo] as const,
  findCardStudentForAdmin_Result: (cardStudentQdo: CardStudentQdo) =>
    ['findCardStudentForAdmin_Result', cardStudentQdo] as const,
  findCardStudentForAdmin_Result_ExcelDown: (cardStudentQdo: CardStudentQdo) =>
    ['findCardStudentForAdmin_Result_ExcelDown', cardStudentQdo] as const,
  modifyStudentsState: (studentLearningStateUdo: StudentLearningStateUdo) =>
    ['modifyStudentsState', studentLearningStateUdo] as const,
  findStudentCount: (studentCountQdo: StudentCountQdo) => ['findStudentCount', studentCountQdo] as const,
  registerRelatedStudents: (cardRelatedStudentCdo: CardRelatedStudentCdo) =>
    ['registerRelatedStudents', cardRelatedStudentCdo] as const,
  accept: (studentAcceptOrReject: StudentAcceptOrRejectUdo) => ['accept', studentAcceptOrReject] as const,
  reject: (studentAcceptOrReject: StudentAcceptOrRejectUdo) => ['reject', studentAcceptOrReject] as const,
  // card
  findCardByRdo: (cardRdo: CardRdo) => ['findCardByRdo', cardRdo] as const,
  findCardForAdmin: (id: string) => ['findCardForAdmin', id] as const,
  findCardByRdoForExcel: (cardRdo: CardRdo) => ['findCardByRdoForExcel', cardRdo] as const,
  findCardAdminCount: (cardRdo: CardRdo) => ['findCardAdminCount', cardRdo] as const,
  findCardByRdoForModal: (cardRdo: CardRdo, groupAccessRoles: GroupBasedAccessRule) =>
    ['findCardByRdoForModal', cardRdo, groupAccessRoles] as const,
  findCardByRdoIgnoreAccessRule: (cardRdo: CardRdo, groupAccessRoles: GroupBasedAccessRule) =>
    ['findCardByRdoIgnoreAccessRule', cardRdo, groupAccessRoles] as const,
  findCardById: (cardId: string) => ['findCardById', cardId] as const,
  // cardApproval
  findCardApprovalByRdo: (cardApprovalRdo: CardRdo) => ['findCardByRdo', cardApprovalRdo] as const,
  findCardApprovalCount: (cardApprovalRdo: CardRdo) => ['findCardApprovalCount', cardApprovalRdo] as const,
  // userGroup
  findAllUserGroupMap: () => ['findAllUserGroupMap'],
  // userWorkSpace
  findAllUserWorkSpaces: ['findAllUserWorkSpaces'],
  // exam
  findExamPapers: (examPaperAdminRdo: ExamPaperAdminRdo) => ['findExamPapers', examPaperAdminRdo],
  // college
  findColleges: ['findColleges'],
  findAllColleges: ['findAllColleges'],
  findCollegeForCineroomId: ['findCollegeForCineroomId'],
  //paidCourse
  findStudentApprovalsForAdmin: (paidCourseParams: PaidCourseQueryModel) =>
    ['findStudentApprovalsForAdmin', paidCourseParams] as const,
  // instructor
  findInstructors: (instructorSdo: InstructorSdo) => ['', instructorSdo] as const,
  // cube
  findCubeByRdo: (cubeAdminRdo: CubeAdminRdo) => ['findCubeByRdo', cubeAdminRdo] as const,
  // 카드 썸네일 이미지
  findIconGroups: (iconType: CardIconType) => ['findIconGroups', iconType] as const,
  findIcons: (groupId: string) => ['findIcons', groupId] as const,
  // capability
  findAssessments: () => ['findAssessments'] as const,
  findAssessmentResults: (qdo: CapabilityQdo) => ['findAssessmentResults', qdo] as const,
  findAssessmentResultDetail: (id: string) => ['findAssessmentResultDetail', id] as const,
};
