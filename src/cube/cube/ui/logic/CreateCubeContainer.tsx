import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { Button, Container, Form } from 'semantic-ui-react';
import { RouteComponentProps, withRouter } from 'react-router';

import { patronInfo } from '@nara.platform/dock';
import { reactAutobind, ReactComponent } from '@nara.platform/accent';

import { SelectType, CubeType, PatronKey } from 'shared/model';
import { alert, AlertModel, Loader, PageTitle, SubActions, Polyglot } from 'shared/components';
import { LoaderService } from 'shared/components/Loader';

import CubeService from '../../present/logic/CubeService';
import CubeBasicInfoContainer from './CubeBasicInfoContainer';
import CubeExposureInfoContainer from './CubeExposureInfoContainer';
import { SurveyCaseService, SurveyFormService } from '../../../../survey';
import {
  BoardService,
  ClassroomGroupService,
  MediaService,
  OfficeWebService,
  CubeDiscussionService,
} from '../../../../cubetype';
import CubeAdditionalInfoContainer from './CubeAdditionalInfoContainer';
import { learningManagementUrl } from '../../../../Routes';
import { CubeMaterialSdo, CubeModel, Instructor } from '../..';
import { InstructorService } from '../../../../instructor/instructor';
import { SurveyFormModel } from 'survey/form/model/SurveyFormModel';
import {
  basicInfoValidationCheck,
  descriptionValidationCheck,
  classroomTypeInfoValidationCheck,
  additionalInfoValidationCheck,
  completionConditionVaildationCheck,
  relatedUrlVaildationCheck,
  setCubeCommunity,
  setBoard,
  setCubeInstructors,
  setDetailByType,
  setAdditional,
} from './CubeHelper';
import { CubeDetailByTypeContainer } from 'cube/classroom';
import CreateCourseSetInfoContainer from './CreateCourseSetInfoContainer';
import { CardService } from '../../../../card';
import { ExamService } from '../../../../exam';
import { TestSheetModalContainer } from 'exam/ui/logic/TestSheetModalContainer';
import { UserWorkspaceService } from '../../../../userworkspace';
import DuplicateCubeNameRdo from '../../model/sdo/DuplicateCubeNameRdo';

interface Props extends RouteComponentProps<Params> {
  findCubeDetail?: () => void;
}

interface Params {
  cineroomId: string;
  cubeId: string;
  copiedId: string;
}

interface States {
  filesMap: Map<string, any>;
  isUpdatable: boolean;
  copied?: boolean;
}

interface Injected {
  cubeService: CubeService;
  classroomGroupService: ClassroomGroupService;
  surveyCaseService: SurveyCaseService;
  surveyFormService: SurveyFormService;
  mediaService: MediaService;
  boardService: BoardService;
  officeWebService: OfficeWebService;
  instructorService: InstructorService;
  cardService: CardService;
  examService: ExamService;
  cubeDiscussionService: CubeDiscussionService;
  loaderService: LoaderService;
  userWorkspaceService: UserWorkspaceService;
}

@inject(
  'cubeService',
  'classroomGroupService',
  'surveyCaseService',
  'surveyFormService',
  'mediaService',
  'boardService',
  'officeWebService',
  'cardService',
  'examService',
  'cubeDiscussionService',
  'loaderService',
  'userWorkspaceService'
)
@observer
@reactAutobind
class CreateCubeContainer extends ReactComponent<Props, States, Injected> {
  //
  constructor(props: Props) {
    super(props);
    this.state = {
      filesMap: new Map<string, any>(),
      isUpdatable: true,
    };
  }

