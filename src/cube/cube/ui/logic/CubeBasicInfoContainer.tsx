import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { PatronType, reactAutobind, ReactComponent } from '@nara.platform/accent';
import CubeService from '../../present/logic/CubeService';
import CubeBasicInfoView from '../view/CubeBasicInfoView';
import Community from '../../../../community/community/model/Community';
import { CollegeService } from '../../../../college';
import { learningManagementUrl } from '../../../../Routes';
import { RouteComponentProps, withRouter } from 'react-router';
import CubeDiscussionService from '../../../cubeDiscussion/present/logic/CubeDiscussionService';
import BoardService from '../../../board/board/present/logic/BoardService';
import { MemberViewModel } from '@nara.drama/approval';
import { getPolyglotToAnyString } from '../../../../shared/components/Polyglot';
import { OperatorModel } from '../../../../community/community/model/OperatorModel';
import CubeInstructorModel from '../../CubeInstructorModel';

interface Props extends RouteComponentProps<Params> {
  readonly?: boolean;
  cubeId: string;
}

interface Params {
  cineroomId: string;
}

interface States {}

interface Injected {
  cubeService: CubeService;
  collegeService: CollegeService;
  cubeDiscussionService: CubeDiscussionService;
  boardService: BoardService;
}

@inject('cubeService', 'collegeService', 'cubeDiscussionService', 'boardService')
@observer
@reactAutobind
class CubeBasicInfoContainer extends ReactComponent<Props, States, Injected> {
  //
  componentDidMount() {}

  onChangeCubeProps(name: string, value: any) {
    //
    const { cubeService } = this.injected;
    cubeService.changeCubeProps(name, value);
  }

  onHandleCommunityModalOk(community: Community) {
    const { cubeService } = this.injected;
    cubeService.clearCubeCommunity();
    cubeService.setCubeCommunity(community);
    cubeService.changeCubeProps('name', community.name);
  }

  getFileBoxIdForReference(fileBoxId: string) {
    //
    const { cubeService } = this.injected;
    cubeService.changeCubeProps('cubeContents.fileBoxId', fileBoxId);
  }

  onClickCubeImport(cubeId: string): void {
    //
    this.props.history.push(
      `/cineroom/${this.props.match.params.cineroomId}/${learningManagementUrl}/cubes/cube-create/copy/${cubeId}`
    );
  }

  onChangeCubeDescriptionProps(name: string, value: any): void {
    //
    const { cubeService } = this.injected;
    cubeService.changeCubeProps(name, value);
  }

  handleCubeBoardChange(name: string, value: string | boolean) {
    const { boardService } = this.injected;
    boardService.changeBoardProps(name, value);
  }

  onChangeCubeBoardCountProps(name: string, value: string) {
    let val = value;
    if (val === '') {
      val = '0';
    } else if (value.startsWith('0') && value !== '0') {
      val = value.substr(1);
    }

    this.handleCubeBoardChange(name, val);
  }

  handleCubeDiscussionChange(name: string, value: string | boolean) {
    const { cubeDiscussionService } = this.injected;
    cubeDiscussionService.changeCubeDiscussionProps(name, value);
  }

  onChangeCubeDiscussionCountProps(name: string, value: string) {
    let val = value;
    if (val === '') {
      val = '0';
    } else if (value.startsWith('0') && value !== '0') {
      val = value.substr(1);
    }
    this.handleCubeDiscussionChange(name, val);
  }

  onTextareaChange(name: string, value: any): void {
    const { cubeService } = this.injected;
    const invalid = value.length > 1000;

    if (invalid) {
      return;
    }

    cubeService.changeCubeProps(name, value);
  }

  setHourAndMinute(name: string, value: number) {
    //
    if (value < 0) value = 0;
    const { cubeService } = this.injected;
    const learningTime = cubeService.cube.learningTime;

    let hours: number = parseInt(String(learningTime / 60), 10);
    let minutes: number = parseInt(String(learningTime % 60), 10);

    Promise.resolve()
      .then(() => {
        if (name === 'hour') {
          if (value >= 1000) value = 999;
          hours = value;
        }
        if (name === 'minute') {
          if (value >= 60) value = 59;
          minutes = value;
        }
      })
      .then(() => this.setLearningTime(hours, minutes));
  }

