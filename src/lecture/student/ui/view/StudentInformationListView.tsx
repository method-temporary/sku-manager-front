import * as React from 'react';
import { observer } from 'mobx-react';
import { Checkbox, Form, Icon, Table } from 'semantic-ui-react';
import moment from 'moment';

import { reactAutobind, ReactComponent } from '@nara.platform/accent';

import { getPolyglotToAnyString } from 'shared/components/Polyglot';

import { StudentModel } from 'student/model/StudentModel';

import { StudentProfileModel } from '../../../../card/student/model/vo/StudentProfileModel';
import { ProposalState } from '../../../../student/model/vo/ProposalState';
import { StudentWithUserIdentity } from '../../../../student/model/StudentWithUserIdentity';

interface Props {
  checkAll: (isChecked: boolean) => void;
  checkOne: (index: number, student: StudentWithUserIdentity, value: boolean) => void;
  handleRejectReasonWin: (e: any, message: string) => void;

  students: StudentWithUserIdentity[];
  selectedList: StudentWithUserIdentity[];
  studentsProfile: Map<string, StudentProfileModel>;
  startNo: number;
}

@observer
@reactAutobind
class StudentInformationListView extends ReactComponent<Props, {}> {
  //

  formatDateTime(timestamp: number) {
    return moment(timestamp).format('YYYY.MM.DD HH:mm:ss') || '-';
  }

  render() {
    //
    const { checkAll, checkOne, handleRejectReasonWin } = this.props;
    const { students, selectedList, studentsProfile, startNo } = this.props;

    const allSelected =
      students.filter((student) => selectedList.map((student) => student.student.id).includes(student.student.id))
        .length === students.length && selectedList.length !== 0;

    return (
      <Table celled>
        <colgroup>
          <col width="5%" />
          <col width="5%" />
          <col width="14%" />
          <col width="14%" />
          <col width="13%" />
          <col width="16%" />
          <col width="8%" />
          <col width="9%" />
          <col width="8%" />
          <col width="8%" />
        </colgroup>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell textAlign="center">
              <Form.Field
                control={Checkbox}
                checked={allSelected}
                onChange={(e: any, data: any) => checkAll(!allSelected)}
              />
            </Table.HeaderCell>
            <Table.HeaderCell textAlign="center">No</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">소속사</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">소속 조직(팀)</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">성명</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">E-mail</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">신청시간</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">상태</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">상태 변경일</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">재직여부</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {(students &&
            students.length &&
            students.map((student, index) => {
              const profile = studentsProfile.get(student.student.patronKey.keyString);
              return (
                <Table.Row key={index}>
                  <Table.Cell textAlign="center">
                    <Form.Field
                      control={Checkbox}
                      // value={student}
                      checked={selectedList.map((student) => student.student.id).includes(student.student.id)}
                      onChange={(e: any, data: any) => checkOne(index, student, data.checked)}
                    />
                  </Table.Cell>
                  <Table.Cell textAlign="center">{startNo - index}</Table.Cell>
                  <Table.Cell textAlign="center">{getPolyglotToAnyString(student.userIdentity.companyName)}</Table.Cell>
                  <Table.Cell textAlign="center">
                    {getPolyglotToAnyString(student.userIdentity.departmentName)}
                  </Table.Cell>
                  <Table.Cell textAlign="center">{student.student.name}</Table.Cell>
                  <Table.Cell textAlign="center">{student.userIdentity.email}</Table.Cell>
                  <Table.Cell textAlign="center">{this.formatDateTime(student.student.registeredTime)}</Table.Cell>
                  <Table.Cell textAlign="center">
                    {/* {(student.student.proposalState === ProposalState.Rejected && (
                      <a
                        href="#"
                        onClick={(e) =>
                          handleRejectReasonWin(
                            e,
                            student.student.joinRequests &&
                              student.student.joinRequests[student.student.joinRequests.length - 1] &&
                              student.student.joinRequests[student.student.joinRequests.length - 1].response &&
                              student.student.joinRequests[student.student.joinRequests.length - 1].response.remark
                          )
                        }
                      >
                        {StudentModel.getStateName(student.student.proposalState, student.student.learningState)}
                      </a>
                    )) || ( */}
                    <>{StudentModel.getStateName(student.student.proposalState, student.student.learningState)}</>
                    {/* )} */}
                  </Table.Cell>
                  <Table.Cell textAlign="center">
                    {(student.student.modifiedTime && this.formatDateTime(student.student.modifiedTime)) || '-'}
                  </Table.Cell>
                  <Table.Cell textAlign="center">
                    {student.userIdentity && student.userIdentity.id && student.userIdentity.id !== '' ? 'Y' : 'N'}
                  </Table.Cell>
                </Table.Row>
              );
            })) || (
            <Table.Row>
              <Table.Cell textAlign="center" colSpan={10}>
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
    );
  }
}

export default StudentInformationListView;
