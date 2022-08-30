/*eslint-disable*/
import React from 'react';
import { configure } from 'mobx';
import { Provider } from 'mobx-react';

import { SendSmsService, AccessRuleService, sharedService, SendEmailService } from 'shared/present';
import SearchBoxService from './shared/components/SearchBox/logic/SearchBoxService';
import SearchBoxExampleService from './shared/example/logic/SearchBoxExampleService';
import { UserGroupSelectService } from 'shared/components/UserGroupSelect';
import { LoaderService } from 'shared/components/Loader/present/logic/LoaderService';
import CrossEditorService from './shared/components/CrossEditor/present/logic/CrossEditorService';
import { PolyglotService } from './shared/components/Polyglot';
import TempSearchBoxService from './shared/components/TempSearchBox/logic/TempSearchBoxService';

import { ClassroomGroupService } from './cube/classroom';
import { ResultMailService } from './resultSendMail/index';
import { InstructorService } from './instructor/instructor';
import MediaService from './cube/media/present/logic/MediaService';
import { BoardService } from './cube/board/board';
import ExamService from './exam/present/logic/ExamService';
import OfficeWebService from './cube/officeweb/present/logic/OfficeWebService';
import { AnswerService, PostService, ChannelService } from './cube/board';
import { UserService, TrainingService } from './user';
import { CollegeAdminService, CollegeService, ContentsProviderService } from './college';
import {
  LectureService,
  RollBookService,
  CourseLectureService,
  ProgramLectureService,
  LinkedInTempProcService,
} from './lecture';
import { StudentService } from './student';
import {
  SurveyFormService,
  SurveyCaseService,
  SurveySummaryService,
  AnswerSheetService as SurveyAnswerSheetService,
} from './survey';
import { CommentService } from './feedback/comment';
import { MemberService } from './approval/index';
import { BannerService, BannerBundleService } from './banner/index';
import {
  BadgeService,
  BadgeStudentService,
  BadgeApprovalService,
  BadgeApproverService,
  BadgeArrangeService,
} from './certification/index';
import ApprovalCubeService from './approval/present/logic/ApprovalCubeService';
import MemberTempProcService from './community/member/mobx/MemberTempProcService';
import { CardBundleService } from './cardbundle/index';

import { TranscriptService, SubtitleService } from './transcript/index';

import { UserGroupCategoryService, UserGroupService } from './usergroup';

import { AplService } from './apl';
import CommunityStore from 'community/community/mobx/CommunityStore';
import { ElementManagementService } from './pageelement';
import { BadgeCategoryService } from './certification/badge/category';
import { CardService } from 'card';
import { CubeService } from 'cube';
import { CubeStudentService, UserCubeService } from './cube/cube';
import { DiscussionService } from './discussion';
import CubeDiscussionService from './cube/cubeDiscussion/present/logic/CubeDiscussionService';
import { UserWorkspaceService } from './userworkspace';
import DataCommunityService from './dataSearch/CommunityMember/present/logic/DataCommunityService';
import DataBadgeService from './dataSearch/badgeCompany/present/logic/DataBadgeService';
import DataFavoritesService from './dataSearch/Favorites/present/logic/DataFavoritesService';
import DataChannelService from './dataSearch/Channel/present/logic/DataChannelService';
import DataSelectCallService from './dataSearch/selectCall/present/logic/DataSelectCallService';
import DataLearningCubeService from './dataSearch/learningCube/present/logic/DataLearningCubeService';
import { MembershipStatisticsService } from './statistics';
import ProfileInvitationService from './user/present/logic/ProfileInvitationService';
import MainPagePopupService from './popup/MainPagePopup/present/logic/MainPagePopupService';
import InstructorInvitationService from './instructor/instructor/present/logic/InstructorInvitationService';
import DataCardMappingListService from './dataSearch/cardMappingList/present/logic/DataCardMappingListService';
import DataMetaCardService from './dataSearch/metaCard/present/logic/DataMetaCardService';
import DataCardInstructorService from './dataSearch/cardInstructor/present/logic/DataCardInstructorService';
import DataCardPermittedService from './dataSearch/cardPermitted/present/logic/DataCardPermittedService';
import DataCardPrerequisiteService from './dataSearch/cardPrerequisite/present/logic/DataCardPrerequisiteService';
import DataMetaCubeService from './dataSearch/metaCube/present/logic/DataMetaCubeService';
import DataMetaBadgeService from 'dataSearch/metaBadge/present/logic/DataMetaBadgeService';
import DataCubeClassroomService from './dataSearch/cubeClassroom/present/logic/DataCubeClassroomService';
import dataCubeInstructorService from './dataSearch/cubeInstructor/present/logic/DataCubeInstructorService';
import DataTaskCubeService from './dataSearch/taskCube/present/logic/DataTaskCubeService';

