import { PageElementPosition } from '_data/arrange/pageElements/model/vo';
import { CubeType } from './CubeType';
import { PageElementType } from '_data/arrange/pageElements/model/vo/PageElementType';
import { UserCubeState } from '../../cube/cube/model/vo/UserCubeState';
import { ConditionDateType } from '../../cube/cube/model/vo/ConditionDateType';
import { SortFilterState } from './SortFilterState';
import { SearchPeriodType } from '../../_data/arrange/bannnerBundles/model/vo/SearchPeriodType';
import { UserWorkspaceState } from '../../userworkspace/model/vo/UserWorkspaceState';
import { LectureApproverType } from '../../userworkspace/model/vo/LectureApproverType';

const headerValue = [1, 2, 3, false];

export default {
  learningType: [
    { key: '1', text: 'Classroom', value: 'ClassRoomLecture' },
    { key: '2', text: 'E-learning', value: 'ELearning' },
    { key: '3', text: 'Video', value: 'Video' },
    { key: '4', text: 'Audio', value: 'Audio' },
    { key: '5', text: 'Task', value: 'Task' },
    { key: '6', text: 'Web Page', value: 'WebPage' },
    { key: '7', text: 'Documents', value: 'Documents' },
    { key: '8', text: 'Experiential', value: 'Experiential' },
    { key: '9', text: 'Cohort', value: 'Cohort' },
    { key: '10', text: 'Discussion', value: 'Discussion' },
  ],

  learningTypeForSearch: [
    { key: '0', text: '전체', value: '전체' },
    { key: '1', text: 'Classroom', value: 'ClassRoomLecture' },
    { key: '2', text: 'E-learning', value: 'ELearning' },
    { key: '3', text: 'Video', value: 'Video' },
    { key: '4', text: 'Audio', value: 'Audio' },
    { key: '5', text: 'Task', value: 'Task' },
    { key: '6', text: 'Web Page', value: 'WebPage' },
    { key: '7', text: 'Documents', value: 'Documents' },
    { key: '8', text: 'Experiential', value: 'Experiential' },
    { key: '9', text: 'Cohort', value: 'Cohort' },
    { key: '10', text: 'Discussion', value: 'Discussion' },
  ],

  learningTypeForEnum: [
    { key: '0', text: '전체', value: CubeType.ALL },
    // { key: '1', text: 'Classroom', value: CubeType.ClassRoomLecture },
    // { key: '2', text: 'E-learning', value: CubeType.ELearning },
    { key: '3', text: 'Video', value: CubeType.Video },
    { key: '4', text: 'Audio', value: CubeType.Audio },
    { key: '5', text: 'Task', value: CubeType.Task },
    { key: '6', text: 'Web Page', value: CubeType.WebPage },
    { key: '7', text: 'Documents', value: CubeType.Documents },
    { key: '8', text: 'Experiential', value: CubeType.Experiential },
    { key: '9', text: 'Cohort', value: CubeType.Cohort },
    { key: '10', text: 'Discussion', value: CubeType.Discussion },
    // { key: '10', text: 'Community', value: CubeType.Community },
  ],

  learningTypeForEnum2: [
    { key: '0', text: '전체', value: CubeType.ALL },
    { key: '1', text: 'Classroom', value: CubeType.ClassRoomLecture },
    { key: '2', text: 'E-learning', value: CubeType.ELearning },
    { key: '3', text: 'Video', value: CubeType.Video },
    { key: '4', text: 'Audio', value: CubeType.Audio },
    { key: '5', text: 'Task', value: CubeType.Task },
    { key: '6', text: 'Web Page', value: CubeType.WebPage },
    { key: '7', text: 'Documents', value: CubeType.Documents },
    { key: '8', text: 'Experiential', value: CubeType.Experiential },
    { key: '9', text: 'Cohort', value: CubeType.Cohort },
    { key: '10', text: 'Discussion', value: CubeType.Discussion },
    // { key: '10', text: 'Community', value: CubeType.Community },
  ],

  cubeOrCourse: [
    { key: '0', text: '전체', value: '전체' },
    { key: '1', text: 'Cube', value: 'Cube' },
    { key: '2', text: 'Course', value: 'Course' },
  ],

  limit: [
    { key: '1', text: '20개씩 보기', value: 20 },
    { key: '2', text: '50개씩 보기', value: 50 },
    { key: '3', text: '100개씩 보기', value: 100 },
    { key: '4', text: '전체 보기', value: 9999999 },
  ],

  qnaLimit: [
    { key: '1', text: '20개씩 보기', value: 20 },
    { key: '2', text: '50개씩 보기', value: 50 },
    { key: '3', text: '100개씩 보기', value: 100 },
  ],

  colleges: [
    { key: '0', text: 'AI', value: 'h1' },
    { key: '1', text: 'DT', value: 'h2' },
    { key: '2', text: '행복', value: 'h3' },
    { key: '3', text: 'SV', value: 'h4' },
    { key: '4', text: 'Design', value: 'h5' },
    { key: '5', text: 'Global', value: 'h6' },
    { key: '6', text: 'Leadership', value: 'h7' },
    { key: '7', text: 'Management', value: 'h8' },
    { key: '8', text: '미래반도체', value: '10i' },
    { key: '10', text: '에너지솔루션', value: '10m' },
    { key: '11', text: 'BM Design & Storytelling', value: '10k' },
    { key: '9', text: 'SK아카데미', value: '10j' },
  ],

  difficulty: [
    { key: '1', text: 'Basic', value: 'Basic' },
    { key: '2', text: 'Intermediate', value: 'Intermediate' },
    { key: '3', text: 'Advanced', value: 'Advanced' },
    { key: '4', text: 'Expert', value: 'Expert' },
  ],

  assignment: [
    { key: '1', text: 'Yes', value: true },
    { key: '2', text: 'No', value: false },
  ],

  pay: [
    { key: '1', text: '무료', value: true },
    { key: '2', text: '유료', value: false },
  ],

  cubeSections: [
    { key: 'Home', content: 'HOME', link: true },
    { key: 'Learning', content: 'Learning 관리', link: true },
    { key: 'Process', content: '과정 관리', link: true },
    { key: 'Cube', content: 'Cube 관리', active: true },
  ],

  translationCubeSections: [
    { key: 'Home', content: 'HOME', link: true },
    { key: 'Translation', content: 'Translation 관리', link: true },
    { key: 'Process', content: '과정 관리', link: true },
    { key: 'Cube', content: 'Cube 관리', active: true },
  ],

  userWorkspace: [
    { key: 'Home', content: 'HOME', link: true },
    { key: 'Learning', content: '서비스 관리', link: true },
    { key: 'Process', content: '사용자 소속 관리', link: true },
    { key: 'Cube', content: '사용자 소속 관리', active: true },
  ],

  approvalSections: [
    { key: 'Home', content: 'HOME', link: true },
    { key: 'Learning', content: 'Learning 관리', link: true },
    { key: 'Process', content: '과정 관리', active: true },
    { key: 'Cube', content: 'Cube/Course 승인 관리', active: true },
  ],

  courseSections: [
    { key: 'Home', content: 'HOME', link: true },
    { key: 'Learning', content: 'Learning 관리', link: true },
    { key: 'Process', content: '과정 관리', active: true },
    { key: 'Cube', content: 'Course 관리', active: true },
  ],

  translationCardSections: [
    { key: 'Home', content: 'HOME', link: true },
    { key: 'Translation', content: 'Translation 관리', link: true },
    { key: 'Process', content: '과정 관리', link: true },
    { key: 'Card', content: 'Card 관리', active: true },
  ],

  communitySections: [
    { key: 'Home', content: 'HOME', link: true },
    { key: 'Community', content: 'Community 관리', link: true },
    { key: 'Community-2', content: 'Community 관리', link: true },
    { key: 'CommunityManagement', content: 'Community 관리', active: true },
  ],

  approveSections: [
    { key: 'Home', content: 'HOME', link: true },
    { key: 'Learning', content: 'Learning 관리', link: true },
    { key: 'Approve', content: '승인 관리', active: true },
    { key: 'Cube/Course', content: 'Cube/Course 승인 관리', active: true },
  ],

  cardApprovalSections: [
    { key: 'Home', content: 'HOME', link: true },
    { key: 'Learning', content: 'Learning 관리', link: true },
    { key: 'Approve', content: '승인 관리', active: true },
    { key: 'CardApproval', content: 'Card 승인 관리', active: true },
  ],

  createApproveSections: [
    { key: 'Home', content: 'HOME', link: true },
    { key: 'Learning', content: 'Learning 관리', link: true },
    { key: 'CreateApprove', content: 'Create 관리', active: true },
    { key: 'Create', content: 'Create 관리', active: true },
  ],

  paidCourseSections: [
    { key: 'Home', content: 'HOME', link: true },
    { key: 'Learning', content: 'Learning 관리', link: true },
    { key: 'Approve', content: '승인 관리', link: true },
    { key: 'paidCourse', content: '유료 과정', active: true },
  ],

  learningStateSection: [
    { key: 'Home', content: 'HOME', link: true },
    { key: 'Learning', content: 'Learning 관리', link: true },
    { key: 'LearningState', content: '학습상태 관리', link: true },
    { key: 'LearningCompleteProc', content: 'Coursera 학습완료 처리', active: true },
  ],
  LinkedinlearningStateSection: [
    { key: 'Home', content: 'HOME', link: true },
    { key: 'Learning', content: 'Learning 관리', link: true },
    { key: 'LearningState', content: '학습상태 관리', link: true },
    { key: 'LearningCompleteProc', content: 'Linkedin 학습완료 처리', active: true },
  ],

  EnrollmentStateSection: [
    { key: 'Home', content: 'HOME', link: true },
    { key: 'Main', content: '전시관리', link: true },
    { key: 'BannerState', content: 'Banner 관리', link: true },
    { key: 'BannerEnrollment', content: 'Banner 등록관리', active: true },
  ],

  OrganizationStateSection: [
    { key: 'Home', content: 'HOME', link: true },
    { key: 'Main', content: '전시관리', link: true },
    { key: 'BannerState', content: 'Banner 관리', link: true },
    { key: 'BannerOrganization', content: 'Banner 편성관리', active: true },
  ],

  MainCategoryStateSection: [
    { key: 'Home', content: 'HOME', link: true },
    { key: 'Main', content: '전시관리', link: true },
    { key: 'MainCategory', content: 'Main 카테고리 관리', link: true },
    { key: 'CollegeBanner', content: 'Category Banner 관리', active: true },
  ],

  badgeCategorySections: [
    { key: 'Home', content: 'HOME', link: true },
    { key: 'CertificationTop', content: 'Certification 관리', link: true },
    { key: 'Badge', content: 'Badge 관리', link: true },
    { key: 'BadgeCategory', content: 'Badge 분야 관리', active: true },
  ],

  badgeSections: [
    { key: 'Home', content: 'HOME', link: true },
    { key: 'CertificationTop', content: 'Certification 관리', link: true },
    { key: 'Badge', content: 'Badge 관리', link: true },
    { key: 'Badge', content: 'Badge 관리', active: true },
  ],

  badgeApprovalSections: [
    { key: 'Home', content: 'HOME', link: true },
    { key: 'CertificationTop', content: 'Certification 관리', link: true },
    { key: 'CertificationLeft', content: '승인 관리', link: true },
    { key: 'Approval', content: 'Badge 승인 관리', active: true },
  ],

  badgeApproverSections: [
    { key: 'Home', content: 'HOME', link: true },
    { key: 'CertificationTop', content: 'Certification 관리', link: true },
    { key: 'CertificationLeft', content: '승인 관리', link: true },
    { key: 'Approver', content: '승인자 관리', active: true },
  ],

  badgeArrangeSections: [
    { key: 'Home', content: 'HOME', link: true },
    { key: 'CertificationTop', content: 'Certification 관리', link: true },
    { key: 'ArrangeBadge', content: 'Badge 편성 관리', link: true },
    { key: 'Arrange', content: 'Badge 편성 관리', active: true },
  ],

  badgeOrderSections: [
    { key: 'Home', content: 'HOME', link: true },
    { key: 'CertificationTop', content: 'Certification 관리', link: true },
    { key: 'Arrange', content: 'Badge 편성 관리', link: true },
    { key: 'Order', content: 'Badge 분야 순서 관리', active: true },
  ],

  dataBadge: [
    { key: 'Home', content: 'HOME', link: true },
    { key: '-', content: '-', link: true },
    { key: 'badgeCompany', content: '회사별 뱃지 정보 조회', active: true },
  ],

  dataFavorites: [
    { key: 'Home', content: 'HOME', link: true },
    { key: '-', content: '-', link: true },
    { key: 'Favorites', content: '사용자별 즐겨찾기 목록', active: true },
  ],

  dataChannel: [
    { key: 'Home', content: 'HOME', link: true },
    { key: '-', content: '-', link: true },
    { key: 'ChannelInterest', content: '사용자별 관심채널 목록', active: true },
  ],

  dataCommunity: [
    { key: 'Home', content: 'HOME', link: true },
    { key: '-', content: '-', link: true },
    { key: 'CommunityMember', content: '커뮤니티 멤버 조회', active: true },
  ],

  dataLearningCube: [
    { key: 'Home', content: 'HOME', link: true },
    { key: '-', content: '-', link: true },
    { key: 'LearningCube', content: 'Cube 학습 이력 조회', active: true },
  ],

  dataCardMappingList: [
    { key: 'Home', content: 'HOME', link: true },
    { key: '-', content: '-', link: true },
    { key: 'CardMappingList', content: 'Card-Cube Mapping 정보 조회', active: true },
  ],

  dataMetaCard: [
    { key: 'Home', content: 'HOME', link: true },
    { key: '-', content: '-', link: true },
    { key: 'MetaCard', content: 'Card Meta 정보 조회', active: true },
  ],

  dataCardInstructor: [
    { key: 'Home', content: 'HOME', link: true },
    { key: '-', content: '-', link: true },
    { key: 'CardInstructor', content: 'Card 강사 정보 조회', active: true },
  ],

  dataCardPermitted: [
    { key: 'Home', content: 'HOME', link: true },
    { key: '-', content: '-', link: true },
    { key: 'CardPermitted', content: 'Card 핵인싸과정 정보 조회', active: true },
  ],

  dataCardPrerequisite: [
    { key: 'Home', content: 'HOME', link: true },
    { key: '-', content: '-', link: true },
    { key: 'CardPrerequisite', content: 'Card 선수과정 정보 조회', active: true },
  ],

  dataMetaCube: [
    { key: 'Home', content: 'HOME', link: true },
    { key: '-', content: '-', link: true },
    { key: 'MetaCard', content: 'Cube Meta 정보 조회', active: true },
  ],

  dataCubeInstructor: [
    { key: 'Home', content: 'HOME', link: true },
    { key: '-', content: '-', link: true },
    { key: 'CubeInstructor', content: 'Cube 강사 정보 조회', active: true },
  ],

  dataMetaBadge: [
    { key: 'Home', content: 'HOME', link: true },
    { key: '-', content: '-', link: true },
    { key: 'MetaBadge', content: 'Meta Badge 조회', active: true },
  ],

  dataCubeClassroom: [
    { key: 'Home', content: 'HOME', link: true },
    { key: '-', content: '-', link: true },
    { key: 'CubeClassroom', content: 'Cube 유료과정 조회', active: true },
  ],

  collegeSections: [
    { key: 'Home', content: 'HOME', link: true },
    { key: 'Learning', content: '서비스 관리', link: true },
    { key: 'Approve', content: 'Category 관리', link: true },
    { key: 'Cube/Course', content: 'Category 관리', active: true },
  ],

  collegeSequenceSections: [
    { key: 'Home', content: 'HOME', link: true },
    { key: 'Learning', content: '서비스 관리', link: true },
    { key: 'Approve', content: 'Category 관리', link: true },
    { key: 'Cube/Course', content: 'Category 순서 관리', active: true },
  ],

  mainPagePopup: [
    { key: 'Home', content: 'HOME', link: true },
    { key: 'Main', content: '전시관리', link: true },
    { key: 'popup', content: '팝업 관리', link: true },
    { key: 'mainPagePopup', content: '팝업 관리', active: true },
  ],

  qnaOperator: [
    { key: 'Home', content: 'HOME', link: true },
    { key: '서비스 관리', content: '서비스 관리', link: true },
    { key: 'Support 관리', content: 'Support 관리', link: true },
    { key: '문의 담당자 관리', content: '문의 담당자 관리', active: true },
  ],

  recruitmentType: [
    { key: '1', text: '수강신청', value: 'PublicEnrolling' },
    { key: '2', text: '파일등록', value: 'FileUpload' },
  ],

  peopleLimit: [
    { key: '1', text: 'Yes', value: 'Yes' },
    { key: '2', text: 'No', value: 'No' },
  ],

  recruitment: [
    { key: '1', text: 'Yes', value: 'Yes' },
    { key: '2', text: 'No', value: 'No' },
  ],

  survey: [
    { key: '1', text: 'Yes', value: true },
    { key: '2', text: 'No', value: false },
  ],

  hours: [
    { key: '0', text: '00', value: 0 },
    { key: '1', text: '01', value: 1 },
    { key: '2', text: '02', value: 2 },
    { key: '3', text: '03', value: 3 },
    { key: '4', text: '04', value: 4 },
    { key: '5', text: '05', value: 5 },
    { key: '6', text: '06', value: 6 },
    { key: '7', text: '07', value: 7 },
    { key: '8', text: '08', value: 8 },
    { key: '9', text: '09', value: 9 },
    { key: '10', text: '10', value: 10 },
    { key: '11', text: '11', value: 11 },
    { key: '12', text: '12', value: 12 },
    { key: '13', text: '13', value: 13 },
    { key: '14', text: '14', value: 14 },
    { key: '15', text: '15', value: 15 },
    { key: '16', text: '16', value: 16 },
    { key: '17', text: '17', value: 17 },
    { key: '18', text: '18', value: 18 },
    { key: '19', text: '19', value: 19 },
    { key: '20', text: '20', value: 20 },
    { key: '21', text: '21', value: 21 },
    { key: '22', text: '22', value: 22 },
    { key: '23', text: '23', value: 23 },
    { key: '00', text: '24', value: 24 },
  ],

  minute: [
    { key: '1', text: '00', value: 0 },
    { key: '2', text: '05', value: 5 },
    { key: '3', text: '10', value: 10 },
    { key: '4', text: '15', value: 15 },
    { key: '5', text: '20', value: 20 },
    { key: '6', text: '25', value: 25 },
    { key: '7', text: '30', value: 30 },
    { key: '8', text: '35', value: 35 },
    { key: '9', text: '40', value: 40 },
    { key: '10', text: '45', value: 45 },
    { key: '11', text: '50', value: 50 },
    { key: '12', text: '55', value: 55 },
  ],

  hoursType1: [
    { key: '0', text: '00 시', value: 0 },
    { key: '1', text: '01 시', value: 1 },
    { key: '2', text: '02 시', value: 2 },
    { key: '3', text: '03 시', value: 3 },
    { key: '4', text: '04 시', value: 4 },
    { key: '5', text: '05 시', value: 5 },
    { key: '6', text: '06 시', value: 6 },
    { key: '7', text: '07 시', value: 7 },
    { key: '8', text: '08 시', value: 8 },
    { key: '9', text: '09 시', value: 9 },
    { key: '10', text: '10 시', value: 10 },
    { key: '11', text: '11 시', value: 11 },
    { key: '12', text: '12 시', value: 12 },
    { key: '13', text: '13 시', value: 13 },
    { key: '14', text: '14 시', value: 14 },
    { key: '15', text: '15 시', value: 15 },
    { key: '16', text: '16 시', value: 16 },
    { key: '17', text: '17 시', value: 17 },
    { key: '18', text: '18 시', value: 18 },
    { key: '19', text: '19 시', value: 19 },
    { key: '20', text: '20 시', value: 20 },
    { key: '21', text: '21 시', value: 21 },
    { key: '22', text: '22 시', value: 22 },
    { key: '23', text: '23 시', value: 23 },
  ],

  minuteType1: [
    { key: '0', text: '00 분', value: 0 },
    { key: '1', text: '01 분', value: 1 },
    { key: '2', text: '02 분', value: 2 },
    { key: '3', text: '03 분', value: 3 },
    { key: '4', text: '04 분', value: 4 },
    { key: '5', text: '05 분', value: 5 },
    { key: '6', text: '06 분', value: 6 },
    { key: '7', text: '07 분', value: 7 },
    { key: '8', text: '08 분', value: 8 },
    { key: '9', text: '09 분', value: 9 },
    { key: '10', text: '10 분', value: 10 },
    { key: '11', text: '11 분', value: 11 },
    { key: '12', text: '12 분', value: 12 },
    { key: '13', text: '13 분', value: 13 },
    { key: '14', text: '14 분', value: 14 },
    { key: '15', text: '15 분', value: 15 },
    { key: '16', text: '16 분', value: 16 },
    { key: '17', text: '17 분', value: 17 },
    { key: '18', text: '18 분', value: 18 },
    { key: '19', text: '19 분', value: 19 },
    { key: '20', text: '20 분', value: 20 },
    { key: '21', text: '21 분', value: 21 },
    { key: '22', text: '22 분', value: 22 },
    { key: '23', text: '23 분', value: 23 },
    { key: '24', text: '24 분', value: 24 },
    { key: '25', text: '25 분', value: 25 },
    { key: '26', text: '26 분', value: 26 },
    { key: '27', text: '27 분', value: 27 },
    { key: '28', text: '28 분', value: 28 },
    { key: '29', text: '29 분', value: 29 },
    { key: '30', text: '30 분', value: 30 },
    { key: '31', text: '31 분', value: 31 },
    { key: '32', text: '32 분', value: 32 },
    { key: '33', text: '33 분', value: 33 },
    { key: '34', text: '34 분', value: 34 },
    { key: '35', text: '35 분', value: 35 },
    { key: '36', text: '36 분', value: 36 },
    { key: '37', text: '37 분', value: 37 },
    { key: '38', text: '38 분', value: 38 },
    { key: '39', text: '39 분', value: 39 },
    { key: '40', text: '40 분', value: 40 },
    { key: '41', text: '41 분', value: 41 },
    { key: '42', text: '42 분', value: 42 },
    { key: '43', text: '43 분', value: 43 },
    { key: '44', text: '44 분', value: 44 },
    { key: '45', text: '45 분', value: 45 },
    { key: '46', text: '46 분', value: 46 },
    { key: '47', text: '47 분', value: 47 },
    { key: '48', text: '48 분', value: 48 },
    { key: '49', text: '49 분', value: 49 },
    { key: '50', text: '50 분', value: 50 },
    { key: '51', text: '51 분', value: 51 },
    { key: '52', text: '52 분', value: 52 },
    { key: '53', text: '53 분', value: 53 },
    { key: '54', text: '54 분', value: 54 },
    { key: '55', text: '55 분', value: 55 },
    { key: '56', text: '56 분', value: 56 },
    { key: '57', text: '57 분', value: 57 },
    { key: '58', text: '58 분', value: 58 },
    { key: '59', text: '59 분', value: 59 },
  ],

  communities: [
    { key: '0', text: 'Open', value: 'OPEN' },
    { key: '1', text: 'Learning', value: 'LEARNING' },
    { key: '2', text: 'Cohort', value: 'COHORT' },
  ],

  areaType: [
    { key: '0', text: '국내', value: 'Internal' },
    { key: '1', text: '해외', value: 'External' },
  ],

  isUse: [
    { key: '0', text: '활성', value: '1' },
    { key: '1', text: '비활성', value: '0' },
  ],

  // Quill.js
  formats: [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'indent',
    'link',
    'image',
    'video',
  ],

  modules: {
    toolbar: [
      [{ header: headerValue }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
      ['link', 'image', 'video'],
      ['clean'],
    ],
  },

  categoryA: [
    { key: '1', text: 'College 정보1', value: 'college 정보1' },
    { key: '2', text: 'College 정보2', value: 'college 정보2' },
  ],

  categoryB: [
    {
      key: '1',
      text: '1Depth Select 선택된 정보에 따른 Channel 정보1',
      value: '1Depth Select 선택된 정보에 따른 Channel 정보1',
    },
    {
      key: '2',
      text: '1Depth Select 선택된 정보에 따른 Channel 정보2',
      value: '1Depth Select 선택된 정보에 따른 Channel 정보2',
    },
  ],

  status: [
    { key: '0', text: '전체', value: '전체' },
    { key: '1', text: '임시저장', value: 'Created' },
    { key: '2', text: '승인요청', value: 'OpenApproval' },
    { key: '3', text: '승인', value: 'Opened' },
    { key: '4', text: '폐강', value: 'Closed' },
    { key: '5', text: '반려', value: 'Rejected' },
  ],

  statusForApprovalContents: [
    { key: '0', text: '전체', value: '전체' },
    { key: '2', text: '승인요청', value: 'OpenApproval' },
    { key: '3', text: '승인', value: 'Opened' },
    { key: '5', text: '반려', value: 'Rejected' },
  ],

  statusForApprovalContentsEnum: [
    { key: '0', text: '전체', value: UserCubeState.DEFAULT },
    { key: '2', text: '승인요청', value: UserCubeState.OpenApproval },
    { key: '3', text: '승인', value: UserCubeState.Opened },
    { key: '5', text: '반려', value: UserCubeState.Rejected },
  ],

  openType: [
    { key: '0', text: '전체', value: '전체' },
    { key: '1', text: 'Yes', value: 'SearchOn' },
    { key: '2', text: 'No', value: 'SearchOff' },
  ],

  openTypeBoolean: [
    { key: '0', text: '전체', value: '전체' },
    { key: '1', text: 'Yes', value: true },
    { key: '2', text: 'No', value: false },
  ],

  searchPartForCube: [
    { key: '0', text: '전체', value: '전체' },
    { key: '1', text: '과정명', value: '과정명' },
    { key: '2', text: '생성자', value: '생성자' },
  ],

  searchPartForCard: [
    { key: '0', text: '전체', value: '전체' },
    { key: '1', text: '과정명', value: '과정명' },
    { key: '2', text: '생성자', value: '생성자' },
  ],

  searchPartForCubeNotAll: [
    { key: '1', text: '과정명', value: '과정명' },
    { key: '2', text: '생성자', value: '생성자' },
  ],

  searchPartForCubeAll: [
    { key: '1', text: '전체', value: '' },
    { key: '2', text: '과정명', value: '과정명' },
  ],

  sortFilterForUserGroupCategory: [
    { key: '1', text: '최근 등록 순', value: SortFilterState.TimeDesc },
    { key: '2', text: '오래된 등록 순', value: SortFilterState.TimeAsc },
  ],

  sortFilterForUserGroup: [
    { key: '1', text: '최근 등록 순', value: SortFilterState.TimeDesc },
    { key: '2', text: '오래된 등록 순', value: SortFilterState.TimeAsc },
  ],

  sortFilterForCard: [
    { key: '1', text: '최근 등록 순', value: SortFilterState.TimeDesc },
    { key: '2', text: '오래된 등록 순', value: SortFilterState.TimeAsc },
    { key: '3', text: '학습자 많은 순', value: SortFilterState.StudentCountDesc },
    { key: '4', text: '학습자 적은 순', value: SortFilterState.StudentCountAsc },
    { key: '5', text: '이수자 많은 순', value: SortFilterState.PassedStudentCountDesc },
    { key: '6', text: '이수자 적은 순', value: SortFilterState.PassedStudentCountAsc },
  ],

  sortFilterForCube: [
    { key: '1', text: '최근 등록 순', value: SortFilterState.TimeDesc },
    { key: '2', text: '학습자 많은 순', value: SortFilterState.StudentCountDesc },
    { key: '3', text: '학습자 적은 순', value: SortFilterState.StudentCountAsc },
    { key: '4', text: '이수자 많은 순', value: SortFilterState.PassedStudentCountDesc },
    { key: '5', text: '이수자 적은 순', value: SortFilterState.PassedStudentCountAsc },
    { key: '6', text: '별점 높은 순', value: SortFilterState.StarCountDesc },
    { key: '7', text: '별점 낮은 순', value: SortFilterState.StarCountAsc },
  ],

  sortFilterForApproval: [
    { key: '1', text: '최근 신청일자 순', value: 'ModifiedTimeDesc' },
    { key: '2', text: '최근 (차수)교육기간 순', value: 'LearningEndDateDesc' },
    { key: '3', text: '높은 인당 교육금액 순', value: 'ChargeAmountDesc' },
    { key: '4', text: '낮은 인당 교육금액 순', value: 'ChargeAmountAsc' },
    { key: '5', text: '신청자 내림차순', value: 'MemberNameDesc' },
    { key: '6', text: '신청자 오름차순', value: 'MemberNameAsc' },
  ],

  sortFilterForCourse: [
    { key: '1', text: '최근 등록 순', value: 'RegisteredTimeDesc' },
    { key: '2', text: '학습자 많은 순', value: 'StudentCountDesc' },
    { key: '3', text: '학습자 적은 순', value: 'StudentCountAsc' },
    { key: '4', text: '이수자 많은 순', value: 'PassedStudentCountDesc' },
    { key: '5', text: '이수자 적은 순', value: 'PassedStudentCountAsc' },
  ],

  searchPartForCreate: [
    { key: '0', text: '전체', value: '전체' },
    { key: '1', text: '신청자', value: '신청자' },
    { key: '2', text: '신청자 E-mail', value: '신청자Email' },
    { key: '3', text: '과정명', value: '과정명' },
  ],

  kindOfVideo: [
    { key: '1', text: '내부 영상', value: 'InternalMedia' },
    { key: '2', text: '외부 영상', value: 'LinkMedia' },
    { key: '3', text: 'cp사 영상', value: 'ContentsProviderMedia' },
  ],

  kindOfAudio: [
    { key: '1', text: '내부 오디오', value: 'InternalMedia' },
    { key: '2', text: '외부 오디오', value: 'LinkMedia' },
    { key: '3', text: 'cp사 오디오', value: 'ContentsProviderMedia' },
  ],

  learningMaterials: [
    { key: '1', text: '파일첨부', value: '파일첨부' },
    { key: '2', text: '외부 오디오 링크', value: '외부 오디오 링크' },
  ],

  ContentsProviderType: [
    { key: '1', text: 'linkedin', value: 'linkedin' },
    { key: '2', text: 'DataCamp', value: 'DataCamp' },
    { key: '3', text: 'HuNet', value: 'HuNet' },
  ],

  // cardStudent
  stampAcquired: [
    { key: '1', text: '전체', value: '전체' },
    { key: '2', text: 'Y', value: true },
    { key: '3', text: 'N', value: false },
  ],

  cardCompleted: [
    { key: '1', text: '전체', value: '' },
    { key: '2', text: '이수', value: 'Passed' },
    { key: '3', text: '미이수', value: 'Missed' },
  ],

  // student
  learnerType: [
    { key: '1', text: '전체', value: '전체' },
    { key: '2', text: '승인대기', value: 'Submitted' },
    { key: '3', text: '승인', value: 'Approved' },
    { key: '4', text: '승인(학습중)', value: 'ApprovedAndProgress' },
    { key: '5', text: '반려', value: 'Rejected' },
    { key: '6', text: '취소', value: 'Canceled' },
  ],

  searchPartForLearner: [
    { key: '1', text: '전체', value: '전체' },
    { key: '2', text: '소속사', value: '소속사' },
    { key: '3', text: '소속 조직(팀)', value: '소속조직' },
    { key: '4', text: '성명', value: '성명' },
    { key: '5', text: 'E-mail', value: 'Email' },
  ],

  countRound: [
    { key: '1', text: '1차수', value: '1차수' },
    { key: '2', text: '2차수', value: '2차수' },
  ],

  // result management
  scoringState: [
    { key: '1', text: '전체', value: '전체' },
    { key: '2', text: '채점하기', value: 'Waiting' },
    { key: '3', text: '결과보기', value: 'Scoring' },
    { key: '4', text: '미응시', value: 'Missing' },
  ],

  nullState: [{ key: '1', text: '전체', value: '전체' }],

  testFrequency: [
    { key: '1', text: '전체', value: '전체' },
    { key: '2', text: '응시', value: 'Yes' },
    { key: '3', text: '미응시', value: 'No' },
  ],

  testFrequencyForNone: [
    { key: '1', text: '전체', value: '전체' },
    { key: '2', text: '0', value: '0' },
  ],

  completionState: [
    { key: '1', text: '전체', value: '' },
    { key: '2', text: '결과처리 대기', value: 'Progress' },
    { key: '3', text: '이수', value: 'Passed' },
    { key: '4', text: '미이수', value: 'Missed' },
    { key: '5', text: '불참', value: 'NoShow' },
  ],

  surveyCompleted: [
    { key: '1', text: '전체', value: '' },
    { key: '2', text: 'Y', value: 'Y' },
    { key: '3', text: 'N', value: 'N' },
  ],

  scoringLearningState: [
    { key: '1', text: '전체', value: '' },
    { key: '2', text: '결과처리 대기', value: 'Progress' },
    { key: '3', text: '이수', value: 'Passed' },
    { key: '4', text: '미이수', value: 'Missed' },
    { key: '5', text: '불참', value: 'NoShow' },
  ],

  approvalSearchBoxLearningState: [
    { key: '1', text: '전체', value: '' },
    { key: '2', text: '학습중', value: 'Progress' },
    { key: '3', text: '이수', value: 'Passed' },
    { key: '4', text: '미이수', value: 'Missed' },
    { key: '5', text: '불참', value: 'NoShow' },
    { key: '6', text: '학습예정', value: 'Planned' },
  ],

  waitingLearningState: [{ key: '1', text: '결과처리 대기', value: 'Progress' }],

  missingLearningState: [
    { key: '1', text: '전체', value: '' },
    { key: '2', text: '결과처리 대기', value: 'Progress' },
    { key: '3', text: '불참', value: 'NoShow' },
  ],

  searchPartForResultManagement: [
    { key: '1', text: '전체', value: '전체' },
    { key: '2', text: '소속사', value: '소속사' },
    { key: '3', text: '소속 조직(팀)', value: '소속 조직(팀)' },
    { key: '4', text: '성명', value: '성명' },
    { key: '5', text: 'E-mail', value: 'E-mail' },
  ],

  // Support-Board

  searchWordForBoard: [
    { key: '1', text: '전체', value: '전체' },
    { key: '2', text: '제목', value: '제목' },
    { key: '3', text: '작성자', value: '작성자' },
  ],

  answerStatus: [
    { key: '1', text: '전체', value: 'All' },
    { key: '2', text: '답변대기', value: false },
    { key: '3', text: '답변완료', value: true },
  ],

  noticeType: [
    { key: '1', text: '전체', value: 'All' },
    { key: '2', text: '주요', value: 'true' },
    { key: '3', text: '일반', value: 'false' },
  ],

  noticeTypeForCreateNotice: [
    { key: '1', text: '주요', value: true },
    { key: '2', text: '일반', value: false },
  ],

  openStateType: [
    { key: '1', text: 'Created', value: '작성' },
    { key: '2', text: 'Opened', value: '게시' },
    { key: '3', text: 'Closed', value: '게시취소' },
  ],

  modulesForCreateNotice: {
    toolbar: [
      [{ header: headerValue }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
      ['link', 'image', 'video'],
      ['clean'],
    ],
  },

  sectionsForCreateFaq: [
    { key: 'Home', content: 'HOME', link: true },
    { key: 'service', content: '서비스 관리', link: true },
    { key: 'faq', content: 'FAQ 관리', active: true },
  ],

  leftHandSideExpressionBar: [
    { key: 'Home', content: 'HOME', link: true },
    { key: 'service', content: '서비스 관리', link: true },
    { key: 'notice', content: '공지사항 관리', active: true },
  ],

  pathForNotice: [
    { key: 'Home', content: 'HOME', link: true },
    { key: 'Support', content: '서비스 관리', link: true },
    { key: 'Notice', content: '공지사항 관리', link: true },
    { key: 'notice-2', content: '공지사항 관리', active: true },
  ],

  pathForFaq: [
    { key: 'Home', content: 'HOME', link: true },
    { key: 'Service', content: '서비스 관리', link: true },
    { key: 'Support', content: 'Support 관리', link: true },
    { key: 'Faq', content: 'FAQ 관리', active: true },
  ],

  sectionForCreateNotice: [
    { key: 'Home', content: 'HOME', link: true },
    { key: 'service', content: '서비스 관리', link: true },
    { key: 'notice', content: '공지사항 관리', active: true },
  ],

  pathForCategory: [
    { key: 'Home', content: 'HOME', link: true },
    { key: 'Service', content: '서비스 관리', link: true },
    { key: 'Support', content: 'Support 관리', link: true },
    { key: 'Category', content: '카테고리 관리', active: true },
  ],
  pathForQna: [
    { key: 'Home', content: 'HOME', link: true },
    { key: 'Service', content: '서비스 관리', link: true },
    { key: 'Support', content: 'Support 관리', link: true },
    { key: 'Qna', content: '문의 관리', active: true },
  ],
  pathForCallQna: [
    { key: 'Home', content: 'HOME', link: true },
    { key: 'Support', content: '서비스 관리', link: true },
    { key: 'Qna', content: 'Q&A 관리', active: true },
    { key: 'Call', content: '전화문의 관리', active: true },
  ],
  pathForChannel: [
    { key: 'Home', content: 'HOME', link: true },
    { key: 'Support', content: '서비스 관리', link: true },
    { key: 'Channel', content: 'Channel 관리', active: true },
  ],
  pathForMailResult: [
    { key: 'Home', content: 'HOME', link: true },
    { key: 'Support', content: '서비스 관리', link: true },
    { key: 'MailAdmin', content: '발송 관리', link: true },
    { key: 'Mail', content: '메일 발송 관리', active: true },
  ],
  pathForTag: [
    { key: 'Home', content: 'HOME', link: true },
    { key: 'Support', content: '서비스 관리', link: true },
    { key: 'Tag', content: 'Tag 관리', link: true },
    { key: 'Tag-2', content: 'Tag 관리', active: true },
  ],
  pathForCommunityField: [
    { key: 'Home', content: 'HOME', link: true },
    { key: 'Community', content: 'Community 관리', link: true },
    { key: 'Community-2', content: 'Community 관리', link: true },
    { key: 'Field', content: '분야 관리', active: true },
  ],

  searchPartForFaq: [
    { key: '0', text: '전체', value: '전체' },
    { key: '1', text: '제목', value: '제목' },
    { key: '2', text: '작성자', value: '작성자' },
  ],

  searchPartForQna: [
    { key: '0', text: '전체', value: '전체' },
    { key: '1', text: '문의 제목', value: 'Title' },
    { key: '2', text: '문의자', value: 'InquirerName' },
    { key: '3', text: '담당자', value: 'OperatorName' },
    { key: '4', text: '문의자 이메일', value: 'InquirerEmail' },
  ],

  // course
  stampForSearch: [
    { key: '0', text: '전체', value: '전체' },
    { key: '1', text: 'Yes', value: 'YES' },
    { key: '2', text: 'No', value: 'NO' },
  ],

  stamp: [
    { key: '0', text: 'Yes', value: true },
    { key: '1', text: 'No', value: false },
  ],

  //profile
  sectionProfiles: [
    { key: 'Home', content: 'HOME', link: true },
    { key: 'Profile', content: '회원 관리', link: true },
    { key: 'SkProfiles', content: '구성원 관리', link: true },
    { key: 'SkProfile', content: '구성원 관리', active: true },
  ],

  pisAgreement: [
    { key: '1', text: '전체', value: '' },
    { key: '2', text: 'YES', value: 'Y' },
    { key: '3', text: 'NO', value: 'N' },
  ],

  //계정 병합
  sectionHistory: [
    { key: 'Home', content: 'HOME', link: true },
    { key: 'Profile', content: '회원 관리', link: true },
    { key: 'Instructor', content: '구성원 관리', active: true },
    { key: 'SkProfile', content: '계정 병합 이력', active: true },
  ],
  sectionManual: [
    { key: 'Home', content: 'HOME', link: true },
    { key: 'Profile', content: '회원 관리', link: true },
    { key: 'Instructor', content: '구성원 관리', active: true },
    { key: 'SkProfile', content: '선택 계정 병합', active: true },
  ],
  sectionRecommend: [
    { key: 'Home', content: 'HOME', link: true },
    { key: 'Profile', content: '회원 관리', link: true },
    { key: 'Instructor', content: '구성원 관리', active: true },
    { key: 'SkProfile', content: '계정 병합 추천', active: true },
  ],

  // instructor
  instructorInternalDivision: [
    { key: '0', text: '전체', value: '*' },
    { key: '1', text: '사내', value: 'Yes' },
    { key: '2', text: '사외', value: 'No' },
  ],

  // 유저 그룹 분류
  userGroupCategory: [
    { key: 'Home', content: 'HOME', link: true },
    { key: 'Profile', content: '회원 관리', link: true },
    { key: 'UserGroup', content: '사용자 그룹 관리', link: true },
    { key: 'UserGroupCategory', content: '사용자 그룹 분류 관리', active: true },
  ],

  userGroup: [
    { key: 'Home', content: 'HOME', link: true },
    { key: 'Profile', content: '회원 관리', link: true },
    { key: 'UserGroup', content: '사용자 그룹 관리', link: true },
    { key: 'UserGroupCategory', content: '사용자 그룹 관리', active: true },
  ],

  bannerLinkType: [
    { key: 0, text: 'Select', value: '' },
    { key: 1, text: 'Self', value: '_self' },
    { key: 2, text: 'Blank', value: '_blank' },
    /*{ key: 3, text: 'Popup', value: 'popup' },*/
    { key: 4, text: '동영상', value: 'video' },
  ],

  // 선수코스 타입
  PrecedenceCourseType: [
    { key: '1', text: '필수', value: 'Mandatory' },
    { key: '2', text: '선택', value: 'Optional' },
  ],

  bannerState: [
    { key: 0, text: '임시저장', value: 'Created' },
    { key: 1, text: '바로적용', value: 'Opened' },
    { key: 2, text: '예약적용', value: 'Waiting' },
  ],

  bannerSearchState: [
    { key: '0', text: 'All', value: 'All' },
    { key: '1', text: '게시중', value: 'Opened' },
    { key: '2', text: '예약게시', value: 'Waiting' },
    { key: '3', text: '임시저장', value: 'Created' },
    { key: '4', text: '게시종료', value: 'Closed' },
  ],

  // badge
  badgeCertiAdminCategory: [
    { key: '1', value: 'mySUNI', text: 'mySUNI' },
    { key: '2', value: 'Subsidiary', text: '관계사' },
    { key: '3', value: 'Third', text: '3rd PP' },
  ],

  badgeCategory: [
    { key: '1', text: '분야1', value: 'category1' },
    { key: '2', text: '분야2', value: 'category2' },
    { key: '3', text: '분야3', value: 'category3' },
    { key: '4', text: '분야4', value: 'category4' },
  ],

  badgeSelected: [
    { key: '1', text: 'Yes', value: true },
    { key: '2', text: 'No', value: false },
  ],

  badgeType: [
    { key: '1', text: 'Knowledge', value: 'Knowledge' },
    { key: '2', text: 'Experience', value: 'Experience' },
    { key: '3', text: '융합', value: 'Convergence' },
  ],

  badgeDesignAdminType: [
    { key: '1', text: 'College', value: 'College' },
    { key: '2', text: '관계사', value: 'Subsidiary' },
  ],

  badgeDifficulty: [
    { key: '1', text: 'Level1', value: 'Level1' },
    { key: '2', text: 'Level2', value: 'Level2' },
    { key: '3', text: 'Level3', value: 'Level3' },
  ],

  badgeIssueType: [
    { key: '1', text: '자동', value: 'Yes' },
    { key: '2', text: '수동', value: 'No' },
  ],

  badgeAdditionTermsType: [
    { key: '1', text: 'Yes', value: 'Yes' },
    { key: '2', text: 'No', value: 'No' },
  ],

  badgeSearchableType: [
    { key: '1', text: 'Yes', value: 'Yes' },
    { key: '2', text: 'No', value: 'No' },
  ],

  badgeState: [
    { key: '1', text: '승인', value: 'Opened' },
    { key: '2', text: '승인대기', value: 'OpenApproval' },
    { key: '3', text: '반려', value: 'Rejected' },
    { key: '4', text: '임시저장', value: 'Created' },
  ],

  searchPartForBadge: [
    { key: '0', text: '전체', value: '전체' },
    { key: '1', text: 'Badge명', value: 'Badge명' },
    { key: '2', text: '생성자', value: '생성자' },
  ],

  searchPartForBadgeNotAll: [
    { key: '1', text: 'Badge명', value: 'Badge명' },
    { key: '2', text: '생성자', value: '생성자' },
  ],

  badgeStudentIssued: [
    { key: '0', text: '전체', value: '전체' },
    { key: '1', text: '획득완료', value: 'Issued' },
  ],

  badgeCanceled: [
    { key: '0', text: '전체', value: '전체' },
    { key: '1', text: '도전취소', value: 'challengeCanceled' },
  ],

  searchPartForBadgeApprover: [
    { key: '0', text: '전체', value: '전체' },
    { key: '1', text: '성명', value: '성명' },
    { key: '2', text: 'Email', value: 'Email' },
  ],

  // arrange
  arrangeSections: [
    { key: 'Home', content: 'HOME', link: true },
    { key: 'Display', content: '전시 관리', link: true },
    { key: 'DisplayState', content: 'Main 전시 관리', active: true },
    { key: 'DisplayArrangeProc', content: 'Main 과정 관리', active: true },
  ],

  cardBundleSections: [
    { key: 'Home', content: 'HOME', link: true },
    { key: 'Display', content: '전시 관리', link: true },
    { key: 'CardBundle', content: 'Card 묶음 편성', link: true },
    { key: 'CardBundleManagement', content: '카드 묶음 관리', active: true },
  ],

  cardBundleTypeSelects: [
    { key: 'Normal', value: 'Normal', text: '일반' },
    // { key: 'Recommended', value: CardBundleType.Recommended, text: '추천' },
    { key: 'New', value: 'New', text: '신규' },
    { key: 'Popular', value: 'Popular', text: '인기' },
    { key: 'HotTopic', value: 'HotTopic', text: 'Hot Topic' },
    { key: 'Mobile', value: 'Mobile', text: 'Mobile' },
  ],

  cardBundleOrderSections: [
    { key: 'Home', content: 'HOME', link: true },
    { key: 'Display', content: '전시 관리', link: true },
    { key: 'CardBundle', content: 'Card 묶음 편성', link: true },
    { key: 'CardBundleOrderManagement', content: '카드 묶음 순서 관리', active: true },
  ],

  arrangeOpenStateType: [
    { key: '0', value: 'All', text: '전체' },
    { key: '1', value: 'Opened', text: '게시중' },
    { key: '2', value: 'Reservation', text: '예약게시' },
    { key: '3', value: 'Created', text: '임시 저장' },
    { key: '4', value: 'Closed', text: '게시종료' },
  ],

  arrangeType: [
    { key: '0', text: '전체', value: '전체' },
    { key: '1', value: 'RQD', text: '권장 과정' },
    { key: '2', value: 'NEW', text: '신규 과정' },
    { key: '3', value: 'POP', text: '인기 과정' },
  ],

  searchPartFoArrange: [
    { key: '0', text: '전체', value: '전체' },
    { key: '1', text: '과정명', value: '과정명' },
    { key: '2', text: '생성자', value: '생성자' },
  ],

  dateOptions: [
    { key: '1', text: 'All', value: 'All' },
    { key: '2', text: '노출기간', value: 'dateOption01' },
    { key: '3', text: '최종 수정 일자', value: 'dateOption02' },
  ],

  dashBoardSentenceDateOptions: [
    { key: '1', text: '전체', value: 'all' },
    { key: '2', text: '노출기간', value: 'show' },
    { key: '3', text: '최종 수정 일자', value: 'update' },
  ],

  arrangeSelect: [
    { key: '1', value: 'RQD', text: '권장과정' },
    { key: '2', value: 'POP', text: '인기과정' },
    { key: '3', value: 'NEW', text: '신규과정' },
  ],

  arrangeNameShow: [
    /*{ key: '0', text: 'Select', value: '' },*/
    { key: '1', text: 'YES', value: 'Yes' },
    { key: '2', text: 'NO', value: 'No' },
  ],

  //커뮤니티 분야 관리
  pathForField: [
    { key: 'Home', content: 'HOME', link: true },
    { key: 'Community', content: 'Community 관리', link: true },
    { key: 'Field', content: '분야 관리 ', active: true },
  ],

  searchCommunityType: [
    { key: '0', text: '전체', value: '전체' },
    { key: '1', text: '일반형', value: 'OPEN' },
    { key: '2', text: '비밀형', value: 'SECRET' },
    { key: '3', text: '폐쇄형', value: 'COHORT' },
  ],

  searchCommunityOpend: [
    { key: '0', text: '전체', value: '전체' },
    { key: '1', text: '공개', value: '1' },
    { key: '2', text: '비공개', value: '0' },
  ],

  disclosureStatus: [
    { key: '0', text: '전체', value: '' },
    { key: '1', text: '공개', value: '1' },
    { key: '2', text: '비공개', value: '0' },
  ],

  searchWordForCommunity: [
    { key: '0', text: '전체', value: '전체' },
    { key: '1', text: '커뮤니티명', value: '커뮤니티명' },
    { key: '2', text: '생성자', value: '생성자' },
    { key: '3', text: '관리자', value: '관리자' },
  ],

  searchWordForCommunityNotAll: [
    { key: '1', text: '커뮤니티명', value: '커뮤니티명' },
    { key: '2', text: '생성자', value: '생성자' },
    { key: '3', text: '관리자', value: '관리자' },
  ],

  //커뮤니티 - 게시물 관리
  searchWordForPost: [
    { key: '0', text: '전체', value: '전체' },
    { key: '1', text: '제목', value: '제목' },
    { key: '2', text: '내용', value: '내용' },
    { key: '3', text: '작성자', value: '작성자' },
  ],

  //커뮤니티 - 멤버 관리 - 멤버,가입대기
  searchWordForMember: [
    { key: '0', text: '전체', value: '전체' },
    { key: '2', text: '소속사', value: '소속사' },
    { key: '3', text: '소속 조직(팀)', value: '소속조직' },
    { key: '4', text: '성명', value: '성명' },
    { key: '5', text: 'E-mail', value: 'Email' },
  ],

  designState: [
    { key: '1', text: '설문진행', value: 'Published' },
    { key: '2', text: '확정', value: 'Confirmed' },
    { key: '3', text: '임시저장', value: 'Draft' },
  ],

  searchDiscussion: [
    { key: '1', text: '전체', value: '전체' },
    { key: '2', text: '제목', value: '제목' },
    { key: '3', text: '등록자', value: '등록자' },
  ],

  searchSurvey: [
    { key: '1', text: '전체', value: '전체' },
    { key: '2', text: '제목', value: '제목' },
    { key: '3', text: '등록자', value: '등록자' },
  ],

  surveyAnswered: [
    { key: '0', text: '전체', value: '전체' },
    { key: '1', text: 'Yes', value: 'YES' },
    { key: '2', text: 'No', value: 'NO' },
  ],
  searchExam: [
    { key: '1', text: '전체', value: '*' },
    { key: '2', text: '제목', value: 'T' },
    { key: '3', text: '등록자', value: 'C' },
  ],

  contentsProviderSections: [
    { key: 'Home', content: 'HOME', link: true },
    { key: 'Service', content: '서비스 관리', link: true },
    { key: 'ContentsProvider', content: '교육기관 관리', link: true },
    { key: 'ContentsProvider-2', content: '교육기관 관리', active: true },
  ],

  //서비스관리 - 교육기관 관리 - 검색조건
  searchWordForContentsProvider: [
    { key: '0', text: '전체', value: '전체' },
    { key: '1', text: '등록자명', value: '등록자명' },
    { key: '2', text: '등록자 e-mail', value: '등록자 e-mail' },
    { key: '3', text: '교육기관명', value: '교육기관명' },
  ],
  //서비스관리 - 교육기관 관리 - 구분
  searchContentsProviderAreaType: [
    { key: '0', text: '전체', value: '전체' },
    { key: '1', text: '해외', value: 'External' },
    { key: '2', text: '국내', value: 'Internal' },
  ],
  //서비스관리 - 교육기관 관리 - 활성/비활성
  searchContentsProviderUse: [
    { key: '0', text: '전체', value: '전체' },
    { key: '1', text: '활성', value: '1' },
    { key: '2', text: '비활성', value: '0' },
  ],

  createApproveSearchDate: [
    { key: '1', text: '전체', value: 'All' },
    { key: '2', text: '등록일자', value: 'Create' },
    { key: '3', text: '승인일자', value: 'Approval' },
  ],

  conditionDateTypes: [
    { key: '1', text: '등록일자', value: ConditionDateType.CreationTime },
    { key: '2', text: '승인일자', value: ConditionDateType.OpenedTime },
  ],
  //사용여부
  useState: [
    { key: '0', text: '전체', value: '전체' },
    { key: '1', text: '사용', value: '1' },
    { key: '2', text: '사용중지', value: '0' },
  ],
  //회원관리 - 강사 관리
  instructorSections: [
    { key: 'Home', content: 'HOME', link: true },
    { key: 'Profile', content: '회원 관리', link: true },
    { key: 'instructor', content: '강사 관리', link: true },
    { key: 'instructor-2', content: '강사 관리', active: true },
  ],
  //회원관리 - 강사 관리 - 검색조건
  searchWordForInstructor: [
    { key: '0', text: '전체', value: '전체' },
    { key: '1', text: '성명', value: '성명' },
    { key: '2', text: '직위', value: '직위' },
    { key: '3', text: 'Email', value: 'Email' },
  ],
  //회원관리 - 강사 관리 - 강사 구분
  searchWordForInstructorInternal: [
    { key: '0', text: '전체', value: '' },
    { key: '1', text: '사내', value: 'Yes' },
    { key: '2', text: '사외', value: 'No' },
  ],
  //회원관리 - 강사 관리 - 활동 여부
  searchWordForResting: [
    { key: '0', text: '전체', value: '' },
    { key: '1', text: '활동', value: 'No' },
    { key: '2', text: '비활동', value: 'Yes' },
  ],
  searchWordForAccountExist: [
    { key: '1', text: 'O', value: true },
    { key: '2', text: 'X', value: false },
  ],
  //회원관리 - 강사 정보 - 강사 구분
  detailForInstructorInternal: [
    { key: '0', text: '사내', value: true },
    { key: '1', text: '사외', value: false },
  ],
  //회원관리 - 강사 정보 - 활동 여부
  detailForResting: [
    { key: '0', text: '활동', value: false },
    { key: '1', text: '비활동', value: true },
  ],

  //회원관리 - 사용자 그룹 관리 - 멤버 관리
  searchUserGroupMember: [
    { key: '1', text: '전체', value: '전체' },
    { key: '2', text: '성명', value: '성명' },
    { key: '3', text: 'Email', value: 'Email' },
  ],

  // 회원관리 - 멤버십 학습 통계
  statisticsSections: [
    { key: '1', content: 'HOME', link: true },
    { key: '2', content: '회원 관리', link: true },
    { key: '3', content: '통계', link: true },
    { key: '4', content: '멤버십 학습 통계', active: true },
  ],

  searchProfile: [
    { key: '1', text: '전체', value: '전체' },
    { key: '2', text: '성명', value: '성명' },
    { key: '3', text: 'Email', value: 'E-mail' },
  ],

  searchProfilTraining: [
    { key: '1', text: '전체', value: '전체' },
    { key: '2', text: '과정명', value: '과정명' },
  ],

  //회원관리 - 강사 정보 - 강의현황
  searchWordForLecture: [
    { key: '0', text: '전체', value: '전체' },
    { key: '1', text: '교육기관', value: '교육기관' },
    { key: '2', text: '과정명', value: '과정명' },
  ],
  //Transcript 관리
  TranscriptSections: [
    { key: 'Home', content: 'HOME', link: true },
    { key: 'Learning', content: 'Learning 관리', link: true },
    { key: 'Field', content: 'Transcript 관리 ', link: true },
    { key: 'Field-2', content: 'Transcript 관리 ', active: true },
  ],

  // 메일 발송 결과 관리
  ResultSendMail: [
    { key: 'Home', content: 'HOME', link: true },
    { key: 'Learning', content: 'Learning 관리', link: true },
    { key: 'Field', content: '발송 결과 메일 관리 ', active: true },
  ],

  searchPartForApproves: [
    { key: '0', text: '전체', value: 'All' },
    { key: '1', text: '신청자', value: 'applicant' },
    { key: '2', text: '조직', value: 'department' },
    { key: '3', text: '과정명', value: 'courseName' },
    { key: '4', text: 'email', value: 'email' },
  ],

  selectProposalState: [
    { key: '0', value: 'All', text: '전체' },
    { key: '1', value: 'Submitted', text: '승인요청' },
    { key: '2', value: 'Rejected', text: '반려' },
    { key: '3', value: 'Approved', text: '승인' },
    { key: '4', value: 'Canceled', text: '취소' },
  ],

  addPersonalLearningSection: [
    { key: 'Home', content: 'HOME', link: true },
    { key: 'Main', content: 'Learning 관리', link: true },
    { key: 'approval', content: '승인관리', link: true },
    { key: 'apl', content: '개인학습과정', active: true },
  ],

  aplOpenStateType: [
    { key: '1', text: 'Created', value: ' ' },
    { key: '1', text: '승인요청', value: 'OpenApproval' },
    { key: '2', text: '승인완료', value: 'Opened' },
    { key: '3', text: '반려', value: 'Rejected' },
  ],

  aplOptions: [
    { key: '0', text: '전체', value: '전체' },
    { key: '1', text: '생성자', value: '생성자' },
    { key: '2', text: '교육명', value: '교육명' },
  ],

  searchWordForCommunitySurveyList: [
    { key: '1', text: '전체', value: '전체' },
    { key: '2', text: '메뉴', value: '메뉴' },
    { key: '3', text: '설문설명', value: '설문설명' },
  ],

  searchWordForCommunitySurveyMemberList: [
    { key: '1', text: '전체', value: '전체' },
    { key: '2', text: '소속사', value: '소속사' },
    { key: '3', text: '소속조직(팀)', value: '소속조직(팀)' },
    { key: '4', text: '성명', value: '성명' },
    { key: '4', text: 'E-mail', value: 'E-mail' },
  ],

  pageElementManagement: [
    { key: 'Home', content: 'HOME', link: true },
    { key: 'Main', content: '전시관리', link: true },
    { key: 'Profile', content: '화면 관리', link: true },
    { key: 'Instructor', content: '화면요소 관리', active: true },
  ],
  pageElementPosition: [
    { key: '0', text: 'Select', value: '' },
    { key: '1', text: '상단 메뉴', value: PageElementPosition.TopMenu },
    { key: '2', text: 'Footer 메뉴', value: PageElementPosition.Footer },
    { key: '3', text: '홈 화면 요소', value: PageElementPosition.HomeElement },
    { key: '4', text: 'My Page 요소', value: PageElementPosition.MyPage },
  ],
  pageElementTopType: [
    { key: '1', text: 'Category', value: PageElementType.Category },
    { key: '2', text: 'Learning', value: PageElementType.Learning },
    { key: '3', text: 'Recommend', value: PageElementType.Recommend },
    { key: '4', text: 'Create', value: PageElementType.Create },
    { key: '5', text: 'Certification', value: PageElementType.Certification },
    { key: '6', text: 'Community', value: PageElementType.Community },
    { key: '7', text: 'MyPage', value: PageElementType.MyPage },
  ],
  pageElementFloatingType: [
    { key: '8', text: 'Introduction', value: PageElementType.Introduction },
    { key: '9', text: 'Support', value: PageElementType.Support },
    { key: '10', text: 'FavoriteChannels', value: PageElementType.FavoriteChannels },
    { key: '11', text: 'SiteMap', value: PageElementType.SiteMap },
    { key: '12', text: 'Approval', value: PageElementType.Approval },
    { key: '13', text: 'AplRegistration', value: PageElementType.AplRegistration },
  ],
  pageElementHomeType: [
    { key: '14', text: 'Summary', value: PageElementType.Summary },
    { key: '15', text: 'LearningCards', value: PageElementType.LearningCards },
    { key: '16', text: 'ChallengingBadges', value: PageElementType.ChallengingBadges },
    { key: '17', text: 'RecommendCards', value: PageElementType.RecommendCards },
  ],

  position: [
    { key: '1', text: '임원', value: 1 },
    { key: '2', text: '팀장', value: 4 },
    { key: '3', text: '사원', value: 5 },
  ],
  job: [
    { key: '1', text: '현장직', value: 8 },
    { key: '2', text: '사무직', value: 11 },
  ],
  nation: [
    { key: '1', text: '한국', value: 22 },
    { key: '2', text: '중국', value: 55 },
  ],

  tempOption: [{ key: '0', text: 'ALL', value: 'All' }],

  mailOptions: [
    { key: '0', text: '전체', value: '전체' },
    { key: '1', text: 'Cube 학습', value: 'Cube_learning' },
    { key: '2', text: 'Card 학습', value: 'Course_learning' },
    { key: '3', text: 'Cube 반려', value: 'Cube_reject' },
    { key: '4', text: 'Card 반려', value: 'Course_reject' },
    { key: '5', text: 'Badge 반려', value: 'Badge_reject' },
    { key: '6', text: 'Create 반려', value: 'Create_reject' },
    { key: '7', text: '일괄 전송', value: 'Batch_transfer' },
    { key: '8', text: '자동 독려', value: 'auto_encourage' },
  ],
  searchPartForResultMail: [
    { key: '0', text: '전체', value: '전체' },
    { key: '1', text: '타이틀', value: '타이틀' },
    { key: '2', text: '발신자', value: '발신자' },
    { key: '3', text: '발신자 이메일', value: '발신자 이메일' },
  ],
  dashBoardSentenceDetailShow: [
    { key: '0', text: 'NO', value: false },
    { key: '1', text: 'YES', value: true },
  ],

  skGroup: [
    { key: '0', text: '전체', value: 'All' },
    { key: '1', text: 'SK 그룹사', value: 'Yes' },
    { key: '2', text: 'SK 그룹사 아님', value: 'No' },
  ],

  userWorkspaceStateOptions: [
    { key: '1', text: '사용', value: UserWorkspaceState.Active },
    { key: '1', text: '사용 중지', value: UserWorkspaceState.Dormant },
  ],

  approverTypeOptions: [
    { key: '0', text: '팀 리더', value: LectureApproverType.TeamLeader },
    { key: '1', text: 'HR 담당자', value: LectureApproverType.HrManager },
  ],

  // exam Question CardType
  examQuestionTypeOptions: [
    { key: '0', text: '단일객관식', value: 'SingleChoice' },
    { key: '1', text: '다중객관식', value: 'MultiChoice' },
    { key: '2', text: '단답형', value: 'ShortAnswer' },
    { key: '3', text: '서술형', value: 'Essay' },
    { key: '4', text: '매칭형', value: 'MatchingChoice' },
  ],
  aplState: [
    { key: '0', text: '사용', value: 'Yes' },
    { key: '1', text: '미사용', value: 'No' },
  ],
  collegeState: [
    { key: '0', text: '전체', value: 'All' },
    { key: '1', text: '사용', value: 'Yes' },
    { key: '2', text: '미사용', value: 'No' },
  ],
  searchWards: [
    // { key: '0', text: '전체', value: '' },
    { key: '1', text: '성명', value: 'name' },
    { key: '2', text: '소속사', value: 'company' },
    { key: '3', text: '부서명', value: 'department' },
    { key: '4', text: 'Email', value: 'email' },
  ],

  // qna type
  // state
  qnaState: [
    { key: '0', text: '전체', value: 'All' },
    { key: '1', text: '문의접수', value: 'QuestionReceived' },
    { key: '2', text: '답변대기', value: 'AnswerWaiting' },
    { key: '3', text: '답변완료', value: 'AnswerCompleted' },
  ],

  // channel
  qnaChannel: [
    { key: '0', text: '전체', value: 'All' },
    { key: '1', text: 'mySUNI', value: 'QNA' },
    { key: '2', text: '전화', value: 'PHONE' },
    { key: '3', text: '이메일', value: 'EMAIL' },
    { key: '4', text: '메신저', value: 'MESSENGER' },
  ],

  qnaCreateChannel: [
    // { key: '0', text: 'mySUNI', value: 'QNA' },
    { key: '1', text: '전화', value: 'PHONE' },
    { key: '2', text: '이메일', value: 'EMAIL' },
    { key: '3', text: '메신저', value: 'MESSENGER' },
  ],

  // dataSearch Meta
  searchPartForMetaBadge: [
    { key: '0', text: '전체', value: '전체' },
    { key: '1', text: 'Badge명', value: 'Badge' },
    { key: '2', text: 'Card명', value: 'Card' },
  ],

  employedState: [
    { key: '0', text: '전체', value: 'All' },
    { key: '1', text: 'Y', value: 'true' },
    { key: '2', text: 'N', value: 'false' },
  ],
};
