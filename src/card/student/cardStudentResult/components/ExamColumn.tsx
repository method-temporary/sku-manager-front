import React from 'react';
import { observer } from 'mobx-react';
import { Button, Table } from 'semantic-ui-react';
import { ExtraWorkState } from '../../../../student/model/vo/ExtraWorkState';
import {
  getResultManagementViewModel,
  setResultManagementViewModel,
} from '../../../../student/store/ResultManagementStore';
import { setStudentLectureId } from '../../../../lecture/student/store/StudentLectureIdStore';
import CardStudentResultStore from '../CardStudentResult.store';
import { useFindCardById } from '../../../list/CardList.hook';
import { useParams } from 'react-router';
import { useFindCardStudentForAdminResult } from '../CardStudentResult.hook';

export const ExamColumn = observer(({ student }) => {
  //
  const { cardId } = useParams<{ cardId: string }>();

  const { setParams, cardStudentResultParams } = CardStudentResultStore.instance;
  const { refetch } = useFindCardStudentForAdminResult(cardStudentResultParams);
  const { data: card } = useFindCardById(cardId);

  const paperId =
    card?.cardContents.tests && card?.cardContents.tests.length > 0 && card?.cardContents.tests[0].paperId;
  const extraWorks = student.extraWork;

  const handleMarkExam = (studentDenizenId: string, lectureId: string, finished: boolean) => {
    const resultManagementViewModel = getResultManagementViewModel();
    if (resultManagementViewModel !== undefined) {
      setResultManagementViewModel({
        ...resultManagementViewModel,
        gradeModalOpen: true,
        gradeFinished: finished,
        onOk: () => {
          setParams();
          refetch();
        },
      });
    }

    setStudentLectureId({
      studentDenizenId,
      lectureId,
    });

    // this.setState({ studentAudienceKey: studentDenizenId });
  };

  const noTestRender = () => {
    return (
      <>
        <Table.Cell textAlign="center">-</Table.Cell>
        <Table.Cell textAlign="center">-</Table.Cell>
        <Table.Cell textAlign="center">-</Table.Cell>
      </>
    );
  };

  const renderForTestStatus = () => {
    if (extraWorks && extraWorks.testStatus && extraWorks.testStatus !== ExtraWorkState.Save) {
      // 시험 제출 상태
      if (extraWorks.testStatus === ExtraWorkState.Submit) {
        return (
          <>
            <Table.Cell textAlign="center" />
            <Table.Cell textAlign="center">{student.studentScore.numberOfTrials}</Table.Cell>
            <Table.Cell textAlign="center">
              <Button
                type="button"
                onClick={() => handleMarkExam(student.patronKey.keyString, student.lectureId, false)}
              >
                채점하기
              </Button>
            </Table.Cell>
          </>
        );
      } else {
        return (
          <>
            <Table.Cell textAlign="center">{student.studentScore.latestScore}</Table.Cell>
            <Table.Cell textAlign="center">{student.studentScore.numberOfTrials}</Table.Cell>
            <Table.Cell textAlign="center">
              <Button
                type="button"
                onClick={() => handleMarkExam(student.patronKey.keyString, student.lectureId, true)}
              >
                결과보기
              </Button>
            </Table.Cell>
          </>
        );
      }
    }

    return (
      <>
        <Table.Cell textAlign="center" />
        {/* <Table.Cell textAlign="center">0</Table.Cell> */}
        <Table.Cell textAlign="center">미응시</Table.Cell>
      </>
    );
  };

  // 시험이 없는 경우
  if (paperId === '') {
    return (
      <>
        <Table.Cell textAlign="center">-</Table.Cell>
        {/* <Table.Cell textAlign="center">-</Table.Cell> */}
        <Table.Cell textAlign="center">-</Table.Cell>
      </>
    );
  }

  if (extraWorks && extraWorks.testStatus && extraWorks.testStatus !== ExtraWorkState.Save) {
    // 시험 제출 상태
    if (extraWorks.testStatus === ExtraWorkState.Submit) {
      return (
        <>
          <Table.Cell textAlign="center" />
          <Table.Cell textAlign="center">{student.studentScore.numberOfTrials}</Table.Cell>
          <Table.Cell textAlign="center">
            <Button type="button" onClick={() => handleMarkExam(student.patronKey.keyString, student.lectureId, false)}>
              채점하기
            </Button>
          </Table.Cell>
        </>
      );
    } else {
      return (
        <>
          <Table.Cell textAlign="center">{student.studentScore.latestScore}</Table.Cell>
          <Table.Cell textAlign="center">{student.studentScore.numberOfTrials}</Table.Cell>
          <Table.Cell textAlign="center">
            <Button type="button" onClick={() => handleMarkExam(student.patronKey.keyString, student.lectureId, true)}>
              결과보기
            </Button>
          </Table.Cell>
        </>
      );
    }
  }

  return <>{paperId === '' ? noTestRender() : renderForTestStatus()}</>;
});