  setLearningTime(hour: number, minute: number) {
    //
    const { cubeService } = this.injected;
    const numberHour = Number(hour);
    const numberMinute = Number(minute);
    const newMinute = numberHour * 60 + numberMinute;
    cubeService.changeCubeProps('learningTime', newMinute);
  }

  handleManagerListModalOk(member: MemberViewModel) {
    //
    const { cubeService } = this.injected;

    const operator = new OperatorModel({
      employeeId: member.employeeId,
      email: member.email,
      company: member.companyCode,
      name: getPolyglotToAnyString(member.name),
      patronKey: { keyString: member.id, patronType: PatronType.Denizen },
    });

    cubeService.setCubeOperator(operator);
  }

  onChangeTargetInstructor(target: CubeInstructorModel, name: string, value: any): void {
    const { cubeService } = this.injected;
    const targetIndex = cubeService.cubeInstructors.findIndex(
      (instructor) => instructor.id === target.id && instructor.round === target.round
    );
    if (value < 0) value = 0;
    cubeService.changeTargetCubeInstructorProp(targetIndex, name, value);
  }

  onSelectInstructor(instructor: CubeInstructorModel, name: string, value: boolean): void {
    const { cubeService } = this.injected;
    cubeService.cubeInstructors.forEach((cubeInstructor, index) => {
      if (cubeInstructor.round === instructor.round) {
        cubeService.changeTargetCubeInstructorProp(index, 'representative', false);
      }
    });

    cubeService.changeTargetCubeInstructorProp(
      cubeService.cubeInstructors.findIndex((target) => target.id === instructor.id),
      name,
      value
    );
  }

  onDeleteInstructor(instructor: CubeInstructorModel): void {
    const { cubeService } = this.injected;
    cubeService.deleteTargetCubeInstructor(
      cubeService.cubeInstructors.findIndex((target) => target.id === instructor.id)
    );
  }

  render() {
    //
    const { cubeService, collegeService, cubeDiscussionService, boardService } = this.injected;
    const { cube, cubeCommunity, cubeInstructors, cubeOperator } = cubeService;
    const { readonly, cubeId } = this.props;
    const { board } = boardService;
    const { cubeDiscussion } = cubeDiscussionService;

    return (
      <CubeBasicInfoView
        onChangeCubeProps={this.onChangeCubeProps}
        onHandleCommunityModalOk={this.onHandleCommunityModalOk}
        getFileBoxIdForReference={this.getFileBoxIdForReference}
        onClickCubeImport={this.onClickCubeImport}
        onChangeCubeDescriptionProps={this.onChangeCubeDescriptionProps}
        handleCubeBoardChange={this.handleCubeBoardChange}
        onChangeCubeBoardCountProps={this.onChangeCubeBoardCountProps}
        handleCubeDiscussionChange={this.handleCubeDiscussionChange}
        onChangeCubeDiscussionCountProps={this.onChangeCubeDiscussionCountProps}
        onTextareaChange={this.onTextareaChange}
        setHourAndMinute={this.setHourAndMinute}
        handleManagerListModalOk={this.handleManagerListModalOk}
        onChangeTargetInstructor={this.onChangeTargetInstructor}
        onSelectInstructor={this.onSelectInstructor}
        onDeleteInstructor={this.onDeleteInstructor}
        cubeCommunity={cubeCommunity}
        cube={cube}
        readonly={readonly}
        cubeId={cubeId}
        cubeService={cubeService}
        collegeService={collegeService}
        cubeInstructors={cubeInstructors}
        cubeOperator={cubeOperator}
        cubeDiscussion={cubeDiscussion}
        board={board}
      />
    );
  }
}

export default withRouter(CubeBasicInfoContainer);
