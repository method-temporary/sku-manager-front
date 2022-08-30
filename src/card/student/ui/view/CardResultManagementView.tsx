import React from 'react';
import { Checkbox, Form, Icon, Table } from 'semantic-ui-react';
import moment from 'moment';

import { reactAutobind } from '@nara.platform/accent';

import { getPolyglotToAnyString } from 'shared/components/Polyglot';

import { StudentModel } from 'student/model/StudentModel';
import { ExtraWorkState } from 'student/model/vo/ExtraWorkState';
import { StudentWithUserIdentity } from 'student/model/StudentWithUserIdentity';

import { displayResultLearningState } from '../logic/CardStudentHepler';

interface Props {
  //
  startNo: number;
  students: StudentWithUserIdentity[];
  selectedIds: string[];
  surveyId: string;
  checkAll: (value: any) => void;
  checkOne: (value: StudentWithUserIdentity) => void;
  renderExam: (student: StudentModel) => JSX.Element;
  renderReport: (student: StudentModel) => JSX.Element;
}

@reactAutobind
class CardResultManagementView extends React.Component<Props> {
  //
  render() {
    //
    const { startNo, students, selectedIds, surveyId, checkAll, checkOne, renderExam, renderReport } = this.props;

    return (
      <div className="scrolling-contents">
        <Table celled className="scrolling-table-student">
          <colgroup>
            {/*<col width="3%" />*/}
            {/*<col width="4%" />*/}
            {/*<col width="7%" />*/}
            {/*<col width="9%" />*/}
            {/*<col width="7%" />*/}
            {/*<col width="8%" />*/}
            {/*<col width="6%" />*/}
            {/*<col width="6%" />*/}
            {/*<col width="6%" />*/}
            {/*<col width="6%" />*/}
            {/*<col width="6%" />*/}
            {/*<col width="7%" />*/}
            {/*<col width="6%" />*/}
            {/*<col width="4%" />*/}
            {/*<col width="9%" />*/}
            {/*<col width="6%" />*/}
          </colgroup>

          <Table.Header>
            <Table.Row textAlign="center">
              <Table.HeaderCell textAlign="center">
                <Form.Field
                  control={Checkbox}
                  checked={selectedIds && selectedIds.length !== 0 && selectedIds.length === students.length}
                  onChange={(e: any, data: any) => checkAll(data.checked)}
                />
              </Table.HeaderCell>
              <Table.HeaderCell>No</Table.HeaderCell>
              <Table.HeaderCell>소속사</Table.HeaderCell>
              <Table.HeaderCell>소속 조직(팀)</Table.HeaderCell>
              <Table.HeaderCell>성명</Table.HeaderCell>
              <Table.HeaderCell>직책</Table.HeaderCell>
              <Table.HeaderCell>E-mail</Table.HeaderCell>
              <Table.HeaderCell>Test 성적</Table.HeaderCell>
              <Table.HeaderCell>응시횟수</Table.HeaderCell>
              <Table.HeaderCell>Test 확인</Table.HeaderCell>
              <Table.HeaderCell>Report 점수</Table.HeaderCell>
              <Table.HeaderCell>Report 확인</Table.HeaderCell>
              <Table.HeaderCell>완료 Phase</Table.HeaderCell>
              <Table.HeaderCell>Survey 결과</Table.HeaderCell>
              <Table.HeaderCell>이수 여부</Table.HeaderCell>
              <Table.HeaderCell>이수일</Table.HeaderCell>
              <Table.HeaderCell>이수번호</Table.HeaderCell>
              <Table.HeaderCell>최종학습일</Table.HeaderCell>
              <Table.HeaderCell>재직여부</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {(students &&
              students.length &&
              students.map((studentWiths, index) => {
                const { student, userIdentity } = studentWiths;
                return (
                  <Table.Row key={index}>
                    <Table.Cell textAlign="center">
                      <Form.Field
                        control={Checkbox}
                        checked={selectedIds.includes(student.id)}
                        onChange={() => checkOne(studentWiths)}
                      />
                    </Table.Cell>
                    <Table.Cell textAlign="center">{startNo - index}</Table.Cell>
                    <Table.Cell textAlign="center">{getPolyglotToAnyString(userIdentity.companyName)}</Table.Cell>
                    <Table.Cell textAlign="center">{getPolyglotToAnyString(userIdentity.departmentName)}</Table.Cell>
                    <Table.Cell textAlign="center">{student.name}</Table.Cell>
                    <Table.Cell textAlign="center">{studentWiths.userIdentity.duty}</Table.Cell>
                    <Table.Cell textAlign="center">{userIdentity.email}</Table.Cell>
                    {renderExam(student)}
                    {renderReport(student)}
                    <Table.Cell textAlign="center">{`${student.completePhaseCount} / ${student.phaseCount}`}</Table.Cell>
                    <Table.Cell textAlign="center">
                      {surveyId
                        ? student.extraWork.surveyStatus !== null &&
                          (student.extraWork.surveyStatus === ExtraWorkState.Submit ||
                            student.extraWork.surveyStatus === ExtraWorkState.Pass)
                          ? 'Y'
                          : 'N'
                        : '-'}
                    </Table.Cell>
                    <Table.Cell textAlign="center">{displayResultLearningState(student.learningState)}</Table.Cell>{' '}
                    <Table.Cell textAlign="center">
                      {student.passedTime !== 0 ? moment(student.passedTime).format('YYYY.MM.DD HH:mm:ss') : '-'}
                    </Table.Cell>
                    <Table.Cell textAlign="center">{studentWiths.passedNumber || '-'}</Table.Cell>
                    <Table.Cell textAlign="center">
                      {student.modifiedTime !== 0 ? moment(student.modifiedTime).format('YYYY.MM.DD HH:mm:ss') : '-'}
                    </Table.Cell>
                    <Table.Cell textAlign="center">
                      {userIdentity && userIdentity.id && userIdentity.id !== '' ? 'Y' : 'N'}
                    </Table.Cell>
                  </Table.Row>
                );
              })) || (
              <Table.Row>
                <Table.Cell textAlign="center" colSpan={18}>
                  <div className="no-cont-wrap no-contents-icon">
                    <Icon className="no-contents80" />
                    <div className="sr-only">콘텐츠 없음</div>
                    <div className="text">검색 결과를 찾을 수 없습니다.</div>
                  </div>
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      </div>
    );
  }
}

export default CardResultManagementView;
