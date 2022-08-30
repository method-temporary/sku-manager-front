import React from 'react';
import { observer, inject } from 'mobx-react';
import { RouteComponentProps } from 'react-router-dom';
import { Button, Container, Form, Icon, Tab } from 'semantic-ui-react';
import moment from 'moment';
import XLSX from 'xlsx';

import { reactAutobind, ReactComponent } from '@nara.platform/accent';

import { PageTitle, SubActions, alert, AlertModel, confirm, ConfirmModel } from 'shared/components';

import { SharedService, AccessRuleService } from 'shared/present';

import { LoaderService } from 'shared/components/Loader';
import { getPolyglotToAnyString } from 'shared/components/Polyglot';

import { ReviewPage } from 'feedback/review/ui/page/ReviewPage';

import { CardStates } from '../../../../_data/lecture/cards/model/vo';
import { CardService } from '../../index';
import { ExamService } from '../../../../exam';
import { UserGroupService } from '../../../../usergroup';
import { CommentListContainer } from '../../../../feedback/comment';
import { CollegeService } from '../../../../college';
import {
  AnswerSheetService,
  SurveyCaseService,
  SurveyFormService,
  SurveyFormSummary,
  SurveyManagementContainer,
} from '../../../../survey';
import { ServiceType } from '../../../../student';

import { learningManagementUrl } from '../../../../Routes';
import { findGroupBasedAccessRules } from './CardHelper';
import {
  getApprovalInfo,
  setCommunity,
  setCubeInfoAndTerm,
  setDiscussionInfo,
  setInstructorInfo,
  setPrerequisiteCards,
  setRelatedCards,
  setSurvey,
} from './CardLoadQueryModelHelper';
import { AutoEncourage } from 'card/autoEncourage/AutoEncourage';

import { MemberService } from '../../../../approval';
import { CubeService } from '../../../../cube';
import { InstructorService } from '../../../../instructor/instructor';
import { DiscussionService } from '../../../../discussion';
import { MatrixQuestionItems } from '../../../../survey/form/model/MatrixQuestionItems';

import { TestSheetModalContainer } from 'exam/ui/logic/TestSheetModalContainer';
import { UserWorkspaceService } from '../../../../userworkspace';
import { QuestionItemType } from 'survey/form/model/QuestionItemType';
import { CardStudentPage } from '../../../student/cardStudent/CardStudentPage';
import { CardStudentResultPage } from '../../../student/cardStudentResult/CardStudentResultPage';
import { cardBreadcrumb } from '../../../shared/utiles';

interface Params {
  cineroomId: string;
  cardId: string;
}

interface Props extends RouteComponentProps<Params> {}

interface State {
  isUpdatable: boolean;
  activeIndex: number;
  approvalInfo: string;
  surveyCommentId: string;
}

interface Injected {
  cardService: CardService;
  collegeService: CollegeService;
  surveyFormService: SurveyFormService;
  accessRuleService: AccessRuleService;
  userGroupService: UserGroupService;
  examService: ExamService;
  memberService: MemberService;
  cubeService: CubeService;
  instructorService: InstructorService;
  surveyCaseService: SurveyCaseService;
  discussionService: DiscussionService;
  surveyAnswerSheetService: AnswerSheetService;
  sharedService: SharedService;
  loaderService: LoaderService;
  userWorkspaceService: UserWorkspaceService;
}

@inject(
  'cardService',
  'collegeService',
  'surveyFormService',
  'surveyCaseService',
  'examService',
  'accessRuleService',
  'userGroupService',
  'memberService',
  'cubeService',
  'instructorService',
  'discussionService',
  'surveyAnswerSheetService',
  'sharedService',
  'loaderService',
  'userWorkspaceService'
)
@observer
@reactAutobind
class CardDetailContainer extends ReactComponent<Props, State, Injected> {
  //
  state: State = {
    isUpdatable: false,
    activeIndex: 0,
    approvalInfo: '',
    surveyCommentId: '',
  };

  constructor(props: Props) {
    super(props);

    const { cardId } = this.props.match.params;

    if (cardId) {
      // this.findCard(cardId);
    } else {
      // this.routeToCardList();
    }
  }

