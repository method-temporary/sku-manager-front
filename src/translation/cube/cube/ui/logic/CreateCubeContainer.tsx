import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { Button, Container, Form } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';

import { patronInfo } from '@nara.platform/dock';
import { reactAutobind, ReactComponent } from '@nara.platform/accent';

import { SelectType, CubeType, PatronKey } from 'shared/model';
import { alert, AlertModel, Loader, PageTitle, SubActions, Polyglot } from 'shared/components';
import { LoaderService } from 'shared/components/Loader';

import { translationManagementUrl } from 'Routes';
import { UserWorkspaceService } from 'userworkspace';
import { CardService } from 'card';
import { ExamService } from 'exam';
import DuplicateCubeNameRdo from 'cube/cube/model/sdo/DuplicateCubeNameRdo';
import CubePolyglotUdo from 'cube/cube/model/sdo/CubePolyglotUdo';
import { SurveyCaseService, SurveyFormService } from 'survey';
import { CubeMaterialSdo, CubeModel, Instructor } from 'cube/cube';
import {
  basicInfoValidationCheck,
  descriptionValidationCheck,
  additionalInfoValidationCheck,
} from 'cube/cube/ui/logic/CubeHelper';
import { InstructorService } from 'instructor/instructor';
import { BoardService, ClassroomGroupService, MediaService, OfficeWebService, CubeDiscussionService } from 'cubetype';
import CubeService from 'cube/cube/present/logic/CubeService';
import CubeBasicInfoContainer from './CubeBasicInfoContainer';
import CubeExposureInfoContainer from './CubeExposureInfoContainer';
import CubeDescriptionContainer from './CubeDescriptionContainer';
import CubeAdditionalInfoContainer from './CubeAdditionalInfoContainer';

interface Props extends RouteComponentProps<Params> {
  findCubeDetail?: () => void;
}

interface Params {
  cineroomId: string;
  cubeId: string;
}

interface States {
  filesMap: Map<string, any>;
  isUpdatable: boolean;
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

  routeToCubeList() {
    //
    const { cubeService } = this.injected;
    Promise.resolve()
      .then(() => cubeService.clearCube())
      .then(() => cubeService.clearCubes())
      .then(() =>
        this.props.history.push(
          `/cineroom/${this.props.match.params.cineroomId}/${translationManagementUrl}/cubes/cube-list`
        )
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

    if (validation) loaderService.openPageLoader(true);

    try {
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
        const cubeId = cubeService.cube.id;

        if (cubeId) {
          const udo = new CubePolyglotUdo();
          udo.cubeId = cubeId;
          udo.langSupports = cubeSdo.langSupports; // 지원 언어
          udo.name = cubeSdo.name; // 카드명
          udo.tags = cubeSdo.tags; // Tag 정보
          udo.description = cubeSdo.description; // 교육대상, 이수조건, 교육내용, 교육목표, 기타안내
          udo.reportName = cubeSdo.reportFileBox.reportName; // 리포트명
          udo.reportQuestion = cubeSdo.reportFileBox.reportQuestion; // Write Guide
          await cubeService.modifyPolyglotForAdmin(udo.cubeId, udo);
        }

        loaderService.closeLoader(true);
        alert(AlertModel.getSaveSuccessAlert());

        this.routeToCubeList();
      }
    } catch {
      alert(AlertModel.getCustomAlert(false, '오류', 'Cube 수정에 실패하였습니다.', '확인'));
      loaderService.closeLoader(true);
    }
  }

  async onChangeModifyMode(value: boolean): Promise<void> {
    const { cubeService } = this.injected;
    const { cubeId } = this.props.match.params;
    this.setState({ isUpdatable: value });
    if (!value) {
      if (this.props.findCubeDetail) {
        this.props.findCubeDetail();
      } else {
        await cubeService.findCubeDetail(cubeId);
      }
    }
  }

  async cubeValidationCheck(): Promise<boolean> {
    //
    const { cubeService } = this.injected;
    const { cube, cubeCommunity, cubeOperator } = cubeService;

    let validation;
    validation = basicInfoValidationCheck(cubeService, cube, cubeCommunity);
    if (!validation) {
      return validation;
    }
    validation = descriptionValidationCheck(cubeService, cube, cubeOperator);
    if (!validation) {
      return validation;
    }
    validation = additionalInfoValidationCheck(cubeService, cube);
    if (!validation) {
      return validation;
    }
    return validation;
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
              {/* 기본정보 */}
              <Loader name="info" disabled={loaderDisabled}>
                <CubeBasicInfoContainer readonly={!isUpdatable} cubeId={cubeId} />
              </Loader>

              {/* 노출정보 */}
              <Loader name="info" disabled={loaderDisabled}>
                <CubeExposureInfoContainer onChangeCubeProps={this.onChangeCubeProps} readonly={!isUpdatable} />
              </Loader>
              {/* 교육정보 */}
              <Loader name="description" disabled={loaderDisabled}>
                <CubeDescriptionContainer readonly={!isUpdatable} />
              </Loader>
              {/* 추가 정보 */}
              {cube.type === CubeType.ALL ||
              cube.type === CubeType.ClassRoomLecture ||
              cube.type === CubeType.Cohort ||
              cube.type === CubeType.ELearning ? null : (
                <Loader name="additional" disabled={loaderDisabled}>
                  <CubeAdditionalInfoContainer readonly={!isUpdatable} />
                </Loader>
              )}
            </Form>
            <SubActions form>
              {cubeId && isOwner && (
                <SubActions.Left>
                  {(isUpdatable && <Button onClick={() => this.onChangeModifyMode(false)}>취소</Button>) || (
                    <Button primary onClick={() => this.onChangeModifyMode(true)}>
                      수정
                    </Button>
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
      </>
    );
  }
}

export default withRouter(CreateCubeContainer);