  componentDidMount() {
    //
    if (this.props.match.params.cubeId) {
      this.setState({ isUpdatable: false });
    } else if (this.props.match.params.copiedId) {
      this.findCubeDetail();
      this.setState({ isUpdatable: true });
    } else {
      this.initialClear();
    }
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
    const { cubeService, officeWebService, loaderService } = this.injected;
    const { copiedId } = this.props.match.params;
    if (this.props.match.params.copiedId) {
      this.setState({ isUpdatable: false });

      loaderService.openLoader(true);

      await cubeService.findCubeDetail(copiedId);

      // 지원언어
      // cubeService.changeCubeProps('langSupports', [DEFAULT_LANGUAGE]);

      // 기본정보
      // 메인채널, 서브채널
      // setCategories(cubeService.cubeDetail.cube.categories);
      cubeService.clearMainCategory();
      cubeService.setSubCategories([]);
      this.cubeCategoryClear();
      // Community
      setCubeCommunity(cubeService.cubeDetail.cubeMaterial.cubeCommunity.communityId);
      // fileBoxId 초기화

      // 교육정보
      // Task 유형일 때 교육정보
      setBoard(cubeService.cubeDetail.cubeMaterial.board);
      // 강사정보
      setCubeInstructors(cubeService.cubeDetail.cubeContents.instructors);
      // 담당자 정보
      // setCubeOperator(cubeService.cubeDetail.cubeContents.operator.keyString);

      // Mapping Card 정보
      // findCardsByCubeId(cubeService.cubeDetail.cube.id);

      // 부가 정보
      setDetailByType();

      // 추가 정보
      setAdditional();

      cubeService.changeCubeProps('cubeContents.fileBoxId', '');
      cubeService.changeCubeProps('cubeContents.reportFileBox.fileBoxId', '');
      cubeService.changeCubeProps('id', '');
      officeWebService.changeOfficeWebProps('fileBoxId', '');
    }
  }

  cubeCategoryClear() {
    //
    const { cubeService } = this.injected;
    cubeService.changeCubeProps('categories', []);
  }

  onChangeCubeProps(name: string, value: string | {} | []) {
    //
    const { cubeService } = this.injected;
    let getTagList = [];
    if (cubeService && name === 'tags' && typeof value === 'string') {
      getTagList = value.split(',');
      cubeService.changeCubeProps('cubeContents.tags', getTagList);
      cubeService.changeCubeProps('cubeContents.tag', value);
    }
    if (cubeService && name !== 'tags') {
      cubeService.changeCubeProps(name, value);
    }
  }

  onHandleSurveyModalOk(selectedSurveyForm: SurveyFormModel, type: string) {
    //
    const { cubeService } = this.injected;
    if (type === 'cube') {
      cubeService.changeCubeProps('cubeContents.surveyId', selectedSurveyForm.id);
      cubeService.changeCubeProps('cubeContents.surveyTitle', selectedSurveyForm.title);
      cubeService.changeCubeProps('cubeContents.surveyDesignerName', selectedSurveyForm.formDesignerName);
    }
  }

  addSharedCineroomId(cineroomId: string): void {
    //
    const { cubeService } = this.injected;
    const targetSharingCineroomIds = [...cubeService.cube.sharingCineroomIds];
    if (targetSharingCineroomIds.some((id) => id === cineroomId)) {
      targetSharingCineroomIds.splice(targetSharingCineroomIds.indexOf(cineroomId), 1);
    } else {
      targetSharingCineroomIds.push(cineroomId);
    }
    cubeService.changeCubeProps('sharingCineroomIds', targetSharingCineroomIds);
  }

  addAllSharedCineroomId(checked: boolean): void {
    //
    const { cubeService, userWorkspaceService } = this.injected;
    const { allUserWorkspaces } = userWorkspaceService;

    if (checked) {
      cubeService.changeCubeProps(
        'sharingCineroomIds',
        allUserWorkspaces.map((userWorkspace) => userWorkspace.id)
      );
    } else {
      cubeService.changeCubeProps('sharingCineroomIds', []);
    }
  }

  routeToCubeList() {
    //
    const { cubeService } = this.injected;
    Promise.resolve()
      .then(() => cubeService.clearCube())
      .then(() => cubeService.clearCubes())
      .then(() =>
        this.props.history.push(
          `/cineroom/${this.props.match.params.cineroomId}/${learningManagementUrl}/cubes/cube-list`
        )
      );
  }

  routeToCubeDetail(cubeId: string) {
    //
    this.props.history.push(
      `/cineroom/${this.props.match.params.cineroomId}/${learningManagementUrl}/cubes/cube-detail/${cubeId}`
    );
  }

