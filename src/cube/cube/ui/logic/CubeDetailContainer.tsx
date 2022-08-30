import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { inject, observer } from 'mobx-react';
import { Container, Tab } from 'semantic-ui-react';
import XLSX from 'xlsx';
import moment from 'moment';

import { reactAutobind, ReactComponent } from '@nara.platform/accent';
import { patronInfo } from '@nara.platform/dock';

import { SharedService } from 'shared/present';
import { CubeType, PatronKey, SelectType } from 'shared/model';
import { PageTitle } from 'shared/components';
import { LoaderService } from 'shared/components/Loader';
import { getPolyglotToAnyString } from 'shared/components/Polyglot';
import { responseToNaOffsetElementList } from 'shared/helper';

import { ClassroomGroupService } from '../../../classroom';
import { LectureService } from '../../../../lecture';
import { AnswerSheetService, SurveyCaseService, SurveyFormService } from '../../../../survey';
import CubeService from '../../present/logic/CubeService';
import { CreateCubeContainer } from '../../index';
import { CommentListContainer } from '../../../../feedback/comment';
import DataTaskCubeListContainer from '../../../../dataSearch/taskCube/ui/logic/DataTaskCubeListContainer';
import SurveyInfoView from '../view/SurveyInfoView';
import CubeStudentInformationContainer from '../../../../lecture/student/ui/logic/CubeStudentInformationContainer';
import { MediaService } from '../../../media';
import { OfficeWebService } from '../../../officeweb';
import { InstructorService } from '../../../../instructor/instructor';
import { MemberService } from '../../../../approval';
import { OperatorModel } from '../../../../community/community/model/OperatorModel';
import CubeResultManagementWrap from '../../../../lecture/student/ui/logic/CubeResultManagementWrap';
import { CardService } from '../../../../card';
import CommunityStore from '../../../../community/community/mobx/CommunityStore';
import { findAllCohortCommunities } from '../../../../community/community/api/CommunityApi';
import { CommunityQueryModel } from '../../../../community/community/model/CommunityQueryModel';
import Community from '../../../../community/community/model/Community';
import { ExamService } from '../../../../exam';
import { BoardService, CubeDiscussionService } from 'cubetype';
import { MatrixQuestionItems } from '../../../../survey/form/model/MatrixQuestionItems';
import {
  setCategories,
  setCubeCommunity,
  setBoard,
  setCubeInstructors,
  setCubeOperator,
  findCardsByCubeId,
  setDetailByType,
  setAdditional,
  setSurveyForm,
} from './CubeHelper';

interface Props extends RouteComponentProps<Params> {}

interface Params {
  cineroomId: string;
  cubeId: string;
}

interface States {
  isUpdatable: boolean;
}

interface Injected {
  cubeService: CubeService;
  classroomGroupService: ClassroomGroupService;
  lectureService: LectureService;
  surveyFormService: SurveyFormService;
  surveyAnswerSheetService: AnswerSheetService;
  surveyCaseService: SurveyCaseService;
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
  'surveyCaseService',
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
  state: States = {
    isUpdatable: false,
  };

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
      setCategories(cubeService.cubeDetail.cube.categories);
      // Community
      setCubeCommunity(cubeService.cubeDetail.cubeMaterial.cubeCommunity.communityId);

      // 교육정보
      // Task 유형일 때 교육정보
      setBoard(cubeService.cubeDetail.cubeMaterial.board);
      // 강사정보
      setCubeInstructors(cubeService.cubeDetail.cubeContents.instructors);
      // 담당자 정보
      setCubeOperator(cubeService.cubeDetail.cubeContents.operator.keyString);

      // Mapping Card 정보
      findCardsByCubeId(cubeService.cubeDetail.cube.id);

      // 부가 정보
      setDetailByType();

