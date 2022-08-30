import React from 'react';
import { Table, Icon, Form, Checkbox } from 'semantic-ui-react';
import { observer } from 'mobx-react';
import moment from 'moment';

import { reactAutobind, ReactComponent } from '@nara.platform/accent';

import { getPolyglotToAnyString } from 'shared/components/Polyglot';

import { InstructorWithUserIdentity } from '../../model/InstructorWithUserIdentity';

interface Props {
  instructors: InstructorWithUserIdentity[];
  routeToInstructorDetail: (instructorId: string) => void;
  collegesMap: Map<string, string>;
  renderAccountInfo: (instructorWiths: InstructorWithUserIdentity) => JSX.Element;
  checkAll: (value: boolean) => void;
  checkOne: (index: number, value: boolean) => void;
}

@observer
@reactAutobind
class InstructorListView extends ReactComponent<Props> {
  //

  render() {
    //
    const { instructors, routeToInstructorDetail, collegesMap, renderAccountInfo, checkAll, checkOne } = this.props;

    const selectedInstructors = instructors.filter((instructor) => instructor.selected);
    const selectableInstructors = instructors.filter((target) => {
      const { instructor, user } = target;
      return (
        instructor.signedDate == null &&
        !instructor.internal &&
        (!instructor.internal || user.id !== '') &&
        instructor.denizenId !== '' &&
        instructor.denizenId !== null &&
        instructor.accountCreationTime !== null &&
        instructor.accountCreationTime !== 0
      );
    });
    const allChecked = selectedInstructors.length > 0 && selectedInstructors.length === selectableInstructors.length;

    return (
      <>
        <Table celled selectable>
          <colgroup>
            <col width="5%" />
            <col width="5%" />
            <col width="5%" />
            <col width="15%" />
            <col width="15%" />
            <col width="10%" />
            <col width="15%" />
            <col width="10%" />
            <col width="5%" />
            <col width="5%" />
            <col width="10%" />
          </colgroup>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell textAlign="center">
                <Form.Field
                  control={Checkbox}
                  checked={allChecked}
                  onChange={(e: any, data: any) => checkAll(!allChecked)}
                />
              </Table.HeaderCell>
              <Table.HeaderCell textAlign="center">강사구분</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">Category</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">성명</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">소속기관/부서</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">직위</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">Email</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">초대정보</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">등록일자</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">활동여부</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">계정 정보</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {instructors && instructors.length > 0 ? (
              instructors.map((instructorWiths, index) => {
                const { instructor, user, invitation, selected } = instructorWiths;
                const selectable =
                  instructor.signedDate !== null ||
                  instructor.internal ||
                  (instructor.internal && user.id === '') ||
                  instructor.denizenId === '' ||
                  instructor.denizenId === null ||
                  instructor.accountCreationTime === null ||
                  instructor.accountCreationTime === 0;
                return (
                  <Table.Row key={index} onClick={() => routeToInstructorDetail(instructor.id || '')}>
                    <Table.Cell textAlign="center" onClick={(event: any) => event.stopPropagation()}>
                      <Form.Field
                        disabled={selectable}
                        control={Checkbox}
                        checked={selected}
                        onChange={() => checkOne(index, !selected)}
                      />
                    </Table.Cell>
                    <Table.Cell textAlign="center">{instructor.internal ? '사내' : '사외'}</Table.Cell>
                    <Table.Cell textAlign="center">{collegesMap.get(instructor.collegeId)}</Table.Cell>
                    <Table.Cell textAlign="center">
                      {getPolyglotToAnyString(instructor.internal ? instructor.name || user.name : instructor.name) ||
                        '-'}
                    </Table.Cell>
                    <Table.Cell textAlign="center">
                      {instructor.internal
                        ? getPolyglotToAnyString(instructor.organization) ||
                          `${getPolyglotToAnyString(user.companyName)} / ${getPolyglotToAnyString(user.departmentName)}`
                        : getPolyglotToAnyString(instructor.organization) || '-'}
                    </Table.Cell>
                    <Table.Cell textAlign="center">{getPolyglotToAnyString(instructor.position) || '-'}</Table.Cell>
                    <Table.Cell textAlign="center">
                      {instructor.internal ? instructor.email || user.email || '-' : instructor.email || '-'}
                    </Table.Cell>
                    <Table.Cell textAlign="center">
                      {invitation.id
                        ? `${moment(invitation.invitationTime).format('YYYY.MM.DD')} / ${
                            (invitation.byEmail && 'EMAIL') || ''
                          } ${(invitation.bySms && 'SMS') || ''}`
                        : '-'}
                    </Table.Cell>
                    <Table.Cell textAlign="center">{instructor.appointmentDate}</Table.Cell>
                    <Table.Cell textAlign="center">{instructor.resting ? '비활동' : '활동'}</Table.Cell>
                    {renderAccountInfo(instructorWiths)}
                  </Table.Row>
                );
              })
            ) : (
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
      </>
    );
  }
}

export default InstructorListView;
