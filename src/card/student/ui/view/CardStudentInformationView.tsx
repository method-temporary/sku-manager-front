import React from 'react';
import { Checkbox, Form, Icon, Table } from 'semantic-ui-react';
import moment from 'moment';

import { reactAutobind } from '@nara.platform/accent';

import { getPolyglotToAnyString } from 'shared/components/Polyglot';

import { LearningState } from '../../../../lecture/student/model/LearningState';
import { StudentWithUserIdentity } from '../../../../student/model/StudentWithUserIdentity';
import { displayResultLearningState } from '../logic/CardStudentHepler';

interface Props {
  //
  startNo: number;
  students: StudentWithUserIdentity[];
  selectedIds: string[];
  checkAll: (value: any) => void;
  checkOne: (value: StudentWithUserIdentity) => void;
}

@reactAutobind
class CardStudentInformationView extends React.Component<Props> {
  //
  render() {
    //
    const { students, selectedIds, startNo, checkAll, checkOne } = this.props;

    return (
      <div className="scrolling-contents">
        <Table celled className="scrolling-table-student">
          <colgroup>
            {/*<col width="5%" />*/}
            {/*<col width="5%" />*/}
            {/*<col width="10%" />*/}
            {/*<col width="10%" />*/}
            {/*<col width="15%" />*/}
            {/*<col width="10%" />*/}
            {/*<col width="10%" />*/}
            {/*<col width="10%" />*/}
            {/*<col width="10%" />*/}
            {/*<col width="10%" />*/}
            {/*<col width="10%" />*/}
            {/*<col width="5%" />*/}
          </colgroup>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell textAlign="center">
                <Form.Field
                  control={Checkbox}
                  checked={selectedIds.length > 0 && selectedIds.length === students.length}
                  onChange={(e: any, data: any) => checkAll(data.checked)}
                />
              </Table.HeaderCell>
              <Table.HeaderCell textAlign="center">No</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">소속사</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">소속 조직(팀)</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">성명</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">직책</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">E-mail</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">신청일</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">완료 Phase</Table.HeaderCell>
              {/* <Table.HeaderCell textAlign="center">Stamp 획득 여부</Table.HeaderCell> */}
              <Table.HeaderCell textAlign="center">이수 여부</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">이수일</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">재직여부</Table.HeaderCell>
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
                        value={student.email}
                        checked={selectedIds.includes(student.id)}
                        onChange={(e: any, data: any) => checkOne(studentWiths)}
                      />
                    </Table.Cell>
                    <Table.Cell textAlign="center">{startNo - index}</Table.Cell>
                    <Table.Cell textAlign="center">{getPolyglotToAnyString(userIdentity.companyName)}</Table.Cell>
                    <Table.Cell textAlign="center">{getPolyglotToAnyString(userIdentity.departmentName)}</Table.Cell>
                    <Table.Cell textAlign="center">{student.name}</Table.Cell>
                    <Table.Cell textAlign="center">{studentWiths.userIdentity.duty}</Table.Cell>
                    <Table.Cell textAlign="center">{userIdentity.email}</Table.Cell>
                    {/*<Table.Cell textAlign="center">*/}
                    {/*  {moment(student.creationTime).format('YYYY.MM.DD HH:mm:ss')}*/}
                    {/*</Table.Cell>*/}
                    <Table.Cell textAlign="center">
                      {moment(student.registeredTime).format('YYYY.MM.DD HH:mm:ss') || '-'}
                    </Table.Cell>
                    <Table.Cell textAlign="center">
                      {student.completePhaseCount} / {student.phaseCount}
                    </Table.Cell>
                    {/* {
                      student && student.stamped ? (
                        <Table.Cell textAlign="center">Y</Table.Cell>
                      ) : (
                        <Table.Cell textAlign="center">N</Table.Cell>
                      )
                    } */}
                    {(student && student.learningState === LearningState.Passed && (
                      <>
                        <Table.Cell textAlign="center">{displayResultLearningState(student.learningState)}</Table.Cell>
                        {/*<Table.Cell textAlign="center">{this.changeDateToString(new Date(student.updateTimeForTest))}</Table.Cell>*/}
                        <Table.Cell textAlign="center">
                          {moment(student.modifiedTime).format('YYYY.MM.DD HH:mm:ss') || '-'}
                        </Table.Cell>
                      </>
                    )) ||
                      (student && student.learningState === LearningState.NoShow && (
                        <>
                          <Table.Cell textAlign="center">
                            {displayResultLearningState(student.learningState)}
                          </Table.Cell>
                          {/*<Table.Cell textAlign="center">{this.changeDateToString(new Date(student.updateTimeForTest))}</Table.Cell>*/}
                          <Table.Cell textAlign="center">
                            {moment(student.modifiedTime).format('YYYY.MM.DD HH:mm:ss') || '-'}
                          </Table.Cell>
                        </>
                      )) ||
                      (student && student.learningState === LearningState.Missed && (
                        <>
                          <Table.Cell textAlign="center">
                            {displayResultLearningState(student.learningState)}
                          </Table.Cell>
                          {/*<Table.Cell textAlign="center">{this.changeDateToString(new Date(student.updateTimeForTest))}</Table.Cell>*/}
                          <Table.Cell textAlign="center">
                            {moment(student.passedTime).format('YYYY.MM.DD HH:mm:ss') || '-'}
                          </Table.Cell>
                        </>
                      )) || (
                        <>
                          <Table.Cell textAlign="center">
                            {displayResultLearningState(student.learningState)}
                          </Table.Cell>
                          {/*<Table.Cell textAlign="center"></Table.Cell>*/}
                          <Table.Cell textAlign="center" />
                        </>
                      )}
                    <Table.Cell textAlign="center">
                      {userIdentity && userIdentity.id && userIdentity.id !== '' ? 'Y' : 'N'}
                    </Table.Cell>
                  </Table.Row>
                );
              })) || (
              <Table.Row>
                <Table.Cell textAlign="center" colSpan={11}>
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
export default CardStudentInformationView;
