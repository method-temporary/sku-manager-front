import * as React from 'react';
import { reactAutobind, ReactComponent } from '@nara.platform/accent';
import { inject, observer } from 'mobx-react';
import { Form, Grid, Select } from 'semantic-ui-react';

import { SelectType } from 'shared/model';
import { SharedService } from 'shared/present';
import { Pagination, SearchBox, Loader, SubActions } from 'shared/components';

import { ServiceType } from 'student/model/vo/ServiceType';
import { StudentService } from 'student';
import { StudentQueryModel } from 'student/model/StudentQueryModel';
import { MemberService } from '../../../approval';
import { CubeStudentService } from '../../../cube/cube';
import { ClassroomGroupService, CubeService } from '../../../cube';

import SurveyManagementView from '../view/SurveyManagementView';
import { ExtraTaskType } from '../../../student/model/vo/ExtraTaskType';
import { SurveyRoundSelect } from './SurveyRoundSelect';
import CardDetailStore from '../../../card/detail/CardDetail.store';
import LearningStore from '../../../card/create/learning/Learning.store';

interface Props {
  id: string;
  surveyFormId: string;
  surveyCaseId: string;
  serviceType: ServiceType;
}

interface States {
  pageIndex: number;
}

interface Injected {
  studentService: StudentService;
  sharedService: SharedService;
  memberService: MemberService;
  classroomGroupService: ClassroomGroupService;
  cubeStudentService: CubeStudentService;
  cubeService: CubeService;
}

@inject(
  'studentService',
  'sharedService',
  'memberService',
  'classroomGroupService',
  'cubeService',
  'cubeStudentService'
)
@observer
@reactAutobind
class SurveyManagementContainer extends ReactComponent<Props, States, Injected> {
  //
  paginationKey = 'surveyStudent';

  state = {
    pageIndex: 0,
  };

  async findStudents() {
    //
    const { sharedService, studentService, classroomGroupService, cubeStudentService } = this.injected;
    const { studentEnrollmentType } = LearningStore.instance;
    const { surveyCaseId, serviceType, id } = this.props;
    const { studentQuery, changeStudentQueryProps } = studentService;

    const pageModel = sharedService.getPageModel(this.paginationKey);

    await changeStudentQueryProps('surveyCaseId', surveyCaseId);
    await changeStudentQueryProps('extraTaskType', ExtraTaskType.Survey);

    let totalCount = 0;
    if (serviceType === ServiceType.Card) {
      //
      changeStudentQueryProps('cardId', id);

      if (studentEnrollmentType === 'Enrollment') {
        //
        changeStudentQueryProps('round', studentQuery.round);
      } else {
        changeStudentQueryProps('round', '전체');
      }

      totalCount = await studentService.findCardStudents(pageModel);
    } else {
      const round = classroomGroupService.cubeClassroom.round || 1;
      cubeStudentService.changeStudentQueryProps('round', round);

      const offsetElementList = await studentService.findStudentByCubeRdo(
        StudentQueryModel.asStudentSurveyByCubeRdo(studentQuery, id, pageModel)
      );
      totalCount = offsetElementList.totalCount;
    }

    sharedService.setCount(this.paginationKey, totalCount);

    // await setStudentInfo(studentService.students, studentService, memberService);
  }

  countRound(): any[] {
    //
    const { cube } = this.injected.cubeService;
    const roundList: any = [];

    if (cube && cube.cubeMaterial && cube.cubeMaterial.classrooms && cube.cubeMaterial.classrooms.length > 0) {
      cube.cubeMaterial.classrooms.forEach((classroom, index) => {
        roundList.push({ key: index, text: `${index}차수`, value: index });
      });
    } else {
      roundList.push({ key: 1, text: `${1}차수`, value: 1 });
    }
    return roundList;
  }

  render() {
    const { students, studentQuery, changeStudentQueryProps } = this.injected.studentService;

    const { surveyFormId, surveyCaseId } = this.props;
    const { startNo } = this.injected.sharedService.getPageModel(this.paginationKey);
    const { studentEnrollmentType } = LearningStore.instance;

    return (
      <>
        <SearchBox
          name={this.paginationKey}
          onSearch={this.findStudents}
          queryModel={studentQuery}
          changeProps={changeStudentQueryProps}
        >
          <SearchBox.Group name="교육기간">
            <SearchBox.DatePicker
              startFieldName="period.startDateMoment"
              endFieldName="period.endDateMoment"
              searchButtons
            />
          </SearchBox.Group>
          <SearchBox.Group name="참여여부">
            <SearchBox.Select options={SelectType.surveyAnswered} fieldName="surveyAnswered" placeholder="전체" />
          </SearchBox.Group>
          <SearchBox.Query options={SelectType.searchPartForLearner} searchWordDisabledValues={['', '전체']} />
        </SearchBox>

        {studentEnrollmentType === 'Enrollment' && (
          <SubActions>
            <SubActions.Left>
              <SurveyRoundSelect findStudents={this.findStudents} paginationKey={this.paginationKey} />
            </SubActions.Left>
          </SubActions>
        )}

        <Pagination name={this.paginationKey} onChange={this.findStudents}>
          <Loader>
            <SurveyManagementView
              students={students}
              startNo={startNo}
              surveyCaseId={surveyCaseId}
              surveyId={surveyFormId}
            />
          </Loader>

          <Pagination.Navigator />
        </Pagination>
      </>
    );
  }
}

export default SurveyManagementContainer;