  async findCard(cardId: string) {
    //
    const { cardService, surveyCaseService, loaderService } = this.injected;

    loaderService.openLoader(true);
    await cardService.findCardById(cardId);
    loaderService.closeLoader(true, 'info');

    const surveyCommentId = cardService.cardContentsQuery.surveyCaseId
      ? await surveyCaseService.findSurveyCaseByFeedId(cardService.cardContentsQuery.surveyCaseId)
      : '';

    await this.setState({ surveyCommentId });
    await this.setCardData();
  }

  async setCardData() {
    //
    const { cardService, accessRuleService, userGroupService, memberService } = this.injected;

    const { approvalInfo } = await getApprovalInfo(cardService, memberService);
    await this.setState({ approvalInfo });

    // 노출 정보 - Community
    await setCommunity(cardService);

    // Chapter / Cube / Talk List 정보
    this.setLearningContentsInfo();

    // 접근제어
    findGroupBasedAccessRules(cardService.cardQuery, accessRuleService, userGroupService);

    // 선수카드
    setPrerequisiteCards(cardService);

    // 부가정보
    this.setContentsInfo();

    // 추가정보
    this.setAdditionalInfo();
  }

  onClickDeleteCard(cardId: string) {
    //
    const { cardService } = this.injected;

    confirm(
      ConfirmModel.getRemoveConfirm(() => {
        cardService.removeCard(cardId);
        alert(AlertModel.getRemoveSuccessAlert(this.routeToCardList));
      }),
      false
    );
  }

  async setLearningContentsInfo() {
    //
    const { cardService, cubeService, collegeService, discussionService, loaderService } = this.injected;

    const { collegesMap, channelMap } = collegeService;

    await setCubeInfoAndTerm(cardService, cubeService, collegesMap, channelMap);
    await setDiscussionInfo(cardService, discussionService);

    loaderService.closeLoader(true, 'learning');
  }

  async setContentsInfo() {
    //
    const { cardService, instructorService, loaderService } = this.injected;

    // 부가정보 - 강사 정보
    await setInstructorInfo(cardService, instructorService);
    // 부가정보 - 관련 과정
    await setRelatedCards(cardService);

    loaderService.closeLoader(true, 'contents');
  }

  async setAdditionalInfo() {
    //
    const { cardService, surveyFormService, loaderService } = this.injected;

    // 추가정보 - 설문
    await setSurvey(cardService, surveyFormService);

    loaderService.closeLoader(true, 'additional');
  }

  async setSurveyInfo() {
    //
    const { cardService, surveyFormService, loaderService } = this.injected;

    // 추가정보 - 설문
    await setSurvey(cardService, surveyFormService);
  }

  onClickApprovalCard(cardId: string) {
    //
    const { cardService } = this.injected;

    confirm(
      ConfirmModel.getOpenApprovalConfirm(() => {
        cardService.approvalCard(cardId);
        alert(
          AlertModel.getOpenApprovalSuccessAlert(() => {
            this.findCard(cardId);
          })
        );
      }, 'Card'),
      false
    );
  }