  async onSaveCube(): Promise<void> {
    //
    const {
      cubeService,
      classroomGroupService,
      mediaService,
      boardService,
      officeWebService,
      cubeDiscussionService,
      loaderService,
    } = this.injected;

    const { cube } = cubeService;
    const classrooms = classroomGroupService.cubeClassrooms;
    const media = mediaService.media;
    const board = boardService.board;
    const officeWeb = officeWebService.officeWeb;
    const community = cubeService.cubeCommunity;
    const cubeDiscussion = cubeDiscussionService.cubeDiscussion;
    const instructors = cubeService.cubeInstructors.map(
      (instructor) =>
        new Instructor({
          instructorId: instructor.id,
          lectureTime: instructor.lectureTime,
          instructorLearningTime: instructor.instructorLearningTime,
          representative: instructor.representative,
          round: instructor.round,
        })
    );
    const operator = cubeService.cubeOperator;

    const validation = await this.cubeValidationCheck();

    // cubeService.clearCubeQuery();
    // cubeService.changeCubeQueryProps('searchWord', cube.name);
    // cubeService.changeCubeQueryProps('searchPart', '과정명');

    if (validation) loaderService.openPageLoader(true);

    const countByName = await cubeService.findCubeCountByName(
      new DuplicateCubeNameRdo({ id: (cube.id && cube.id) || undefined, name: cube.name })
    );
    if (countByName > 0) {
      alert(AlertModel.getCustomAlert(false, '안내', '중복된 Cube명이 이미 존재합니다.', '확인'));
      loaderService.closeLoader(true);
      return;
    }

    if (validation) {
      const materialSdo = CubeMaterialSdo.makeCubeMaterialSdo(
        classrooms,
        media,
        board,
        officeWeb,
        community,
        cubeDiscussion
      );
      const cubeSdo = CubeModel.asSdo(cubeService.cube, instructors, operator, materialSdo);
      let cubeId = cubeService.cube.id;

      if (cubeId) {
        await cubeService.modifyCube(cubeId, cubeSdo);
      } else {
        cubeId = await cubeService.registerCube(cubeSdo);
      }

      loaderService.closeLoader(true);
      alert(AlertModel.getSaveSuccessAlert());

      // this.routeToCubeList();
      this.routeToCubeDetail(cubeId);
    }
  }

  async onChangeModifyMode(value: boolean): Promise<void> {
    //
    const location = window.location;

    const { cubeService } = this.injected;
    const { cubeId, cineroomId } = this.props.match.params;
    const { cube } = cubeService;

    const isEnrollmentCube = !!cube.enrollmentCardId;

    if (isEnrollmentCube) {
      //
      // `${location.protocol}//${location.host}/manager/cineroom/${cineroomId}/${learningManagementUrl}/cards/card-detail/${cubeId}`
      this.props.history.push(
        `/cineroom/${cineroomId}/${learningManagementUrl}/cards/card-detail/${cube.enrollmentCardId}/${cubeId}`
      );
    } else {
      this.setState({ isUpdatable: value });
      if (!value) {
        if (this.props.findCubeDetail) {
          this.props.findCubeDetail();
        } else {
          await cubeService.findCubeDetail(cubeId);
        }
      }
    }
  }

  async cubeValidationCheck(): Promise<boolean> {
    //
    const {
      cubeService,
      officeWebService,
      mediaService,
      classroomGroupService,
      cubeDiscussionService,
      boardService,
      loaderService,
    } = this.injected;
    const { cube, cubeCommunity, cubeOperator } = cubeService;
    const { officeWeb } = officeWebService;
    const { cubeDiscussion } = cubeDiscussionService;
    const { board } = boardService;

    let validation;
    validation = basicInfoValidationCheck(cubeService, cube, cubeCommunity);
    if (!validation) {
      return validation;
    }
    validation = descriptionValidationCheck(cubeService, cube, cubeOperator);
    if (!validation) {
      return validation;
    }
    validation = await classroomTypeInfoValidationCheck(
      cubeService,
      officeWebService,
      classroomGroupService,
      mediaService,
      cube,
      officeWeb
    );
    if (!validation) {
      return validation;
    }
    validation = additionalInfoValidationCheck(cubeService, cube);
    if (!validation) {
      return validation;
    }

    validation = completionConditionVaildationCheck(cube, cubeDiscussion, board);
    if (!validation) {
      return validation;
    }

    validation = relatedUrlVaildationCheck(cube, cubeDiscussion);

    return validation;
    //추가정보 - report 추가할 때 report명, 문제 필수입력 (Video, Audio, WebPage, Cohort, Documents, Experiential)
  }

