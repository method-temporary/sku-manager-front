import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { SubActions } from '../../../../shared/components';
import { useFindCardById } from '../../../list/CardList.hook';
import CardStudentResultStore from '../CardStudentResult.store';
import { useFindCardStudentResultForAdminResultExcelDown } from '../CardStudentResult.hook';
import { StudentXlsxModel } from '../../../../student/model/StudentXlsxModel';
import XLSX from 'xlsx';
import { getPolyglotToAnyString } from '../../../../shared/components/Polyglot';
import moment from 'moment';
import { parseStudentResultExcelModel } from '../CardStudentResult.tuil';
import { useFindCardStudentForAdminStudentExcelDown } from '../../cardStudent/CardStudent.hooks';
import { ExtraTaskStatus } from 'student/model/vo/ExtraTaskStatus';
import { ScoringState } from 'student/model/vo/ScoringState';

export const CardStudentResultExcelButton = observer(() => {
  //
  const { cardStudentResultParams, cardStudentResultQuery } = CardStudentResultStore.instance;

  const { data: studentsExcel, mutateAsync: cardStudentExcelDownMutate } =
    useFindCardStudentResultForAdminResultExcelDown();
  const { data: card } = useFindCardById(cardStudentResultParams.cardId);

  useEffect(() => {
    const wbList: StudentXlsxModel[] = [];

    if (!studentsExcel?.results || studentsExcel?.results.length <= 0) {
      return;
    }
    const paperId =
      card?.cardContents.tests && card?.cardContents.tests.length > 0 ? card?.cardContents.tests[0].paperId : ''; // 있거나 없거나 체크    const reportName = '';
    const fileBoxId = card?.cardContents.reportFileBox.fileBoxId;
    const reportName = card?.cardContents.reportFileBox.reportName;
    const surveyId = card?.cardContents.surveyId;

    wbList.push(...parseStudentResultExcelModel(studentsExcel?.results, paperId, reportName, fileBoxId, surveyId));
    const studentExcel = XLSX.utils.json_to_sheet(wbList);
    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, studentExcel, 'Students');

    const name = getPolyglotToAnyString(card?.card.name);
    const date = moment().format('YYYY-MM-DD_HH:mm:ss');
    const fileName = `${name}.${date}.xlsx`;
    XLSX.writeFile(wb, fileName, { compression: true });
    // return fileName;
  }, [cardStudentExcelDownMutate, studentsExcel]);

  const onClickDownExcel = async () => {
    //
    // setExcelParams();

    let extraTaskStatuses: ExtraTaskStatus[] = [];

    if (cardStudentResultQuery.scoringState === ScoringState.Missing) {
      extraTaskStatuses = [ExtraTaskStatus.SAVE];
    } else if (cardStudentResultQuery.scoringState === ScoringState.Scoring) {
      extraTaskStatuses = [ExtraTaskStatus.PASS, ExtraTaskStatus.FAIL];
    } else if (cardStudentResultQuery.scoringState === ScoringState.Waiting) {
      extraTaskStatuses = [ExtraTaskStatus.SUBMIT];
    }

    await cardStudentExcelDownMutate({
      ...cardStudentResultQuery,
      offset: 0,
      limit: 9999999,
      round: undefined,
      extraTaskTypes: [...cardStudentResultQuery.extraTaskTypes],
      extraTaskStatuses,
    });
  };

  return <SubActions.ExcelButton download onClick={onClickDownExcel} />;
});
