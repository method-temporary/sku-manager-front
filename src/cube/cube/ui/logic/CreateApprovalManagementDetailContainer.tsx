import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { Button, Container } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';

import { reactAutobind, ReactComponent } from '@nara.platform/accent';

import { SharedService } from 'shared/present';
import { alert, AlertModel, confirm, ConfirmModel, PageTitle, SubActions, Loader, Polyglot } from 'shared/components';
import { SelectType, CardCategory } from 'shared/model';
import { LoaderService } from 'shared/components/Loader';

import { learningManagementUrl } from '../../../../Routes';
import { CubeDiscussionService } from 'cubetype';
import { ExamService } from '../../../../exam';
import { SurveyFormService } from '../../../../survey';
import { InstructorService } from '../../../../instructor/instructor';
import CompanionModal from '../../../../cube/cube/ui/view/CompanionModal';
import { OperatorModel } from '../../../../community/community/model/OperatorModel';
import { MemberService } from '../../../../approval';
import { ClassroomGroupService } from '../../../classroom';
import { MediaService } from '../../../media';
import { BoardService } from '../../../board/board';
import { OfficeWebService } from '../../../officeweb';
import { ClassroomModel } from '../../../classroom';
import CreateApproveInfoView from '../view/CreateApproveInfoView';
import { UserCubeState, CubeModel, Instructor, CubeMaterialSdo } from '../..';
import { MediaModel } from '../../../media/model/MediaModel';
import { OfficeWebModel } from '../../../officeweb/model/OfficeWebModel';
import UserCubeService from '../../present/logic/UserCubeService';
import CubeService from '../../present/logic/CubeService';
import CubeInstructorModel from '../../CubeInstructorModel';
import { basicInfoValidationCheck, descriptionValidationCheckForUserCube } from './CubeHelper';
import CreateBasicInfoContainer from './CreateBasicInfoContainer';
import CreateIntroContainer from './CreateIntroContainer';

interface Props extends RouteComponentProps<Params> {}

interface Params {
  cineroomId: string;
  cubeId: string;
}

interface Injected {
  userCubeService: UserCubeService;
  cubeService: CubeService;
  classroomGroupService: ClassroomGroupService;
  mediaService: MediaService;
  boardService: BoardService;
  examService: ExamService;
  surveyFormService: SurveyFormService;
  officeWebService: OfficeWebService;
  instructorService: InstructorService;
  sharedService: SharedService;
  memberService: MemberService;
  cubeDiscussionService: CubeDiscussionService;
  loaderService: LoaderService;
}

interface States {
  // activeIndex: number;
  // alertWinOpen: boolean;
  // alertIcon: string;
  // alertTitle: string;
  // alertType: string;
  // alertMessage: string;
  filesMap: Map<string, any>;
  isUpdatable: boolean;
}

