import React from 'react';
import { Checkbox, Form, Icon, Table } from 'semantic-ui-react';

import { getPolyglotToAnyString } from 'shared/components/Polyglot';

import { BadgeStudentModel } from '../../model/BadgeStudentModel';

interface Props {
  selectAll: string;
  selectedList: string[];
  students: BadgeStudentModel[];
  checkAll: (data: any) => void;
  checkOne: (data: any) => void;
  renderAdditionMailView: (student: BadgeStudentModel) => React.ReactNode;
  renderMissionStateView: (student: BadgeStudentModel) => React.ReactNode;
  totalCardCount: number;
}

class BadgeStudentInformationView extends React.Component<Props> {
  //
  render() {
    //
    const {
      selectAll,
      selectedList,
      students,
      checkAll,
      checkOne,
      renderAdditionMailView,
      renderMissionStateView,
      totalCardCount,
    } = this.props;

    // console.log(students);

    return (
      <Table celled>
        <colgroup>
          <col width="5%" />
          <col width="9%" />
          <col width="10%" />
          <col width="9%" />
          <col width="9%" />
          <col width="9%" />
          <col width="9%" />
          <col width="8%" />
          <col width="8%" />
          <col width="8%" />
          <col width="8%" />
          <col width="8%" />
        </colgroup>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell textAlign="center">
              <Form.Field
                control={Checkbox}
                checked={selectedList.length > 0}
                value={selectAll}
                onChange={(e: any, data: any) => checkAll(data.value)}
              />
            </Table.HeaderCell>
            <Table.HeaderCell textAlign="center">소속사</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">소속조직(팀명)</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">성명</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">E-mail</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">신청일자</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">진도율</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">추가미션 메일발송</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">추가미션 수행</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">발급일자</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">Badge 획득여부</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">재직여부</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {(students &&
            students.length &&
            students.map((student, index) => (
              <Table.Row key={index}>
                <Table.Cell textAlign="center">
                  <Form.Field
                    control={Checkbox}
                    value={student}
                    checked={selectedList.includes(student.id)}
                    disabled={!student.studentInfo?.id}
                    onChange={(e: any, data: any) => checkOne(data.value)}
                  />
                </Table.Cell>
                <Table.Cell textAlign="center">
                  {student.studentInfo?.id ? getPolyglotToAnyString(student.studentInfo.companyName) : '-'}
                </Table.Cell>
                <Table.Cell textAlign="center">
                  {student.studentInfo?.id ? getPolyglotToAnyString(student.studentInfo.departmentName) : '-'}
                </Table.Cell>
                <Table.Cell textAlign="center">
                  {student.studentInfo?.id
                    ? getPolyglotToAnyString(student.studentInfo.name)
                    : getPolyglotToAnyString(student.name)}
                </Table.Cell>
                <Table.Cell textAlign="center">{student.studentInfo?.id ? student.studentInfo.email : '-'}</Table.Cell>
                <Table.Cell textAlign="center">{BadgeStudentModel.formattedIssueRequestTime(student)}</Table.Cell>
                <Table.Cell textAlign="center">
                  {`${student.completedCardIds ? student.completedCardIds.length : 0} / ${totalCardCount}`}
                </Table.Cell>
                <Table.Cell textAlign="center">{renderAdditionMailView(student)}</Table.Cell>
                <Table.Cell textAlign="center">{renderMissionStateView(student)}</Table.Cell>
                <Table.Cell textAlign="center">{BadgeStudentModel.formattedIssuedTime(student)}</Table.Cell>
                <Table.Cell textAlign="center">{BadgeStudentModel.formattedIssuedState(student)}</Table.Cell>
                <Table.Cell textAlign="center">
                  {student.studentInfo && student.studentInfo.id && student.studentInfo.id !== '' ? 'Y' : 'N'}
                </Table.Cell>
              </Table.Row>
            ))) || (
            <Table.Row>
              <Table.Cell textAlign="center" colSpan={12}>
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

export default BadgeStudentInformationView;
