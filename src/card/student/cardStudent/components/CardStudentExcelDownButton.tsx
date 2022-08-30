import React, { useCallback, useEffect } from 'react';
import { observer } from 'mobx-react';
import { SubActions } from '../../../../shared/components';
import CardStudentStore from '../CardStudent.store';
import { useFindCardStudentForAdminStudentExcelDown } from '../CardStudent.hooks';
import { parseStudentExcelModel } from '../CardStudent.util';
import { StudentXlsxModel } from '../../../../student/model/StudentXlsxModel';
import XLSX from 'xlsx';
import { getPolyglotToAnyString } from '../../../../shared/components/Polyglot';
import moment from 'moment';
import { useFindCardById } from '../../../list/CardList.hook';

export const CardStudentExcelDownButton = observer(() => {
  //
  const { cardStudentQuery, cardStudentParams } = CardStudentStore.instance;

  const { data: studentsExcel, mutateAsync: cardStudentExcelDownMutate } = useFindCardStudentForAdminStudentExcelDown();
  const { data: card } = useFindCardById(cardStudentParams.cardId);

  useEffect(() => {
    const wbList: StudentXlsxModel[] = [];

    if (!studentsExcel?.results || studentsExcel?.results.length <= 0) {
      return;
    }

    wbList.push(...parseStudentExcelModel(studentsExcel?.results));
    const studentExcel = XLSX.utils.json_to_sheet(wbList);
    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, studentExcel, 'Students');

    const name = getPolyglotToAnyString(card?.card.name);
    const date = moment().format('YYYY-MM-DD_HH:mm:ss');
    const fileName = `${name}.${date}.xlsx`;
    XLSX.writeFile(wb, fileName, { compression: true });
    // return fileName;
  }, [cardStudentExcelDownMutate, studentsExcel]);

  const onClickDownExcel = async (): Promise<any> => {
    //
    await cardStudentExcelDownMutate({
      ...cardStudentQuery,
      offset: 0,
      limit: 9999999,
      round: undefined,
      extraTaskTypes: [...cardStudentQuery.extraTaskTypes],
    });
  };

  return <SubActions.ExcelButton download onClick={onClickDownExcel} />;
});
