import React from 'react';
import { observer } from 'mobx-react';
import { Checkbox, Form, Icon, Table } from 'semantic-ui-react';
import CardStudentStore from '../../cardStudent/CardStudent.store';
import { useFindCardStudentForAdminResult } from '../CardStudentResult.hook';
import { getDefaultLanguage, getPolyglotToAnyString } from '../../../../shared/components/Polyglot';
import dayjs from 'dayjs';
import { ExtraWorkState } from '../../../../student/model/vo/ExtraWorkState';
import { displayResultLearningState } from '../../ui/logic/CardStudentHepler';
import CardStudentResultStore from '../CardStudentResult.store';
import { ExamColumn } from './ExamColumn';
import { ReportColumn } from './ReportColumn';
import { CardStudentResultLoader } from './CardStudentResultLoader';
import { getLearningStateName } from '../CardStudentResult.tuil';

export const CardStudentResultList = observer(() => {
  //
  const { cardStudentResultParams, selectedCardStudentIds, setCardStudentSelected } = CardStudentResultStore.instance;
  const { data: students, isLoading } = useFindCardStudentForAdminResult(cardStudentResultParams);

  const checkCardStudent = (cardStudentId: string): void => {
    if (selectedCardStudentIds.includes(cardStudentId)) {
      const ids: string[] = [...selectedCardStudentIds];
      ids.splice(selectedCardStudentIds.indexOf(cardStudentId), 1);
      setCardStudentSelected([...ids]);
    } else {
      const ids: string[] = selectedCardStudentIds.slice();
      setCardStudentSelected([...ids, cardStudentId]);
    }
  };

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
    <CardStudentResultLoader active={isLoading}>
      <div className="scrolling-contents">
        <Table celled className="scrolling-table-student">
          <Table.Header>
            <Table.Row textAlign="center">
              <Table.HeaderCell textAlign="center">
                <Form.Field
                  control={Checkbox}
                  checked={allChecked}
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
                    {/*<Table.Cell textAlign="center">{startNo - index}</Table.Cell>*/}
                    <Table.Cell textAlign="center">
                      {students.totalCount - cardStudentResultParams.offset - index}
                    </Table.Cell>
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
                    <Table.Cell textAlign="center">{userIdentity && userIdentity.email}</Table.Cell>
                    {/*{renderExam(student)}*/}
                    <ExamColumn student={student} />
                    {/*{renderReport(student)}*/}
                    <ReportColumn student={student} />
                    <Table.Cell textAlign="center">{`${student.completePhaseCount} / ${student.phaseCount}`}</Table.Cell>
                    <Table.Cell textAlign="center">
                      {'surveyId'
                        ? student.extraWork.surveyStatus !== null &&
                          (student.extraWork.surveyStatus === ExtraWorkState.Submit ||
                            student.extraWork.surveyStatus === ExtraWorkState.Pass)
                          ? 'Y'
                          : 'N'
                        : '-'}
                    </Table.Cell>
                    <Table.Cell textAlign="center">{getLearningStateName(student.learningState)}</Table.Cell>
                    <Table.Cell textAlign="center">
                      {student.passedTime !== 0 ? dayjs(student.passedTime).format('YYYY.MM.DD HH:mm:ss') : '-'}
                    </Table.Cell>
                    <Table.Cell textAlign="center">{studentWiths.passedNumber || '-'}</Table.Cell>
                    <Table.Cell textAlign="center">
                      {student.modifiedTime !== 0 ? dayjs(student.modifiedTime).format('YYYY.MM.DD HH:mm:ss') : '-'}
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
    </CardStudentResultLoader>
  );
});
