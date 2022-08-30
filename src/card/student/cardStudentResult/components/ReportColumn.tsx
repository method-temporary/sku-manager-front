import React from 'react';
import { observer } from 'mobx-react';
import { getDefaultLanguage, getPolyglotToAnyString } from '../../../../shared/components/Polyglot';
import { Button, Table } from 'semantic-ui-react';
import { ExtraWorkState } from '../../../../student/model/vo/ExtraWorkState';
import { StudentModel } from '../../../../student/model/StudentModel';
import { setReportViewModel } from '../../../../student/store/ReportStore';
import {
  getResultManagementViewModel,
  setResultManagementViewModel,
} from '../../../../student/store/ResultManagementStore';
import { useFindCardById } from '../../../list/CardList.hook';
import { useParams } from 'react-router';
import CardStudentResultStore from '../CardStudentResult.store';
import { useFindCardStudentForAdminResult } from '../CardStudentResult.hook';

export const ReportColumn = observer(({ student }) => {
  //
  const { cardId } = useParams<{ cardId: string }>();

  const { setParams, cardStudentResultParams } = CardStudentResultStore.instance;
  const { refetch } = useFindCardStudentForAdminResult(cardStudentResultParams);
  const { data: card } = useFindCardById(cardId);

  const reportName = getPolyglotToAnyString(card?.cardContents.reportFileBox.reportName);
  const fileBoxId = card?.cardContents.reportFileBox.fileBoxId;

  const extraWorks = student.extraWork;

  const reportModalShow = (student: StudentModel, reportFinished: boolean) => {
    //
    const reportFileBox = card?.cardContents.reportFileBox;
    if (reportFileBox) {
      const homework = {
        reportName: reportFileBox.reportName,
        reportQuestion: reportFileBox.reportQuestion,
        homeworkContent: student.homeworkContent,
        homeworkFileBoxId: student.homeworkFileBoxId,
      };

      setReportViewModel({
        studentId: student.id,
        homework,
        homeworkOperatorComment: student.homeworkOperatorComment,
        homeworkOperatorFileBoxId: student.homeworkOperatorFileBoxId,
        homeworkScore: student.studentScore.homeworkScore,
        homeworkState: student.extraWork.reportStatus,
      });

      const resultManagementViewModel = getResultManagementViewModel();

      if (resultManagementViewModel !== undefined) {
        setResultManagementViewModel({
          ...resultManagementViewModel,
          reportModalOpen: true,
          reportFinished,
          onOk: () => {
            setParams();
            refetch();
          },
        });
      }
    }
  };

  const noReportRender = () => {
    return (
      <>
        <Table.Cell textAlign="center">-</Table.Cell>
        <Table.Cell textAlign="center">-</Table.Cell>
      </>
    );
  };

  const renderForReportStatus = () => {
    if (extraWorks && extraWorks.reportStatus) {
      // 과제 제출 상태
      if (extraWorks.reportStatus === ExtraWorkState.Submit) {
        return (
          <>
            <Table.Cell textAlign="center" />
            <Table.Cell textAlign="center">
              <Button type="button" onClick={() => reportModalShow(student, false)}>
                채점하기
              </Button>
            </Table.Cell>
          </>
        );
      } else {
        return (
          <>
            <Table.Cell textAlign="center">{student.studentScore.homeworkScore}</Table.Cell>
            <Table.Cell textAlign="center">
              <Button type="button" onClick={() => reportModalShow(student, true)}>
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
        <Table.Cell textAlign="center">미제출</Table.Cell>
      </>
    );
  };

  return (
    <>{(reportName === '' || reportName === null) && fileBoxId === '' ? noReportRender() : renderForReportStatus()}</>
  );
});
