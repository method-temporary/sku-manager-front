import React from 'react';
import { observer } from 'mobx-react';
import { Checkbox, Form, Icon, Table } from 'semantic-ui-react';
import { getPolyglotToAnyString } from '../../../../shared/components/Polyglot';
import moment from 'moment';
import { LearningState } from '../../../../lecture/student/model/LearningState';
import { displayResultLearningState } from '../../ui/logic/CardStudentHepler';
import { useFindCardStudentForAdminStudent } from '../CardStudent.hooks';
import CardStudentStore from '../CardStudent.store';
import { CardStudentLoader } from './CardStudentLoader';
import { getLearningStateName, getProposalStateName } from '../CardStudent.util';
import { StudentModel } from '../../../../student/model/StudentModel';

export const CardStudentList = observer(() => {
  //
  const { cardStudentParams, selectedCardStudentIds, setCardStudentSelected } = CardStudentStore.instance;
  const { data: students, isLoading } = useFindCardStudentForAdminStudent(cardStudentParams);

  const checkCardStudent = (cardStudentId: string): void => {
    const { selectedCardStudentIds, setCardStudentSelected } = CardStudentStore.instance;
    if (selectedCardStudentIds.includes(cardStudentId)) {
      const ids: string[] = [...selectedCardStudentIds];
      ids.splice(selectedCardStudentIds.indexOf(cardStudentId), 1);
      setCardStudentSelected([...ids]);
    } else {
      const ids: string[] = selectedCardStudentIds.slice();
      setCardStudentSelected([...ids, cardStudentId]);
    }
  };
  //
  const checkAll = (checked: boolean): void => {
    //
    if (checked && students?.results) {
      setCardStudentSelected(students.results.map((student) => student.student.id));
    } else {
      setCardStudentSelected([]);
    }
  };

  const allChecked =
    students && students.results.length > 0 && students.results.length === selectedCardStudentIds.length;

  return (
    <CardStudentLoader active={isLoading}>
      <div className="scrolling-contents">
        <Table celled className="scrolling-table-student">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell textAlign="center">
                <Form.Field
                  control={Checkbox}
                  checked={allChecked}
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
              <Table.HeaderCell textAlign="center">상태</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">완료 Phase</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">이수 여부</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">이수일</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">재직여부</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {(students &&
              students.results &&
              students.results.length &&
              students.results.map((studentWiths, index) => {
                const { student, userIdentity } = studentWiths;

                return (
                  <Table.Row key={index}>
                    <Table.Cell textAlign="center">
                      <Form.Field
                        control={Checkbox}
                        value={student.id}
                        checked={selectedCardStudentIds.includes(student.id)}
                        onChange={() => checkCardStudent(student.id)}
                      />
                    </Table.Cell>
                    <Table.Cell textAlign="center">{students.totalCount - cardStudentParams.offset - index}</Table.Cell>
                    <Table.Cell textAlign="center">
                      {(userIdentity && userIdentity.companyName && getPolyglotToAnyString(userIdentity.companyName)) ||
                        '-'}
                    </Table.Cell>
                    <Table.Cell textAlign="center">
                      {(userIdentity &&
                        userIdentity.departmentName &&
                        getPolyglotToAnyString(userIdentity.departmentName)) ||
                        '-'}
                    </Table.Cell>
                    <Table.Cell textAlign="center">{student.name}</Table.Cell>
                    <Table.Cell textAlign="center">
                      {studentWiths.userIdentity && studentWiths.userIdentity.duty}
                    </Table.Cell>
                    <Table.Cell textAlign="center">{(userIdentity && userIdentity.email) || '-'}</Table.Cell>
                    <Table.Cell textAlign="center">
                      {moment(student.registeredTime).format('YYYY.MM.DD HH:mm:ss') || '-'}
                    </Table.Cell>
                    <Table.Cell textAlign="center">
                      <>{getProposalStateName(student.proposalState, student.learningState)}</>
                    </Table.Cell>
                    <Table.Cell textAlign="center">
                      {student.completePhaseCount} / {student.phaseCount}
                    </Table.Cell>
                    {(student && student.learningState === LearningState.Passed && (
                      <>
                        <Table.Cell textAlign="center">{getLearningStateName(student.learningState)}</Table.Cell>
                        <Table.Cell textAlign="center">
                          {moment(student.modifiedTime).format('YYYY.MM.DD HH:mm:ss') || '-'}
                        </Table.Cell>
                      </>
                    )) ||
                      (student && student.learningState === LearningState.NoShow && (
                        <>
                          <Table.Cell textAlign="center">{getLearningStateName(student.learningState)}</Table.Cell>
                          <Table.Cell textAlign="center">
                            {moment(student.modifiedTime).format('YYYY.MM.DD HH:mm:ss') || '-'}
                          </Table.Cell>
                        </>
                      )) ||
                      (student && student.learningState === LearningState.Missed && (
                        <>
                          <Table.Cell textAlign="center">{getLearningStateName(student.learningState)}</Table.Cell>
                          <Table.Cell textAlign="center">
                            {moment(student.passedTime).format('YYYY.MM.DD HH:mm:ss') || '-'}
                          </Table.Cell>
                        </>
                      )) || (
                        <>
                          <Table.Cell textAlign="center">{getLearningStateName(student.learningState)}</Table.Cell>
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
                <Table.Cell textAlign="center" colSpan={13}>
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
    </CardStudentLoader>
  );
});
