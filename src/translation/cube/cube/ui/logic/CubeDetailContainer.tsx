import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { RouteComponentProps, withRouter } from 'react-router';
import { Container, Tab } from 'semantic-ui-react';

import { reactAutobind, ReactComponent } from '@nara.platform/accent';

import { CardCategory, SelectType } from 'shared/model';
import { PageTitle } from 'shared/components';
import { LoaderService } from 'shared/components/Loader';

import { CreateCubeContainer } from '../../index';
import { LectureService } from 'lecture';
import { CardService } from 'card';
import { ExamService } from 'exam';
import { AnswerSheetService, SurveyFormService } from 'survey';
import { ClassroomModel, ClassroomGroupService } from 'cube/classroom';
import { Instructor } from 'cube/cube';
import { MediaService } from 'cube/media';
import { OfficeWebService } from 'cube/officeweb';
import CubeService from 'cube/cube/present/logic/CubeService';
import { MediaModel } from 'cube/media/model/MediaModel';
import { OfficeWebModel } from 'cube/officeweb/model/OfficeWebModel';
import { BoardModel } from 'cube/board/board/model/BoardModel';
import CubeInstructorModel from 'cube/cube/CubeInstructorModel';
import { BoardService, CubeDiscussionService } from 'cubetype';
import { CubeDiscussionModel } from 'cube/cubeDiscussion/model/CubeDiscussionModel';
import { InstructorService } from 'instructor/instructor';
import { MemberService } from 'approval';
import CommunityStore from 'community/community/mobx/CommunityStore';
import { OperatorModel } from 'community/community/model/OperatorModel';
import CommentApi from 'feedback/comment/present/apiclient/CommentApi';

interface Props extends RouteComponentProps<Params> {}

interface Params {
  cineroomId: string;
  cubeId: string;
}

interface States {}

interface Injected {
  cubeService: CubeService;
  classroomGroupService: ClassroomGroupService;
  lectureService: LectureService;
  surveyFormService: SurveyFormService;
  surveyAnswerSheetService: AnswerSheetService;
  mediaService: MediaService;
  officeWebService: OfficeWebService;
  instructorService: InstructorService;
  memberService: MemberService;
  cardService: CardService;
  examService: ExamService;
  cubeDiscussionService: CubeDiscussionService;
  boardService: BoardService;
  loaderService: LoaderService;
}

@inject(
  'cubeService',
  'classroomGroupService',
  'lectureService',
  'surveyFormService',
  'surveyAnswerSheetService',
  'mediaService',
  'officeWebService',
  'instructorService',
  'memberService',
  'cardService',
  'examService',
  'cubeDiscussionService',
  'boardService',
  'loaderService'
)
@observer
@reactAutobind
class CubeDetailContainer extends ReactComponent<Props, States, Injected> {
  //
  componentDidMount() {
    this.findCubeDetail();
  }

  componentWillUnmount() {
    this.initialClear();
  }

  initialClear() {
    const {
      cubeService,
      mediaService,
      officeWebService,
      classroomGroupService,
      cardService,
      surveyFormService,
      examService,
      cubeDiscussionService,
      boardService,
    } = this.injected;

    cubeService.clearCube();
    cubeService.clearCubeInstructors();
    cubeService.clearCubeOperator();
    cubeService.clearCubeCommunity();
    mediaService.clearMedia();
    officeWebService.clearOfficeWeb();
    cubeService.clearMainCategory();
    cubeService.setSubCategories([]);
    classroomGroupService.clearCubeClassrooms();
    cardService.clearCards();

    // 설문, Exam(Text) 초기화
    surveyFormService.clearSurveyFormProps();
    examService.clearExams();
    cubeDiscussionService.clearCubeDiscussion();
    boardService.clearBoard();
  }

