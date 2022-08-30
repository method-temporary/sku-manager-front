import React from 'react';
import { useHistory } from 'react-router-dom';
import { observer } from 'mobx-react';
import { Button, Grid, Pagination, PaginationProps } from 'semantic-ui-react';
import ExclusionManagementTabStore from '../exclusionManagementTab.store';
import {
  useFindAutoEncourageExcludedStudent,
  useRemoveAutoEncourageExcludeStudent,
} from '../exclusionManagementTab.hooks';
import { reactAlert, reactConfirm } from '@nara.platform/accent';
import { ceil } from 'lodash';
import { cardListUrl } from 'card/autoEncourage/utiles';

export const ExclusionTableBottom = observer(() => {
  const { offset, limit, selectedStudents, autoEncourageExcludedStudentParams, setOffset } =
    ExclusionManagementTabStore.instance;

  const { data: excludeStudent } = useFindAutoEncourageExcludedStudent(autoEncourageExcludedStudentParams);
  const { mutate: removeExclusionStudentMutate } = useRemoveAutoEncourageExcludeStudent();

  const history = useHistory();

  const onChangeOffset = (_: React.MouseEvent, data: PaginationProps) => {
    setOffset(data.activePage as number);
  };

  const onDeleteExcludedStudent = () => {
    if (selectedStudents.length === 0) {
      reactAlert({
        title: '삭제 안내',
        message: '삭제할 사용자를 선택해주세요.',
      });
      return;
    }

    reactConfirm({
      title: '삭제 안내',
      message: '선택한 사용자를 삭제하시겠습니까?\n자동독려 대상자로 설정됩니다.',
      onOk: () => removeExclusionStudentMutate(selectedStudents),
    });
  };

  const totalPage = ceil((excludeStudent?.totalCount || 0) / limit);

  const onClickMoveToCardList = () => {
    history.push(cardListUrl());
  };

  return (
    <Grid columns={3} className="list-info">
      <Grid.Row>
        <Grid.Column style={{ paddingLeft: '0px' }}>
          <Button onClick={onDeleteExcludedStudent}>삭제</Button>
        </Grid.Column>
        <Grid.Column>
          <div className="center">
            <Pagination activePage={offset} totalPages={totalPage} onPageChange={onChangeOffset} />
          </div>
        </Grid.Column>
        <Grid.Column>
          <div className="fl-right">
            <Button onClick={onClickMoveToCardList}>목록</Button>
          </div>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
});
