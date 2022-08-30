import * as React from 'react';
import { observer } from 'mobx-react';
import { Checkbox, Form, Icon, Table } from 'semantic-ui-react';
import moment from 'moment';

import { reactAutobind, ReactComponent } from '@nara.platform/accent';

import { ProposalState } from 'shared/model';

import { StudentModel } from 'card/student/model/StudentModel';
import { StudentProfileModel } from 'card/student/model/vo/StudentProfileModel';

interface Props {
  checkAll: (isChecked: boolean) => void;
  checkOne: (index: number, student: StudentModel, value: boolean) => void;
  handleRejectReasonWin: (e: any, message: string) => void;

  students: StudentModel[];
  selectedList: StudentModel[];
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
      students.filter((student) => selectedList.map((student) => student.id).includes(student.id)).length ===
      students.length;

    return (
      <Table celled>
        <colgroup>
          <col width="5%" />
          <col width="5%" />
          <col width="16%" />
          <col width="16%" />
          <col width="13%" />
          <col width="20%" />
          <col width="8%" />
          <col width="9%" />
          <col width="8%" />
        </colgroup>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell textAlign="center">
              <Form.Field
                control={Checkbox}
                checked={allSelected}
                onChange={(e: any, data: any) => checkAll(data.value)}
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
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {(students &&
            students.length &&
            students.map((student, index) => {
              const profile = studentsProfile.get(student.patronKey.keyString);

              return (
                <Table.Row key={index}>
                  <Table.Cell textAlign="center">
                    <Form.Field
                      control={Checkbox}
                      // value={student}
                      checked={selectedList.map((student) => student.id).includes(student.id)}
                      onChange={(e: any, data: any) => checkOne(index, student, data.checked)}
                    />
                  </Table.Cell>
                  <Table.Cell textAlign="center">{startNo - index}</Table.Cell>
                  <Table.Cell textAlign="center">{profile?.company}</Table.Cell>
                  <Table.Cell textAlign="center">{profile?.department}</Table.Cell>
                  <Table.Cell textAlign="center">{student.name}</Table.Cell>
                  <Table.Cell textAlign="center">{profile?.email}</Table.Cell>
                  <Table.Cell textAlign="center">{this.formatDateTime(student.creationTime)}</Table.Cell>
                  <Table.Cell textAlign="center">
                    {(student.proposalState === ProposalState.Rejected && (
                      <a
                        href="#"
                        onClick={(e) =>
                          handleRejectReasonWin(
                            e,
                            student.joinRequests &&
                              student.joinRequests[student.joinRequests.length - 1] &&
                              student.joinRequests[student.joinRequests.length - 1].response &&
                              student.joinRequests[student.joinRequests.length - 1].response.remark
                          )
                        }
                      >
                        {StudentModel.getStateName(student.proposalState, student.learningState)}
                      </a>
                    )) || <>{StudentModel.getStateName(student.proposalState, student.learningState)}</>}
                  </Table.Cell>
                  <Table.Cell textAlign="center">{this.formatDateTime(student.updateTime)}</Table.Cell>
                </Table.Row>
              );
            })) || (
            <Table.Row>
              <Table.Cell textAlign="center" colSpan={8}>
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