  async findCubeDetail() {
    const { cubeService, loaderService } = this.injected;
    const { cubeId } = this.props.match.params;
    if (this.props.match.params.cubeId) {
      this.setState({ isUpdatable: false });

      loaderService.openLoader(true);

      await cubeService.findCubeDetail(cubeId);

      // 기본정보
      // 메인채널, 서브채널
      this.setCategories(cubeService.cubeDetail.cube.categories);
      // Community
      this.setCubeCommunity(cubeService.cubeDetail.cubeMaterial.cubeCommunity.communityId);

      // 교육정보
      // Task 유형일 때 교육정보
      this.setBoard(cubeService.cubeDetail.cubeMaterial.board);
      // 강사정보
      this.setCubeInstructors(cubeService.cubeDetail.cubeContents.instructors);
      // 담당자 정보
      this.setCubeOperator(cubeService.cubeDetail.cubeContents.operator.keyString);

      // Mapping Card 정보
      this.findCardsByCubeId(cubeService.cubeDetail.cube.id);

      // 부가 정보
      this.setDetailByType();

      // 추가 정보
      this.setAdditional();
    }
  }

  setDetailByType() {
    //
    const { cubeService, loaderService } = this.injected;

    // 부가정보 - class rooms
    this.setCubeClassrooms(cubeService.cubeDetail.cubeMaterial.classrooms);
    // 부가정보 - media
    this.setCubeMedia(cubeService.cubeDetail.cubeMaterial.media);
    // 부가정보 - web
    this.setCubeOfficeWeb(cubeService.cubeDetail.cubeMaterial.officeWeb);
    // 부가정보 - Discussion
    this.setCubeDiscussion(
      cubeService.cubeDetail.cubeMaterial.cubeDiscussion,
      cubeService.cubeDetail.cubeContents.commentFeedbackId
    );

    loaderService.closeLoader(true, 'detail');
  }

  async setAdditional() {
    //
    const { cubeService, loaderService } = this.injected;

    // 추가 정보 - 설문
    await this.setSurveyForm(cubeService.cubeDetail.cubeContents.surveyId);

    loaderService.closeLoader(true, 'additional');
  }

  async setCommentFeedback(feedbackId: string) {
    const commentFeedback = await CommentApi.instance.findCommentFeedback(feedbackId);

    return commentFeedback;
  }

  async setCubeDiscussion(cubeDiscussion: CubeDiscussionModel, feedbackId: string) {
    const { cubeDiscussionService } = this.injected;
    if (cubeDiscussion) {
      cubeDiscussionService.setMedia(cubeDiscussion);

      const commentFeedback = await this.setCommentFeedback(feedbackId);
      if (commentFeedback) {
        cubeDiscussionService.changeCubeDiscussionProps('privateComment', commentFeedback.config.privateComment);
      }
    } else {
      cubeDiscussionService.clearCubeDiscussion();
    }
  }

  async setCubeCommunity(communityId: string): Promise<void> {
    //
    const communityStore = CommunityStore.instance;
    const { cubeService, loaderService } = this.injected;

    if (communityId) {
      await communityStore.findCommunityAdmin(communityId);
      const community = communityStore.community;
      if (community) {
        cubeService.setCubeCommunity(community);
      }
    }

    loaderService.closeLoader(true, 'info');
  }

  async findCardsByCubeId(cubeId: string): Promise<void> {
    //
    const { cardService, loaderService } = this.injected;
    await cardService.findByCubeId(cubeId);

    loaderService.closeLoader(true, 'cardMapping');
  }

  setCategories(categories: CardCategory[]): void {
    //
    const { cubeService } = this.injected;
    const mainCategory = categories.find((target) => target.mainCategory);

    cubeService.setSubCategories(categories.filter((target) => !target.mainCategory));
    if (mainCategory) {
      cubeService.changeMainCategoryProps('collegeId', mainCategory.collegeId);
      cubeService.changeMainCategoryProps('channelId', mainCategory.channelId);
      cubeService.changeMainCategoryProps('mainCategory', true);
    }
  }

  async findClassroomGroups() {
    const { classroomGroupService, cubeService } = this.injected;
    await classroomGroupService.findClassroomGroup(cubeService.cubeDetail.cubeContents.id);
  }

