import * as React from 'react';
import { ClassroomGroupService } from '../../../../cubetype';
import moment from 'moment';
import { inject, observer } from 'mobx-react';

import { PatronType, reactAutobind, ReactComponent } from '@nara.platform/accent';
import { MemberViewModel } from '@nara.drama/approval';

import { CubeType } from 'shared/model';
import { alert, AlertModel } from 'shared/components';
import { getPolyglotToAnyString } from 'shared/components/Polyglot';

import ExamService from '../../../../exam/present/logic/ExamService';
import { SurveyFormService } from '../../../../survey';
import CubeService from '../../../cube/present/logic/CubeService';
import CubeClassroomInfoView from '../view/CubeClassroomInfoView';
import { OperatorModel } from '../../../../community/community/model/OperatorModel';
import CubeMediaContainer from '../../../media/ui/logic/CubeMediaContainer';
import CubeOfficeWebContainer from '../../../officeweb/ui/logic/CubeOfficeWebContainer';
import CubeBoardContainer from '../../../board/board/ui/logic/CubeBoardContainer';
import CubeDiscussionContainer from '../../../cubeDiscussion/ui/logic/CubeDiscussionContainer';
import { ClassroomModel } from 'cube/classroom';
import { addDateValue } from '../../../cube/ui/logic/CubeHelper';
import CubeInstructorModel from '../../../cube/CubeInstructorModel';

interface Props {
  filesMap: Map<string, any>;
  readonly?: boolean;
  cubeId: string;
}

interface States {}

interface Injected {
  classroomGroupService: ClassroomGroupService;
  cubeService: CubeService;
  examService: ExamService;
  surveyFormService: SurveyFormService;
}

@inject('classroomGroupService', 'cubeService', 'examService', 'surveyFormService')
@observer
@reactAutobind
class CubeDetailByTypeContainer extends ReactComponent<Props, States, Injected> {
  //
  componentDidMount() {
    const { classroomGroupService } = this.injected;
    const { cubeId } = this.props;
    classroomGroupService.clearClassroomGroup();
    classroomGroupService.clearClassroom();
    if (!cubeId) {
      this.onChangeTargetClassroomProp(
        classroomGroupService.cubeClassrooms.length - 1,
        'enrolling.applyingPeriod.startDateMoment',
        moment()
      );
    }
  }

  addCubeClassrooms(): void {
    const { classroomGroupService } = this.injected;
    classroomGroupService.addCubeClassrooms(new ClassroomModel());

    classroomGroupService.changeTargetCubeClassroomProps(
      classroomGroupService.cubeClassrooms.length - 1,
      'round',
      classroomGroupService.cubeClassrooms.length
    );

    this.onChangeTargetClassroomProp(
      classroomGroupService.cubeClassrooms.length - 1,
      'enrolling.applyingPeriod.startDateMoment',
      moment()
    );
  }

  onChangeTargetClassroomProp(index: number, name: string, value: any): void {
    //
    const { classroomGroupService } = this.injected;
    classroomGroupService.changeTargetCubeClassroomProps(index, name, value);

    if (name === 'enrolling.applyingPeriod.startDateMoment') {
      const endDateValue = addDateValue(value, 30);
      const learningStartDateValue = addDateValue(value, 31);
      const learningEndDateValue = addDateValue(value, 61);
      const cancellableEndDateValue = addDateValue(value, 29);

      classroomGroupService.changeTargetCubeClassroomProps(
        index,
        'enrolling.applyingPeriod.endDateMoment',
        endDateValue
      );
      classroomGroupService.changeTargetCubeClassroomProps(
        index,
        'enrolling.learningPeriod.startDateMoment',
        learningStartDateValue
      );
      classroomGroupService.changeTargetCubeClassroomProps(
        index,
        'enrolling.learningPeriod.endDateMoment',
        learningEndDateValue
      );
      classroomGroupService.changeTargetCubeClassroomProps(
        index,
        'enrolling.cancellablePeriod.startDateMoment',
        value.startOf('day')
      );
      classroomGroupService.changeTargetCubeClassroomProps(
        index,
        'enrolling.cancellablePeriod.endDateMoment',
        cancellableEndDateValue
      );
    } else if (name === 'enrolling.applyingPeriod.endDateMoment') {
      const learningStartDateValue = addDateValue(value, 1);
      const learningEndDateValue = addDateValue(value, 31);
      const cancellableEndDateValue = addDateValue(value, -1);

      classroomGroupService.changeTargetCubeClassroomProps(
        index,
        'enrolling.learningPeriod.startDateMoment',
        learningStartDateValue
      );
      classroomGroupService.changeTargetCubeClassroomProps(
        index,
        'enrolling.learningPeriod.endDateMoment',
        learningEndDateValue
      );
      classroomGroupService.changeTargetCubeClassroomProps(
        index,
        'enrolling.cancellablePeriod.endDateMoment',
        cancellableEndDateValue
      );
    } else if (name === 'enrolling.learningPeriod.startDateMoment') {
      const learningEndDateValue = addDateValue(value, 31);
      const cancellableEndDateValue = addDateValue(value, -2);

      classroomGroupService.changeTargetCubeClassroomProps(
        index,
        'enrolling.learningPeriod.endDateMoment',
        learningEndDateValue
      );
      classroomGroupService.changeTargetCubeClassroomProps(
        index,
        'enrolling.cancellablePeriod.endDateMoment',
        cancellableEndDateValue
      );
    }
  }