  async onDownLoadSurveyExcel(surveyId: string, surveyCaseId: string) {
    //
    const { surveyFormService, surveyAnswerSheetService } = this.injected;
    const { cardQuery } = this.injected.cardService;

    await surveyFormService.findSurveyForm(surveyId);
    await surveyAnswerSheetService.findEvaluationSheetsBySurveyCaseIdForExcel(surveyCaseId);

    const { surveyForm } = surveyFormService;
    const { evaluationSheetsForExcel } = surveyAnswerSheetService!;
    const { questions } = surveyForm;

    const wbList: any[] = [];

    evaluationSheetsForExcel &&
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
              answer.answerItem &&
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

        questions &&
          questions.forEach((question) => {
            const questionNumber = question.sequence.toSequenceString();

            if (question.questionItemType === 'Matrix') {
              const matrixQuestionItems = question.answerItems as MatrixQuestionItems;
              matrixQuestionItems.rowItems &&
                matrixQuestionItems.rowItems.forEach((m, i) => {
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

    const surveyExcel = XLSX.utils.json_to_sheet(wbList);
    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, surveyExcel, '설문조사');

    const date = moment(new Date()).format('YYYY-MM-DD:HH:mm:ss');
    const fileName = `${getPolyglotToAnyString(cardQuery.name)}(${surveyForm.title}).${date}.xlsx`;
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

  routeToCardList() {
    //
    this.props.history.push(`/cineroom/${this.props.match.params.cineroomId}/${learningManagementUrl}/cards/card-list`);
  }

  routeToCardCreate(cardId: string) {
    //
    this.props.history.push(
      `/cineroom/${this.props.match.params.cineroomId}/${learningManagementUrl}/cards/card-modify/${cardId}`
    );
  }

  onTabChange(e: any, data: any) {
    //
    this.setState({ activeIndex: data.activeIndex });
    this.injected.loaderService.closeLoader(true, 'ALL');
  }

  getOpenedPanes() {
    //
    const { isUpdatable } = this.state;
    const { cineroomId, cardId } = this.props.match.params;
    const {
      cardService,
      collegeService,
      // stationService,
      surveyFormService,
      examService,
      memberService,
      accessRuleService,
      sharedService,
      userWorkspaceService,
    } = this.injected;
    const { cardQuery, cardContentsQuery, changeCardContentsQueryProps } = cardService;

    const { collegesMap, channelMap } = collegeService;

    const userWorkspaces =
      cineroomId === 'ne1-m2-c2'
        ? userWorkspaceService.allUserWorkspaces
        : userWorkspaceService.userWorkspacesByUserWorkspaceId(cineroomId);
    const userWorkspaceMap = userWorkspaceService.userWorkspaceMap;

    const surveyId = cardContentsQuery.surveyId;
    const surveyCaseId = cardContentsQuery.surveyCaseId;

    const menuItems: { menuItem: string; render: () => JSX.Element }[] = [];

    const { surveyForm } = surveyFormService!;
    if (surveyCaseId !== '' && surveyForm.id === '') {
      // 없어지면 재조회
      changeCardContentsQueryProps('surveyTitle', '');
      this.setSurveyInfo();
    }

    menuItems.push({
      menuItem: 'Card 정보',
      render: () => (
        // <Tab.Pane attached={false}>
        //   <Polyglot languages={cardService.cardQuery.langSupports}>
        //     <Form>
        //       {/*기본 정보*/}
        //       <Loader name="info">
        //         <CardBasicInfoContainer
        //           isUpdatable={isUpdatable}
        //           approvalInfo={this.state.approvalInfo}
        //           cardService={cardService}
        //           memberService={memberService}
        //           collegeService={collegeService}
        //         />
        //       </Loader>
        //
        //       {/*노출 정보*/}
        //       <Loader name="exposure">
        //         <CardExposureInfoContainer
        //           isUpdatable={isUpdatable}
        //           cineroomId={cineroomId}
        //           cardService={cardService}
        //           sharedService={sharedService}
        //           userWorkspaces={userWorkspaces}
        //           userWorkspaceMap={userWorkspaceMap}
        //         />
        //       </Loader>
        //
        //       {/*접근 제어*/}
        //       <Loader name="accessRule">
        //         <AccessRuleSettings readOnly={!isUpdatable} multiple={false} form={false} />
        //       </Loader>
        //
        //       {/*Cube List 정보*/}
        //       <Loader name="learning">
        //         <CardLearningInfoListContainer
        //           isUpdatable={isUpdatable}
        //           cineroomId={cineroomId}
        //           cardService={cardService}
        //           collegesMap={collegesMap}
        //           channelMap={channelMap}
        //         />
        //       </Loader>
        //
        //       {/*선수 Card 정보*/}
        //       {(cardContentsQuery.hasPrerequisite === 'Yes' || cardContentsQuery.prerequisiteCards.length > 0) && (
        //         <Loader name="prerequisite">
        //           <CardPrerequisiteCardContainer
        //             isUpdatable={isUpdatable}
        //             cardService={cardService}
        //             collegesMap={collegesMap}
        //             channelMap={channelMap}
        //             groupBasedAccessRule={accessRuleService.groupBasedAccessRule}
        //           />
        //         </Loader>
        //       )}
        //
        //       {/*부가 정보*/}
        //       <Loader name="contents">
        //         <CardContentsInfoContainer
        //           isUpdatable={isUpdatable}
        //           cardService={cardService}
        //           collegesMap={collegesMap}
        //           channelMap={channelMap}
        //         />
        //       </Loader>
        //
        //       {/*추가 정보*/}
        //       <Loader name="additional">
        //         <CardAdditionalInfoContainer
        //           isUpdatable={isUpdatable}
        //           cardService={cardService}
        //           examService={examService}
        //           surveyFormService={surveyFormService}
        //         />
        //       </Loader>
        //     </Form>
        //   </Polyglot>
        // </Tab.Pane>
        <></>
      ),
    });

    // if (cardQuery.cardState === CardStates.Opened && cardQuery.patronKey.keyString.endsWith(cineroomId)) {
    menuItems.push({
      menuItem: '학습자',
      render: () => (
        <>
          <p className="tab-text">{getPolyglotToAnyString(cardQuery.name)}</p>
          <Tab.Pane attached={false}>
            {/*<CardStudentInformationContainer*/}
            {/*  cardId={cardId}*/}
            {/*  cardQuery={cardQuery}*/}
            {/*  cardContentsQuery={cardContentsQuery}*/}
            {/*/>*/}
            <CardStudentPage />
          </Tab.Pane>
        </>
      ),
    });

    menuItems.push({
      menuItem: '결과관리',
      render: () => (
        <>
          <p className="tab-text">{getPolyglotToAnyString(cardQuery.name)}</p>
          <Tab.Pane attached={false}>
            <CardStudentResultPage />
            {/*<CardResultFunctionComponent*/}
            {/*  cardId={cardId}*/}
            {/*  surveyFormId={surveyId}*/}
            {/*  surveyCaseId={surveyCaseId}*/}
            {/*  cardQuery={cardQuery}*/}
            {/*  cardContentsQuery={cardContentsQuery}*/}
            {/*/>*/}
            {/*<CardResultManagementContainer*/}
            {/*  cardId={cardId}*/}
            {/*  cardQuery={cardQuery}*/}
            {/*  cardContentsQuery={cardContentsQuery}*/}
            {/*  surveyFormId={surveyId}*/}
            {/*  surveyCaseId={surveyCaseId}*/}
            {/*  */}
            {/*/>*/}
          </Tab.Pane>
        </>
      ),
    });

    menuItems.push({
      menuItem: '댓글',
      render: () => {
        const { cardService } = this.injected;
        const { cardQuery, cardContentsQuery } = cardService;
        const cmtId = cardContentsQuery.commentFeedbackId;

        return (
          <>
            <p className="tab-text">{getPolyglotToAnyString(cardQuery.name)}</p>
            <Tab.Pane attached={false}>
              <CommentListContainer feedbackId={cmtId} />
            </Tab.Pane>
          </>
        );
      },
    });

    menuItems.push({
      menuItem: '설문',
      render: () => {
        const { cardService, surveyFormService } = this.injected;
        const { cardContentsQuery, cardQuery } = cardService!;
        const { surveyForm } = surveyFormService!;

        if (!cardContentsQuery.surveyId || !cardContentsQuery.surveyCaseId) {
          return (
            <>
              <p className="tab-text">{getPolyglotToAnyString(cardQuery.name)}</p>
              <Tab.Pane>
                <div className="center">
                  <div className="no-cont-wrap no-contents-icon">
                    <Icon className="no-contents80" />
                    <div className="sr-only">콘텐츠 없음</div>
                    <div className="text">설문이 없습니다.</div>
                  </div>
                </div>
              </Tab.Pane>
            </>
          );
        }
        return (
          <>
            <p className="tab-text">{getPolyglotToAnyString(cardQuery.name)}</p>
            <br />
            <SubActions.ExcelButton
              download
              onClick={async () =>
                this.onDownLoadSurveyExcel(cardContentsQuery.surveyId, cardContentsQuery.surveyCaseId)
              }
            />
            <Tab.Pane attached={false}>
              {surveyForm.questions.some((question) => question.questionItemType === QuestionItemType.Review) ? (
                <Tab
                  panes={[
                    {
                      menuItem: '통계',
                      render: () => (
                        <Tab.Pane>
                          <SurveyFormSummary
                            surveyFormId={cardContentsQuery.surveyId}
                            surveyCaseId={cardContentsQuery.surveyCaseId}
                            round={1}
                          />
                        </Tab.Pane>
                      ),
                    },
                    {
                      menuItem: '상세',
                      render: () => (
                        <Tab.Pane>
                          <SurveyManagementContainer
                            id={this.props.match.params.cardId}
                            surveyFormId={cardContentsQuery.surveyId}
                            surveyCaseId={cardContentsQuery.surveyCaseId}
                            serviceType={ServiceType.Card}
                          />
                        </Tab.Pane>
                      ),
                    },
                    {
                      menuItem: '댓글',
                      render: () => (
                        <>
                          <Tab.Pane attached={false}>
                            <CommentListContainer feedbackId={this.state.surveyCommentId} />
                          </Tab.Pane>
                        </>
                      ),
                    },
                    {
                      menuItem: 'Review',
                      render: () => (
                        <>
                          <Tab.Pane attached={false}>
                            <ReviewPage surveyCaseId={cardContentsQuery.surveyCaseId} />
                          </Tab.Pane>
                        </>
                      ),
                    },
                  ]}
                />
              ) : (
                <Tab
                  panes={[
                    {
                      menuItem: '통계',
                      render: () => (
                        <Tab.Pane>
                          <SurveyFormSummary
                            surveyFormId={cardContentsQuery.surveyId}
                            surveyCaseId={cardContentsQuery.surveyCaseId}
                            round={1}
                          />
                        </Tab.Pane>
                      ),
                    },
                    {
                      menuItem: '상세',
                      render: () => (
                        <Tab.Pane>
                          <SurveyManagementContainer
                            id={this.props.match.params.cardId}
                            surveyFormId={cardContentsQuery.surveyId}
                            surveyCaseId={cardContentsQuery.surveyCaseId}
                            serviceType={ServiceType.Card}
                          />
                        </Tab.Pane>
                      ),
                    },
                    {
                      menuItem: '댓글',
                      render: () => (
                        <>
                          <Tab.Pane attached={false}>
                            <CommentListContainer feedbackId={this.state.surveyCommentId} />
                          </Tab.Pane>
                        </>
                      ),
                    },
                  ]}
                />
              )}
            </Tab.Pane>
          </>
        );
      },
    });

    menuItems.push({
      menuItem: '자동독려',
      render: () => (
        <>
          <p className="tab-text">{getPolyglotToAnyString(cardQuery.name)}</p>
          <AutoEncourage />
        </>
      ),
    });
    // }

    return menuItems;
  }

  render() {
    //
    const { cineroomId, cardId } = this.props.match.params;
    const { isUpdatable, activeIndex } = this.state;
    const { cardState, patronKey } = this.injected.cardService.cardQuery;

    return (
      <>
        <Container fluid>
          <PageTitle breadcrumb={cardBreadcrumb}>Card 관리</PageTitle>
          <Form>
            <Tab
              panes={this.getOpenedPanes()}
              menu={{ secondary: true, pointing: true }}
              className="styled-tab tab-wrap"
              onTabChange={(e: any, data: any) => this.onTabChange(e, data)}
            />
          </Form>

          <SubActions form>
            {patronKey.keyString && patronKey.keyString.endsWith(cineroomId) ? (
              <>
                {activeIndex === 0 && (
                  <SubActions.Left>
                    {cardId && cardState !== CardStates.Opened && (
                      <Button primary onClick={() => this.onClickDeleteCard(cardId)}>
                        삭제
                      </Button>
                    )}
                    {cardId && <Button onClick={() => this.routeToCardCreate(cardId)}>수정</Button>}
                  </SubActions.Left>
                )}
                <SubActions.Right>
                  {!isUpdatable && (cardState === CardStates.Created || cardState === CardStates.Rejected) && (
                    <Button primary onClick={() => this.onClickApprovalCard(cardId)}>
                      승인요청
                    </Button>
                  )}
                  {activeIndex !== 5 && <Button onClick={this.routeToCardList}>목록</Button>}
                </SubActions.Right>
              </>
            ) : (
              <SubActions.Right>
                <Button onClick={this.routeToCardList}>목록</Button>
              </SubActions.Right>
            )}
          </SubActions>
        </Container>
        <TestSheetModalContainer />
      </>
    );
  }
}

export default CardDetailContainer;