  render() {
    //
    const { cubeService, cardService } = this.injected;
    const { cube } = cubeService;

    const { cards } = cardService;
    const { cubeId } = this.props.match.params;
    const { isUpdatable } = this.state;

    const loaderDisabled = cubeId === undefined;
    const isOwner = cube.patronKey.keyString && PatronKey.getCineroomId(cube.patronKey) === patronInfo.getCineroomId();

    return (
      <>
        <Container fluid>
          {cubeId ? null : <PageTitle breadcrumb={SelectType.cubeSections} />}
          <div className="contents">
            <Form>
              <Polyglot languages={cube.langSupports}>
                {/* 기본정보 */}
                <Loader name="info" disabled={loaderDisabled}>
                  <CubeBasicInfoContainer readonly={!isUpdatable} cubeId={cubeId} />
                </Loader>

                {/* 노출정보 */}
                {/* <Loader name="info" disabled={loaderDisabled}>
                  <CubeExposureInfoContainer
                    onChangeCubeProps={this.onChangeCubeProps}
                    addSharedCineroomId={this.addSharedCineroomId}
                    addAllSharedCineroomId={this.addAllSharedCineroomId}
                    readonly={!isUpdatable}
                  />
                </Loader> */}
                {/*/!* 교육정보 *!/*/}
                {/*<Loader name="description" disabled={loaderDisabled}>*/}
                {/*  <CubeDescriptionContainer readonly={!isUpdatable} />*/}
                {/*</Loader>*/}
                {/* Mapping Course 정보 */}
                {(cards && cards.length && (
                  <Loader name="cardMapping" disabled={loaderDisabled}>
                    <CreateCourseSetInfoContainer cubeId={cubeId} />
                  </Loader>
                )) ||
                  null}
                {/* 부가정보 - 차수정보, 교육자료 */}
                {cube.type === CubeType.Cohort ? null : (
                  <Loader name="detail" disabled={loaderDisabled}>
                    <CubeDetailByTypeContainer cubeId={cubeId} filesMap={this.state.filesMap} readonly={!isUpdatable} />
                  </Loader>
                )}

                {/* 추가 정보 */}
                {cube.type === CubeType.ALL ||
                cube.type === CubeType.ClassRoomLecture ||
                cube.type === CubeType.Cohort ||
                cube.type === CubeType.ELearning ? null : (
                  <Loader name="additional" disabled={loaderDisabled}>
                    <CubeAdditionalInfoContainer
                      onHandleSurveyModalOk={this.onHandleSurveyModalOk}
                      readonly={!isUpdatable}
                      cubeId={cubeId}
                    />
                  </Loader>
                )}
              </Polyglot>
            </Form>
            <SubActions form>
              {cubeId && isOwner && (
                <SubActions.Left>
                  {isUpdatable && <Button onClick={() => this.onChangeModifyMode(false)}>취소</Button>}
                  {!isUpdatable &&
                    !(
                      // E-learning 나 Classroom 이면서 enrollmentCardId 가 '' 이면 수정버튼 안보이도록
                      (
                        (cube.enrollmentCardId === '' || cube.enrollmentCardId === null) &&
                        (cube.type === 'ELearning' || cube.type === 'ClassRoomLecture')
                      )
                    ) && (
                      <>
                        <Button primary onClick={() => this.onChangeModifyMode(true)}>
                          수정
                        </Button>
                        {(cube.type === 'ELearning' || cube.type === 'ClassRoomLecture') && (
                          <span className="span-information" style={{ marginLeft: '10px' }}>
                            클릭 시 Classroom, E-learning Cube를 생성한 수강신청형 Card 수정화면으로 이동합니다.
                          </span>
                        )}
                      </>
                    )}
                </SubActions.Left>
              )}
              <SubActions.Right>
                <Button basic onClick={() => this.routeToCubeList()}>
                  목록
                </Button>
                {!cubeId || isOwner ? (
                  <Button primary disabled={!isUpdatable} onClick={() => this.onSaveCube()}>
                    저장
                  </Button>
                ) : null}
              </SubActions.Right>
            </SubActions>
          </div>
        </Container>
        <TestSheetModalContainer />
      </>
    );
  }
}

export default withRouter(CreateCubeContainer);