      // 추가 정보
      setAdditional();
    }
  }
  //
  // async setDetailByType() {
  //   //
  //   const { cubeService, loaderService } = this.injected;
  //
  //   // 부가정보 - class rooms
  //   this.setCubeClassrooms(cubeService.cubeDetail.cubeMaterial.classrooms);
  //   // 부가정보 - media
  //   this.setCubeMedia(cubeService.cubeDetail.cubeMaterial.media);
  //   // 부가정보 - web
  //   this.setCubeOfficeWeb(cubeService.cubeDetail.cubeMaterial.officeWeb);
  //   // 부가정보 - Discussion
  //   await setCubeDiscussion(
  //     cubeService.cubeDetail.cubeMaterial.cubeDiscussion,
  //     cubeService.cubeDetail.cubeContents.commentFeedbackId
  //   );
  //
  //   loaderService.closeLoader(true, 'detail');
  // }

  // async setAdditional() {
  //   //
  //   const { cubeService, loaderService } = this.injected;
  //
  //   // 추가 정보 - 설문
  //   await this.setSurveyForm(cubeService.cubeDetail.cubeContents.surveyId, cubeService.cubeDetail.cube.surveyCaseId);
  //
  //   loaderService.closeLoader(true, 'additional');
  // }
  //
  async setSurveyInfo() {
    //
    const { cubeService, loaderService } = this.injected;

    // 추가 정보 - 설문
    await setSurveyForm(cubeService.cubeDetail.cubeContents.surveyId, cubeService.cubeDetail.cube.surveyCaseId);
  }

  // async setCommentFeedback(feedbackId: string) {
  //   const commentFeedback = await CommentApi.instance.findCommentFeedback(feedbackId);
  //
  //   return commentFeedback;
  // }

  // async setCubeDiscussion(cubeDiscussion: CubeDiscussionModel, feedbackId: string) {
  //   const { cubeDiscussionService } = this.injected;
  //   if (cubeDiscussion) {
  //     cubeDiscussionService.setMedia(cubeDiscussion);
  //
  //     const commentFeedback = await this.setCommentFeedback(feedbackId);
  //     if (commentFeedback) {
  //       cubeDiscussionService.changeCubeDiscussionProps('privateComment', commentFeedback.config.privateComment);
  //     }
  //   } else {
  //     cubeDiscussionService.clearCubeDiscussion();
  //   }
  // }

  // async setCubeCommunity(communityId: string): Promise<void> {
  //   //
  //   const communityStore = CommunityStore.instance;
  //   const { cubeService, loaderService } = this.injected;
  //
  //   if (communityId) {
  //     // await this.requestAllCommunities();
  //     // const community = communityStore.communityList.results.find((target) => target.communityId === communityId);
  //     await communityStore.findCommunityAdmin(communityId);
  //     const community = communityStore.community;
  //     if (community) {
  //       cubeService.setCubeCommunity(community);
  //     }
  //   }
  //
  //   loaderService.closeLoader(true, 'info');
  // }

  // async findCardsByCubeId(cubeId: string): Promise<void> {
  //   //
  //   const { cardService, loaderService } = this.injected;
  //   await cardService.findByCubeId(cubeId);
  //
  //   loaderService.closeLoader(true, 'cardMapping');
  // }

  // setCategories(categories: CardCategory[]): void {
  //   //
  //   const { cubeService } = this.injected;
  //   const mainCategory = categories.find((target) => target.mainCategory);
  //
  //   cubeService.setSubCategories(categories.filter((target) => !target.mainCategory));
  //   if (mainCategory) {
  //     cubeService.changeMainCategoryProps('collegeId', mainCategory.collegeId);
  //     cubeService.changeMainCategoryProps('channelId', mainCategory.channelId);
  //     cubeService.changeMainCategoryProps('mainCategory', true);
  //   }
  // }

  // async findClassroomGroups() {
  //   const { classroomGroupService, cubeService } = this.injected;
  //   await classroomGroupService.findClassroomGroup(cubeService.cubeDetail.cubeContents.id);
  // }
  //
  // setCubeClassrooms(cubeClassrooms: ClassroomModel[]) {
  //   const { classroomGroupService } = this.injected;
  //
  //   if (cubeClassrooms && cubeClassrooms.length !== 0) {
  //     classroomGroupService.setCubeClassrooms(
  //       cubeClassrooms.sort((current, next) => (current.round > next.round ? 1 : current.round < next.round ? -1 : 0))
  //     );
  //
  //     cubeClassrooms.forEach((classroom, index) => {
  //       this.setClassroomOperator(index, classroom.operation.operator.keyString);
  //     });
  //   } else {
  //     classroomGroupService.clearCubeClassrooms();
  //   }
  // }

  // setCubeMedia(media: MediaModel) {
  //   const { mediaService } = this.injected;
  //   if (media) {
  //     mediaService.setMedia(media);
  //   } else {
  //     mediaService.clearMedia();
  //   }
  // }

  // setCubeOfficeWeb(officeWeb: OfficeWebModel) {
  //   const { officeWebService } = this.injected;
  //   if (officeWeb) {
  //     officeWebService.setOfficeWeb(officeWeb);
  //   } else {
  //     officeWebService.clearOfficeWeb();
  //   }
  // }

  // async setCubeInstructors(instructors: Instructor[]) {
  //   const { cubeService, instructorService } = this.injected;
  //   if (instructors && instructors.length !== 0) {
  //     const cubeInstructors = await instructorService
  //       .findInstructorsByIds(instructors.map((instructor) => instructor.instructorId))
  //       .then((instructorWiths) =>
  //         instructorWiths.map((instructorWiths) =>
  //           CubeInstructorModel.asCubeInstructorByInstructorWiths(instructorWiths)
  //         )
  //       );
  //     cubeService.setCubeInstructors([]);
  //     instructors.forEach((instructor) => {
  //       const targetInstructor = cubeInstructors.find((target) => target.id === instructor.instructorId);
  //
  //       if (targetInstructor) {
  //         const targetInstructorModel = new CubeInstructorModel({
  //           ...targetInstructor,
  //           representative: instructor.representative,
  //           round: instructor.round,
  //           lectureTime: instructor.lectureTime,
  //           instructorLearningTime: instructor.instructorLearningTime,
  //         });
  //         cubeService.addCubeInstructors(targetInstructorModel);
  //       }
  //     });
  //   } else {
  //     cubeService.clearCubeInstructors();
  //   }
  // }

  // async setCubeOperator(id: string) {
  //   //
  //   const { memberService, cubeService, loaderService } = this.injected;
  //   if (id) {
  //     await memberService.findMemberById(id);
  //     cubeService.setCubeOperator(OperatorModel.fromMemberModel(memberService.member));
  //   }
  //
  //   loaderService.closeLoader(true, 'description');
  // }

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

  // async setSurveyForm(id: string, caseId: string) {
  //   const { surveyFormService, cubeService, surveyCaseService } = this.injected;
  //   if (id) {
  //     await surveyFormService.findSurveyForm(id);
  //     cubeService.changeCubeProps('cubeContents.surveyTitle', surveyFormService.surveyForm.title);
  //     cubeService.changeCubeProps('cubeContents.surveyDesignerName', surveyFormService.surveyForm.formDesignerName);
  //
  //     const surveyCommentId = await surveyCaseService.findSurveyCaseByFeedId(caseId);
  //
  //     await this.setState({ surveyCommentId });
  //   }
  // }

  // setBoard(board: BoardModel) {
  //   const { boardService } = this.injected;
  //   if (board) {
  //     boardService.setBoard(board);
  //   } else {
  //     boardService.clearBoard();
  //   }
  // }

  async requestAllCommunities() {
    const communityStore = CommunityStore.instance;
    const sharedService = SharedService.instance;

    //communityStore.clearCommunityQuery();
    const communityQueryModel = communityStore.selectedCommunityQuery;

    if (sharedService) {
      if (communityQueryModel.page) {
        communityStore.setCommunityQuery(
          communityStore.selectedCommunityQuery,
          'offset',
          (communityQueryModel.page - 1) * communityQueryModel.limit
        );
        communityStore.setCommunityQuery(
          communityStore.selectedCommunityQuery,
          'pageIndex',
          (communityQueryModel.page - 1) * communityQueryModel.limit
        );
        sharedService.setPage('community', communityQueryModel.page);
      } else {
        sharedService.setPageMap('community', 0, communityQueryModel.limit);
      }
    }
    await findAllCohortCommunities(CommunityQueryModel.asCommunityRdo(communityQueryModel)).then((response) => {
      const next = responseToNaOffsetElementList<Community>(response);
      next.limit = communityQueryModel.limit;
      next.offset = communityQueryModel.offset;
      sharedService.setCount('community', next.totalCount);
      communityStore.setCommunityList(next);
    });
  }

  async onDownLoadSurveyExcel(surveyFormId: string, surveyCaseId: string) {
    //
    const { cubeService, surveyFormService, surveyAnswerSheetService } = this.injected;
    await surveyFormService!.findSurveyForm(surveyFormId);
    await surveyAnswerSheetService!.findEvaluationSheetsBySurveyCaseIdForExcel(surveyCaseId);
    const { cube } = cubeService;
    const { surveyForm } = surveyFormService;
    const { evaluationSheetsForExcel } = surveyAnswerSheetService;
    const { questions } = surveyForm;

    const wbList: any[] = [];

    evaluationSheetsForExcel.forEach((evaluationSheet) => {
      const { answers } = evaluationSheet;
      const answerMap: Map<string, string> = new Map();

      answers &&
        answers.forEach((answer) => {
          let answerData = '';
          if (answer.answerItem.answerItemType === 'Boolean') {
            answerData = answer.answerItem.itemNumbers[0] === '0' ? 'No' : 'Yes';
          } else if (answer.answerItem.answerItemType === 'Date') {
            answerData = answer.answerItem.sentence;
          } else if (answer.answerItem.answerItemType === 'Matrix') {
            answer.answerItem.matrixItem &&
              answer.answerItem.matrixItem.forEach((matrixItem) => {
                answerMap.set(answer.questionNumber + '-' + matrixItem.rowNumber, matrixItem.columnSelectedNumber);
              });
          } else if (answer.answerItem.answerItemType === 'Review') {
            answerData =
              this.getChoiceFixedItemNumberText(answer.answerItem.itemNumbers[0]) +
              '-' +
              (answer.answerItem.sentence || '');
          } else if (answer.answerItem.answerItemType === 'ChoiceFixed') {
            answerData = this.getChoiceFixedItemNumberText(answer.answerItem.itemNumbers[0]);
          } else {
            answerData = answer.answer;
          }

          if (answer.answerItem.answerItemType !== 'Matrix') {
            answerMap.set(answer.questionNumber, answerData);
          }
        });

      const wb: any = {
        이메일: evaluationSheet.email,
        사번: evaluationSheet.employeeId,
        참여자: evaluationSheet.name,
        회사코드: evaluationSheet.companyCode,
        회사명: evaluationSheet.company,
        부서코드: evaluationSheet.departmentCode,
        부서명: evaluationSheet.department,
      };

      questions.forEach((question) => {
        const questionNumber = question.sequence.toSequenceString();

        if (question.questionItemType === 'Matrix') {
          const matrixQuestionItems = question.answerItems as MatrixQuestionItems;
          matrixQuestionItems.rowItems &&
            matrixQuestionItems.rowItems.forEach((m) => {
              matrixQuestionItems.columnItems &&
                matrixQuestionItems.columnItems.forEach((f) => {
                  if (f.number === answerMap.get(questionNumber + '-' + m.number)) {
                    return (wb[m.value] = f.value || '');
                  } else {
                    return null;
                  }
                });
            });
        } else {
          wb[question.sequence.number + '번 문항 ' + question.sentence] = answerMap.get(questionNumber) || '';
        }
      });
      wbList.push(wb);
    });
    // console.log(wbList);
    const surveyExcel = XLSX.utils.json_to_sheet(wbList);
    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, surveyExcel, '설문조사');

    const date = moment(new Date()).format('YYYY-MM-DD:HH:mm:ss');
    const fileName = `${getPolyglotToAnyString(cube.name)}(${surveyForm.title}).${date}.xlsx`;
    XLSX.writeFile(wb, fileName, { compression: true });
    return fileName;
  }

  getChoiceFixedItemNumberText(itemNumber: string) {
    switch (itemNumber) {
      case '1':
        return '전혀 아니다';
      case '2':
        return '아니다';
      case '3':
        return '보통이다';
      case '4':
        return '그렇다';
      case '5':
        return '매우 그렇다';
      default:
        return '';
    }
  }

  async onSelectClassroom(classroomId: string) {
    //
    const { classroomGroupService } = this.injected;
    await classroomGroupService.findClassroom(classroomId);
  }

  getPanes() {
    //
    const { cubeService, classroomGroupService, surveyFormService } = this.injected;

    const { cube, cubeDetail } = cubeService;
    const { classroom, classroomGroup } = classroomGroupService;

    const surveyId = cubeDetail.cubeContents.surveyId;
    const surveyCaseId = cubeDetail.cube.surveyCaseId;

    const feedbackId = cubeDetail.cubeContents.commentFeedbackId;

    const round = classroom.round;

    const { surveyForm, surveyCommentId } = surveyFormService;
    if (surveyCaseId !== '' && surveyForm.id === '') {
      // 없어지면 재조회
      this.setSurveyInfo();
    }

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

    if (cube.patronKey.keyString && PatronKey.getCineroomId(cube.patronKey) === patronInfo.getCineroomId()) {
      menuItem.push(
        {
          menuItem: '학습자',
          render: () => (
            <>
              <p className="tab-text">{getPolyglotToAnyString(cube.name)}</p>
              <Tab.Pane attached={false}>
                <CubeStudentInformationContainer />
              </Tab.Pane>
            </>
          ),
        },
        {
          menuItem: '결과관리',
          render: () => (
            <>
              <p className="tab-text">{getPolyglotToAnyString(cube.name)}</p>
              <Tab.Pane attached={false}>
                <CubeResultManagementWrap />
              </Tab.Pane>
            </>
          ),
        }
      );

      if (cube.type === CubeType.Task) {
        menuItem.push({
          menuItem: 'Posts',
          render: () => (
            <>
              <p className="tab-text">{getPolyglotToAnyString(cube.name)}</p>
              <Tab.Pane attached={false}>
                <DataTaskCubeListContainer cubeId={cube.id} />
              </Tab.Pane>
            </>
          ),
        });
      }

      menuItem.push(
        {
          menuItem: '댓글',
          render: () => (
            <>
              <p className="tab-text">{getPolyglotToAnyString(cube.name)}</p>
              <Tab.Pane attached={false}>
                <CommentListContainer feedbackId={feedbackId} />
              </Tab.Pane>
            </>
          ),
        },
        {
          menuItem: '설문',
          render: () => (
            <>
              <p className="tab-text">{getPolyglotToAnyString(cube.name)}</p>
              <Tab.Pane attached={false}>
                <SurveyInfoView
                  onDownLoadSurveyExcel={this.onDownLoadSurveyExcel}
                  onSelectClassroom={this.onSelectClassroom}
                  cube={cube}
                  classroomGroup={classroomGroup}
                  round={round || 1}
                  selectedClassroomId={classroom.id}
                  surveyId={surveyId}
                  surveyCaseId={surveyCaseId}
                  surveyForm={surveyForm}
                  feedbackId={surveyCommentId}
                />
              </Tab.Pane>
            </>
          ),
        }
      );
    }

    return menuItem;
  }

  render() {
    //
    return (
      <Container fluid>
        <PageTitle breadcrumb={SelectType.cubeSections}>Cube 관리</PageTitle>
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
