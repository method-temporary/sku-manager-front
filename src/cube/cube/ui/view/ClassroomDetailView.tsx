import { observer } from 'mobx-react';
import * as React from 'react';
import { ClassroomModel } from '../../../classroom';
import { Form, Input, Table } from 'semantic-ui-react';
import { FormTable } from 'shared/components';
import moment from 'moment';
import { reactAutobind } from '@nara.platform/accent';
import CubeInstructorModel from '../../CubeInstructorModel';

interface Props {
  changeClassroomCdoProps: (index: number, name: string, value: string) => void;
  onClickSurveyForm: (surveyFormId: string) => void;
  //  onClickTest: (paperId: string) => void;

  classrooms: ClassroomModel[];
  cubeInstructors: CubeInstructorModel[];
  type?: string;
  filesMap: Map<string, any>;
  readonly?: boolean;
}

@observer
@reactAutobind
class ClassroomDetailView extends React.Component<Props> {
  //
  compare(classroom1: ClassroomModel, classroom2: ClassroomModel) {
    if (classroom1.round > classroom2.round) return 1;
    return -1;
  }

  render() {
    const { changeClassroomCdoProps } = this.props;
    const { classrooms, cubeInstructors, type } = this.props;

    return (
      <FormTable.Row name="차수정보">
        {classrooms.map((classroom, index) => (
          <FormTable title="" withoutHeader key={index}>
            <FormTable.Row name="차수정보">{classroom.round}</FormTable.Row>
            <FormTable.Row name="신청기간">
              <p>{`${classroom.enrolling.applyingPeriod.startDateObj || moment()} ~ ${
                classroom.enrolling.applyingPeriod.endDateObj || moment()
              }`}</p>
            </FormTable.Row>
            <FormTable.Row name="학습시작일 및 종료일">
              <p>{`${classroom.enrolling.learningPeriod.startDateObj || moment()} ~ ${
                classroom.enrolling.learningPeriod.endDateObj || moment()
              }`}</p>
            </FormTable.Row>
            <FormTable.Row name="교육장소">
              {(classroom && classroom.operation && classroom.operation.location) || ''}
            </FormTable.Row>
            <FormTable.Row name="정원정보">{(classroom && classroom.capacity) || ''}</FormTable.Row>
            <FormTable.Row name="취소가능기간">
              <p>{`${classroom.enrolling.cancellablePeriod.startDateObj || moment()} ~ ${
                classroom.enrolling.cancellablePeriod.endDateObj || moment()
              }`}</p>
            </FormTable.Row>
            <FormTable.Row name="취소시 패널티">
              {type ? (
                <p>{(classroom && classroom.enrolling && classroom.enrolling.cancellationPenalty) || ''}</p>
              ) : (
                <Form.Field
                  fluid
                  control={Input}
                  placeholder="취소 시 패널티 정보를 입력해주세요."
                  value={(classroom && classroom.enrolling && classroom.enrolling.cancellationPenalty) || ''}
                  onChange={(e: any) => changeClassroomCdoProps(index, 'enrolling.cancellationPenalty', e.target.value)}
                />
              )}
            </FormTable.Row>
            <FormTable.Row name="외부과정 URL">
              {classroom && classroom.operation && classroom.operation.siteUrl ? (
                <a href={classroom.operation.siteUrl}>{classroom.operation.siteUrl}</a>
              ) : (
                '-'
              )}
            </FormTable.Row>
            <FormTable.Row name="유/무료 여부">
              <>
                <p>{classroom.freeOfCharge.freeOfCharge ? `무료` : `유료`}</p>
                {classroom.freeOfCharge.freeOfCharge ? <p>{classroom.freeOfCharge.chargeAmount}</p> : null}
              </>
            </FormTable.Row>
            <FormTable.Row name="수강신청 유/무">
              {classroom && classroom.enrolling && classroom.enrolling.enrollingAvailable ? (
                <span>Yes</span>
              ) : (
                <span>No</span>
              )}
            </FormTable.Row>
            <FormTable.Row required name="승인프로세스 여부">
              <p>{classroom.freeOfCharge.approvalProcess ? 'YES' : 'NO'}</p>
            </FormTable.Row>
            <FormTable.Row name="강사 정보">
              {cubeInstructors.length > 0 ? (
                <Table celled>
                  <>
                    <colgroup>
                      <col width="20%" />
                      <col width="12%" />
                      <col width="30%" />
                      <col width="19%" />
                      <col width="19%" />
                    </colgroup>
                  </>
                  <colgroup>
                    <col width="30%" />
                    <col width="30%" />
                    <col width="40%" />
                  </colgroup>
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell textAlign="center">소속</Table.HeaderCell>
                      <Table.HeaderCell textAlign="center">이름</Table.HeaderCell>
                      <Table.HeaderCell textAlign="center">이메일</Table.HeaderCell>
                      <Table.HeaderCell textAlign="center">강의시간</Table.HeaderCell>
                      <Table.HeaderCell textAlign="center">학습인정시간</Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {cubeInstructors.length > 0 &&
                      cubeInstructors
                        .filter((target) => target.round === classroom.round)
                        .map((cubeInstructor, index) => {
                          const company = cubeInstructor.department || cubeInstructor.company || '-';
                          const name = (cubeInstructor.name && cubeInstructor.name) || '-';
                          const email = (cubeInstructor.email && cubeInstructor.email) || '-';
                          return (
                            <Table.Row key={index}>
                              <Table.Cell>{company}</Table.Cell>
                              <Table.Cell>{name}</Table.Cell>
                              <Table.Cell>{email}</Table.Cell>
                              <Table.Cell>
                                {(cubeInstructor.instructorLearningTime && cubeInstructor.instructorLearningTime) ||
                                  '-'}
                                분
                              </Table.Cell>
                              <Table.Cell>{cubeInstructor.lectureTime || '-'} 분</Table.Cell>
                            </Table.Row>
                          );
                        })}
                  </Table.Body>
                </Table>
              ) : (
                '-'
              )}
            </FormTable.Row>
            <FormTable.Row required name="담당자정보">
              {classroom.operation && classroom.operation.operator && classroom.operation.operator.keyString ? (
                <Table celled>
                  <colgroup>
                    <col width="30%" />
                    <col width="30%" />
                    <col width="40%" />
                  </colgroup>
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell textAlign="center">소속</Table.HeaderCell>
                      <Table.HeaderCell textAlign="center">이름</Table.HeaderCell>
                      <Table.HeaderCell textAlign="center">이메일</Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    <Table.Row>
                      <Table.Cell>{classroom.operation.operatorInfo.company}</Table.Cell>
                      <Table.Cell>{classroom.operation.operatorInfo.name}</Table.Cell>
                      <Table.Cell>{classroom.operation.operatorInfo.email}</Table.Cell>
                    </Table.Row>
                  </Table.Body>
                </Table>
              ) : (
                '-'
              )}
            </FormTable.Row>
          </FormTable>
        ))}
      </FormTable.Row>
    );
  }
}

export default ClassroomDetailView;
