import React from 'react';
import { observer } from 'mobx-react';
import { Form, Grid, Select } from 'semantic-ui-react';
import CardStudentResultStore from '../CardStudentResult.store';
import { SelectTypeModel } from '../../../../shared/model';
import { useFindCardById } from '../../../list/CardList.hook';

export const ExamAttendanceSearchField = observer(() => {
  //
  const { cardStudentResultQuery, cardStudentResultParams, setExamAttendance } = CardStudentResultStore.instance;
  const { data: card } = useFindCardById(cardStudentResultParams.cardId);

  const getOptions = (): SelectTypeModel[] => {
    //
    const paperId =
      card?.cardContents.tests && card?.cardContents.tests.length > 0 ? card?.cardContents.tests[0].paperId : ''; // 있거나 없거나 체크
    const isReport = card?.cardContents.reportFileBox.report || false; // 있거나 없거나 체크

    let selectTypes: SelectTypeModel[];

    if (paperId === '' && !isReport) {
      selectTypes = [{ key: '1', text: '전체', value: undefined }];
    } else {
      selectTypes = [
        { key: '1', text: '전체', value: undefined },
        { key: '2', text: '응시', value: true },
        { key: '3', text: '미응시', value: false },
      ];
    }

    return selectTypes;
  };

  return (
    <>
      <label>Test 응시여부</label>
      <Form.Field
        control={Select}
        value={cardStudentResultQuery.examAttendance}
        placeholder="전체"
        options={getOptions()}
        onChange={(event: any, data: any) => setExamAttendance(data.value)}
      />
    </>
  );
});