@inject(
  'cubeService',
  'userCubeService',
  'classroomGroupService',
  'mediaService',
  'boardService',
  'officeWebService',
  'surveyFormService',
  'examService',
  'instructorService',
  'sharedService',
  'memberService',
  'cubeDiscussionService',
  'loaderService'
)
@observer
@reactAutobind
class CreateApprovalManagementDetailContainer extends ReactComponent<Props, States, Injected> {
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
    this.init();
    if (this.props.match.params.cubeId) {
      this.setState({ isUpdatable: false });
    }
  }

  async init(): Promise<void> {
    //
    const { cubeService, userCubeService } = this.injected;
    const { cubeId } = this.props.match.params;

    await this.findCubeDetail(cubeId);

    cubeService.changeCubeDetailProps('userCube', userCubeService.userCube);
  }

  async findCubeDetail(cubeId: string): Promise<void> {
    //
    const { cubeService, loaderService } = this.injected;

    loaderService.openLoader(true);

    await cubeService.findCubeDetail(cubeId);

    // 생성정보
    this.setCreateInfo(cubeId);

    // 교육정보 및 부가정보
    this.setBasicInfo();

    // 교육정보 및 부가정보 - 강사
    this.setAdditionalInfo();
  }

  async setCreateInfo(cubeId: string) {
    //
    const { cubeService, loaderService } = this.injected;

    await this.setCubeOperator(cubeService.cubeDetail.cubeContents.operator.keyString);

    // 생성정보 - 처리자 및 처리일자, 처리상태
    await this.findUserCube(cubeId);

    loaderService.closeLoader(true, 'createInfo');
  }

  async setBasicInfo() {
    //
    const { cubeService, loaderService } = this.injected;

    this.setCategories(cubeService.cubeDetail.cube.categories);

    if (cubeService.cubeDetail.cubeMaterial.classrooms) {
      await this.setCubeClassrooms(cubeService.cubeDetail.cubeMaterial.classrooms);
    }
    if (cubeService.cubeDetail.cubeMaterial.media) {
      await this.setCubeMedia(cubeService.cubeDetail.cubeMaterial.media);
    }
    if (cubeService.cubeDetail.cubeMaterial.officeWeb) {
      await this.setCubeOfficeWeb(cubeService.cubeDetail.cubeMaterial.officeWeb);
    }

    loaderService.closeLoader(true, 'basicInfo');
  }

  async setAdditionalInfo() {
    //
    const { cubeService, loaderService } = this.injected;

    await this.setCubeInstructors(cubeService.cubeDetail.cubeContents.instructors);
    loaderService.closeLoader(true, 'additional');
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
    classroomGroupService.clearCubeClassrooms();
    classroomGroupService.setCubeClassrooms(cubeClassrooms);

    cubeClassrooms.forEach((classroom, index) => {
      this.setClassroomOperator(index, classroom.operation.operator.keyString);
    });
  }

  setCubeMedia(media: MediaModel) {
    const { mediaService } = this.injected;
    mediaService.setMedia(media);
  }

  setCubeOfficeWeb(officeWeb: OfficeWebModel) {
    const { officeWebService } = this.injected;
    officeWebService.setOfficeWeb(officeWeb);
  }

  async setCubeInstructors(instructors: Instructor[]) {
    const { cubeService, instructorService } = this.injected;
    await instructorService.findInstructorsByIds(instructors.map((instructor) => instructor.instructorId));
    cubeService.setCubeInstructors(
      instructorService.instructors.map((instructorWiths) =>
        CubeInstructorModel.asCubeInstructorByInstructorWiths(instructorWiths)
      )
    );
    instructors.forEach((instructor) => {
      if (instructor.representative) {
        cubeService.changeCubeInstructorPropById(instructor.instructorId, instructor.round, 'representative', true);
      }
      cubeService.changeCubeInstructorPropById(instructor.instructorId, instructor.round, 'round', instructor.round);
      cubeService.changeCubeInstructorPropById(
        instructor.instructorId,
        instructor.round,
        'lectureTime',
        instructor.lectureTime
      );
      cubeService.changeCubeInstructorPropById(
        instructor.instructorId,
        instructor.round,
        'instructorLearningTime',
        instructor.instructorLearningTime
      );
    });
  }

  async setCubeOperator(id: string) {
    //
    const { memberService, cubeService } = this.injected;
    if (id) {
      await memberService.findMemberById(id);
      cubeService.setCubeOperator(OperatorModel.fromMemberModel(memberService.member));
    } else {
      cubeService.setCubeOperator(new OperatorModel());
    }
  }

  async setClassroomOperator(index: number, id: string) {
    const { memberService, classroomGroupService } = this.injected;
    await memberService.findMemberById(id);
    classroomGroupService.changeTargetCubeClassroomProps(
      index,
      'operation.operatorInfo',
      OperatorModel.fromMemberModel(memberService.member)
    );
  }

  async findUserCube(cubeId: string): Promise<void> {
    const { userCubeService } = this.injected;
    userCubeService.clearUserCube();
    await userCubeService.findUserCubeForAdmin(cubeId);
    if (userCubeService.userCube.openRequests && userCubeService.userCube.openRequests.length > 0) {
      userCubeService.userCube.openRequests.forEach((openRequest) => {
        if (openRequest.response.approver.keyString) {
          this.findMemberName(openRequest.response.approver.keyString);
        }
      });
    }
  }

  routeToCubeApprovalList() {
    //
    this.props.history.push(
      `/cineroom/${this.props.match.params.cineroomId}/${learningManagementUrl}/cubes/create-approve-management/approvalContents-list`
    );
  }

  async onClickRejectCube() {
    //
    // confirm(
    //   ConfirmModel.getCustomConfirm(
    //     'Cube 반려',
    //     '등록된 Cube 정보에 대해 반려하시겠습니까',
    //     false,
    //     '반려',
    //     '취소',
    //     () => {
    //       this.handleReject(
    //         this.injected.userCubeService.selectedList.map((target) => target.userCube.id),
    //         this.injected.userCubeService.cubeRequestCdo.remark
    //       );
    //     },
    //     () => {}
    //   )
    // );
    await this.handleReject(
      [this.injected.userCubeService.userCube.id],
      this.injected.userCubeService.cubeRequestCdo.remark
    );
  }

  async findMember() {
    await this.injected.memberService.findMemberById(this.injected.userCubeService.userCube.creator.keyString);
  }

  async handleReject(ids: string[], remark: string) {
    const { userCubeService } = this.injected;
    await userCubeService.rejectUserCubes(ids, remark);
    // alert(
    //   AlertModel.getCustomAlert(true, '반려', '반려되었습니다.', '확인', () => {
    //     this.findAllApprovalContents();
    //   })
    // );
    this.routeToCubeApprovalList();
  }

  onChangeCubeRequestProps(name: string, value: string) {
    //
    this.injected.userCubeService.changeCubeRequestProps(name, value);
  }

  onClickApproveCube() {
    //
    this.handleSave(this.injected.userCubeService.userCube.id);
    // const message = '등록된 Cube 정보에 대해 승인하시겠습니까?';
    // this.setState({
    //   alertMessage: message,
    //   alertWinOpen: true,
    //   alertTitle: 'Cube 승인',
    //   alertIcon: 'circle',
    //   alertType: 'approval',
    // });
  }

  async handleSave(id: string) {
    //
    const {
      userCubeService,
      cubeService,
      classroomGroupService,
      mediaService,
      boardService,
      officeWebService,
      cubeDiscussionService,
    } = this.injected;
    const classrooms = classroomGroupService.cubeClassrooms;
    const media = mediaService.media;
    const board = boardService.board;
    const officeWeb = officeWebService.officeWeb;
    const community = cubeService.cubeCommunity;
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
    const cubeDiscussion = cubeDiscussionService.cubeDiscussion;
    const validation = await this.createUserCubeValidationCheck();
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

      confirm(
        ConfirmModel.getCustomConfirm(
          'Cube 승인',
          '등록된 Cube 정보에 대해 승인하시겠습니까',
          false,
          '승인',
          '취소',
          () => {
            userCubeService.modifyUserCube(id, cubeSdo).then(() => {
              userCubeService.openUserCubes([id]).then(() => {
                alert(
                  AlertModel.getCustomAlert(true, '승인', '승인되었습니다.', '확인', () => {
                    this.routeToCubeApprovalList();
                  })
                );
              });
            });
          },
          () => {}
        )
      );
    }
  }

  async createUserCubeValidationCheck(): Promise<boolean> {
    const { cubeService } = this.injected;
    const { cube, cubeCommunity, cubeOperator } = cubeService;

    let validation;
    validation = basicInfoValidationCheck(cubeService, cube, cubeCommunity);
    if (!validation) {
      return validation;
    }
    validation = descriptionValidationCheckForUserCube(cubeService, cube, cubeOperator);
    if (!validation) {
      return validation;
    }
    return validation;
  }

  async findMemberName(id: string): Promise<void> {
    //
    const { memberService, userCubeService } = this.injected;
    await memberService.findMemberById(id);
    userCubeService.setMemberName(memberService.member.name);
  }

  async onChangeModifyMode(value: boolean): Promise<void> {
    const { cubeId } = this.props.match.params;
    this.setState({ isUpdatable: value });
    if (!value) {
      await this.findCubeDetail(cubeId);
    }
  }

  render() {
    const { isUpdatable } = this.state;
    const { userCubeService, cubeService, memberService } = this.injected;
    const { userCube } = userCubeService;
    const { member } = memberService;
    const { cubeDetail, cube } = cubeService;

    const { cubeId } = this.props.match.params;
    const { filesMap } = this.state;

    const readonly = !isUpdatable || userCube.state !== UserCubeState.OpenApproval;

    return (
      <Container fluid>
        <Polyglot languages={cube.langSupports}>
          <PageTitle breadcrumb={SelectType.createApproveSections} />
          {/*생성 정보*/}
          <Loader name="createInfo">
            <CreateApproveInfoView
              onClickApproveCube={this.onClickApproveCube}
              onClickRejectCube={this.onClickRejectCube}
              onChangeCubeRequestProps={this.onChangeCubeRequestProps}
              findMember={this.findMember}
              cubeDetail={cubeDetail}
              userCube={userCube}
              readonly={readonly}
              member={member}
            />
          </Loader>

          {/* 기본정보 및 노출정보 */}
          <Loader name="basicInfo">
            <CreateBasicInfoContainer readonly={readonly} />
          </Loader>

          {/* 교육정보 및 부가정보 */}
          <Loader name="additional">
            <CreateIntroContainer cubeId={cubeId} cubeType={cube.type} filesMap={filesMap} readonly={readonly} />
          </Loader>
          <SubActions form>
            {cubeId && userCube.state === UserCubeState.OpenApproval && (
              <SubActions.Left>
                {(isUpdatable && <Button onClick={() => this.onChangeModifyMode(false)}>취소</Button>) || (
                  <Button primary onClick={() => this.onChangeModifyMode(true)}>
                    수정
                  </Button>
                )}
              </SubActions.Left>
            )}
            <SubActions.Right>
              <Button basic onClick={this.routeToCubeApprovalList}>
                목록
              </Button>
              {!readonly ? (
                <>
                  <CompanionModal
                    handleOk={this.onClickRejectCube}
                    changeSomethingProps={this.onChangeCubeRequestProps}
                  />
                  <Button primary onClick={this.onClickApproveCube}>
                    승인
                  </Button>
                </>
              ) : null}
            </SubActions.Right>
          </SubActions>
          {/*<AlertWin*/}
          {/*  message={alertMessage}*/}
          {/*  handleClose={this.handleCloseAlertWin}*/}
          {/*  open={alertWinOpen}*/}
          {/*  alertIcon={alertIcon}*/}
          {/*  title={alertTitle}*/}
          {/*  type={alertType}*/}
          {/*  handleOk={this.handleAlertOk}*/}
          {/*/>*/}
        </Polyglot>
      </Container>
    );
  }
}

export default withRouter(CreateApprovalManagementDetailContainer);