  setCubeClassrooms(cubeClassrooms: ClassroomModel[]) {
    const { classroomGroupService } = this.injected;

    if (cubeClassrooms && cubeClassrooms.length !== 0) {
      classroomGroupService.setCubeClassrooms(
        cubeClassrooms.sort((current, next) => (current.round > next.round ? 1 : current.round < next.round ? -1 : 0))
      );

      cubeClassrooms.forEach((classroom, index) => {
        this.setClassroomOperator(index, classroom.operation.operator.keyString);
      });
    } else {
      classroomGroupService.clearCubeClassrooms();
    }
  }

  setCubeMedia(media: MediaModel) {
    const { mediaService } = this.injected;
    if (media) {
      mediaService.setMedia(media);
    } else {
      mediaService.clearMedia();
    }
  }

  setCubeOfficeWeb(officeWeb: OfficeWebModel) {
    const { officeWebService } = this.injected;
    if (officeWeb) {
      officeWebService.setOfficeWeb(officeWeb);
    } else {
      officeWebService.clearOfficeWeb();
    }
  }

  async setCubeInstructors(instructors: Instructor[]) {
    const { cubeService, instructorService } = this.injected;
    if (instructors && instructors.length !== 0) {
      const cubeInstructors = await instructorService
        .findInstructorsByIds(instructors.map((instructor) => instructor.instructorId))
        .then((instructorWiths) =>
          instructorWiths.map((instructorWiths) =>
            CubeInstructorModel.asCubeInstructorByInstructorWiths(instructorWiths)
          )
        );
      cubeService.setCubeInstructors([]);
      instructors.forEach((instructor) => {
        const targetInstructor = cubeInstructors.find((target) => target.id === instructor.instructorId);

        if (targetInstructor) {
          const targetInstructorModel = new CubeInstructorModel({
            ...targetInstructor,
            representative: instructor.representative,
            round: instructor.round,
            lectureTime: instructor.lectureTime,
            instructorLearningTime: instructor.instructorLearningTime,
          });
          cubeService.addCubeInstructors(targetInstructorModel);
        }
      });
    } else {
      cubeService.clearCubeInstructors();
    }
  }

  async setCubeOperator(id: string) {
    //
    const { memberService, cubeService, loaderService } = this.injected;
    if (id) {
      await memberService.findMemberById(id);
      cubeService.setCubeOperator(OperatorModel.fromMemberModel(memberService.member));
    }

    loaderService.closeLoader(true, 'description');
  }

  async setClassroomOperator(index: number, id: string) {
    const { memberService, classroomGroupService } = this.injected;
    if (id) {
      // FIXME: id null?
      await memberService.findMemberById(id);
      classroomGroupService.changeTargetCubeClassroomProps(
        index,
        'operation.operatorInfo',
        OperatorModel.fromMemberModel(memberService.member)
      );
    }
  }

  async setSurveyForm(id: string) {
    const { surveyFormService, cubeService } = this.injected;
    if (id) {
      await surveyFormService.findSurveyForm(id);
      cubeService.changeCubeProps('cubeContents.surveyTitle', surveyFormService.surveyForm.title);
      cubeService.changeCubeProps('cubeContents.surveyDesignerName', surveyFormService.surveyForm.formDesignerName);
    }
  }

  setBoard(board: BoardModel) {
    const { boardService } = this.injected;
    if (board) {
      boardService.setBoard(board);
    } else {
      boardService.clearBoard();
    }
  }

  getPanes() {
    const menuItem = [
      {
        menuItem: '학습정보',
        render: () => (
          <Tab.Pane attached={false}>
            <CreateCubeContainer findCubeDetail={this.findCubeDetail} />
          </Tab.Pane>
        ),
      },
    ];

    return menuItem;
  }

  render() {
    //
    return (
      <Container fluid>
        <PageTitle breadcrumb={SelectType.translationCubeSections}>Cube 관리</PageTitle>
        <Tab
          panes={this.getPanes()}
          menu={{ secondary: true, pointing: true }}
          className="styled-tab tab-wrap"
          onTabChange={() => this.injected.loaderService.closeLoader(true, 'ALL')}
        />
      </Container>
    );
  }
}

export default withRouter(CubeDetailContainer);