import CategoryService from './support/category/present/logic/CategoryService';
import { QnaService } from './support/qna';
import { default as CreateCategoryService } from './support/category/present/logic/CategoryService';
import OperatorService from './support/operator/present/logic/OperatorService';

configure({
  enforceActions: 'observed',
});

function Store({ children }: any) {
  return (
    <Provider
      sharedService={sharedService}
      accessRuleService={AccessRuleService.instance}
      sendEmailService={SendEmailService.instance}
      sendSmsService={SendSmsService.instance}
      resultMailService={ResultMailService.instance}
      cubeService={CubeService.instance}
      userCubeService={UserCubeService.instance}
      bannerService={BannerService.instance}
      bannerBundleService={BannerBundleService.instance}
      classroomGroupService={ClassroomGroupService.instance}
      instructorService={InstructorService.instance}
      examService={ExamService.instance}
      mediaService={MediaService.instance}
      boardService={BoardService.instance}
      channelService={ChannelService.instance}
      officeWebService={OfficeWebService.instance}
      collegeService={CollegeService.instance}
      contentsProviderService={ContentsProviderService.instance}
      surveyFormService={SurveyFormService.instance}
      surveyCaseService={SurveyCaseService.instance}
      surveySummaryService={SurveySummaryService.instance}
      surveyAnswerSheetService={SurveyAnswerSheetService.instance}
      studentService={StudentService.instance}
      courseLectureService={CourseLectureService.instance}
      programLectureService={ProgramLectureService.instance}
      lectureService={LectureService.instance}
      rollBookService={RollBookService.instance}
      linkedInTempProcService={LinkedInTempProcService.instance}
      commentService={CommentService.instance}
      postService={PostService.instance}
      categoryService={CategoryService.instance}
      answerService={AnswerService.instance}
      discussionService={DiscussionService.instance}
      userService={UserService.instance}
      trainingService={TrainingService.instance}
      badgeService={BadgeService.instance}
      badgeStudentService={BadgeStudentService.instance}
      badgeApproverService={BadgeApproverService.instance}
      badgeApprovalService={BadgeApprovalService.instance}
      badgeArrangeService={BadgeArrangeService.instance}
      badgeCategoryService={BadgeCategoryService.instance}
      transcriptService={TranscriptService.instance}
      subtitleService={SubtitleService.instance}
      memberTempProcService={MemberTempProcService.instance}
      approvalCubeService={ApprovalCubeService.instance}
      aplService={AplService.instance}
      communityStore={CommunityStore.instance}
      userGroupCategoryService={UserGroupCategoryService.instance}
      userGroupService={UserGroupService.instance}
      elementManagementService={ElementManagementService.instance}
      cardBundleService={CardBundleService.instance}
      searchBoxService={SearchBoxService.instance}
      searchBoxExampleService={SearchBoxExampleService.instance}
      cardService={CardService.instance}
      cubeStudentService={CubeStudentService.instance}
      memberService={MemberService.instance}
      cubeDiscussionService={CubeDiscussionService.instance}
      userWorkspaceService={UserWorkspaceService.instance}
      dataService={DataBadgeService.instance}
      dataFavoritesService={DataFavoritesService.instance}
      dataCommunityService={DataCommunityService.instance}
      dataSelectCallService={DataSelectCallService.instance}
      dataChannelService={DataChannelService.instance}
      dataLearningCubeService={DataLearningCubeService.instance}
      dataCardMappingListService={DataCardMappingListService.instance}
      dataMetaCardService={DataMetaCardService.instance}
      dataCardInstructorService={DataCardInstructorService.instance}
      dataCardPermittedService={DataCardPermittedService.instance}
      dataCardPrerequisiteService={DataCardPrerequisiteService.instance}
      dataMetaCubeService={DataMetaCubeService.instance}
      dataCubeClassroomService={DataCubeClassroomService.instance}
      dataCubeInstructorService={dataCubeInstructorService.instance}
      dataMetaBadgeService={DataMetaBadgeService.instance}
      dataTaskCubeService={DataTaskCubeService.instance}
      collegeAdminService={CollegeAdminService.instance}
      membershipStatisticsService={MembershipStatisticsService.instance}
      profileInvitationService={ProfileInvitationService.instance}
      instructorInvitationService={InstructorInvitationService.instance}
      mainPagePopupService={MainPagePopupService.instance}
      userGroupSelectService={UserGroupSelectService.instance}
      loaderService={LoaderService.instance}
      qnaService={QnaService.instance}
      createCategoryService={CreateCategoryService.instance}
      operatorService={OperatorService.instance}
      crossEditorService={CrossEditorService.instance}
      polyglotService={PolyglotService.instance}
      tempSearchBoxService={TempSearchBoxService.instance}
    >
      {children}
    </Provider>
  );
}

export default Store;