  onRemoveClassroom(index: number) {
    //
    const { classroomGroupService, cubeService } = this.injected;
    classroomGroupService.removeTargetCubeClassroom(index);
    cubeService.deleteTargetCubeInstructor(index);
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
      cubeService.cubeInstructors.findIndex(
        (target) => target.id === instructor.id && target.round === instructor.round
      ),
      name,
      value
    );
  }

  onDeleteInstructor(instructor: CubeInstructorModel): void {
    const { cubeService } = this.injected;
    cubeService.deleteTargetCubeInstructor(
      cubeService.cubeInstructors.findIndex(
        (target) => target.id === instructor.id && target.round === instructor.round
      )
    );
  }

  handleManagerListModalOk(member: MemberViewModel, index: number) {
    //
    const { classroomGroupService } = this.injected;

    const operator = new OperatorModel({
      employeeId: member.employeeId,
      email: member.email,
      company: member.companyCode,
      name: getPolyglotToAnyString(member.name),
      patronKey: { keyString: member.id, patronType: PatronType.Denizen },
    });

    classroomGroupService.changeTargetCubeClassroomProps(index, 'operation.operatorInfo', operator);
  }

  handleEnrollingAvailableChange(index: number, enrollingAvailable: boolean) {
    const { classroomGroupService } = this.injected;
    classroomGroupService.changeTargetCubeClassroomProps(index, 'enrolling.enrollingAvailable', enrollingAvailable);
    if (!enrollingAvailable) {
      classroomGroupService.changeTargetCubeClassroomProps(index, 'freeOfCharge.approvalProcess', false);
    }
    this.setEmailFlagByEnrollingApproval(index);
  }

  setEmailFlagByEnrollingApproval(index: number) {
    const { classroomGroupService } = this.injected;
    const { cubeClassrooms } = classroomGroupService;
    if (cubeClassrooms[index].enrolling.enrollingAvailable && cubeClassrooms[index].freeOfCharge.approvalProcess) {
      classroomGroupService.changeTargetCubeClassroomProps(index, 'freeOfCharge.sendingMail', true);
      alert(
        AlertModel.getCustomAlert(
          false,
          '안내',
          '학습자와 승인권자에게 수강관련 메일이 발송됩니다. \n메일 발송이 필요 없으시면 N으로 변경해주세요.',
          '확인',
          () => {}
        )
      );
    } else {
      classroomGroupService.changeTargetCubeClassroomProps(index, 'freeOfCharge.sendingMail', false);
    }
  }

  render() {
    //
    const { classroomGroupService, cubeService } = this.injected;
    const { cubeClassrooms } = classroomGroupService;
    const { cubeInstructors } = cubeService;
    const { filesMap, readonly } = this.props;
    const cubeType = cubeService.cube.type;

    return (
      <>
        {(cubeType === CubeType.ClassRoomLecture || cubeType === CubeType.ELearning) && (
          <CubeClassroomInfoView
            onRemoveClassroom={this.onRemoveClassroom}
            addCubeClassrooms={this.addCubeClassrooms}
            onChangeTargetClassroomProp={this.onChangeTargetClassroomProp}
            handleEnrollingAvailableChange={this.handleEnrollingAvailableChange}
            setEmailFlagByEnrollingApproval={this.setEmailFlagByEnrollingApproval}
            onChangeTargetInstructor={this.onChangeTargetInstructor}
            onSelectInstructor={this.onSelectInstructor}
            onDeleteInstructor={this.onDeleteInstructor}
            handleManagerListModalOk={this.handleManagerListModalOk}
            cubeInstructors={cubeInstructors}
            filesMap={filesMap}
            classrooms={cubeClassrooms}
            cubeType={cubeType}
            modSuper={!readonly}
          />
        )}
        {(cubeType === CubeType.Audio || cubeType === CubeType.Video) && (
          <CubeMediaContainer cubeType={cubeType} readonly={readonly} />
        )}
        {cubeType === CubeType.Community && <CubeBoardContainer />}
        {(cubeType === CubeType.Documents ||
          cubeType === CubeType.Experiential ||
          cubeType === CubeType.WebPage ||
          cubeType === CubeType.Cohort) && (
          <CubeOfficeWebContainer cubeType={cubeType} filesMap={filesMap} readonly={readonly} />
        )}
        {cubeType === CubeType.Discussion && (
          <CubeDiscussionContainer cubeType={cubeType} filesMap={filesMap} readonly={readonly} />
        )}
      </>
    );
  }
}

export default CubeDetailByTypeContainer;
