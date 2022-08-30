import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { Container } from 'semantic-ui-react';
import { CardStudentResultSearchBox } from './components/CardStudentResultSearchBox';
import { CardStudentResultList } from './components/CardStudentResultList';
import { useParams } from 'react-router';
import CardStudentResultStore from './CardStudentResult.store';
import { CardStudentResultPagination } from './components/CardStudentResultPagination';
import { CardStudentResultBottomSubActions } from './components/CardStudentResultBottomSubActions';
import { CardStudentResultTopSubActions } from './components/CardStudenResultTopSubActions';
import { useFindCardStudentForAdminResult } from './CardStudentResult.hook';
import { useFindCardById } from '../../list/CardList.hook';
import { ResultManagementModalContainer } from '../../../lecture/student/ui/logic/ResultManagementModalContainter';
import { setResultManagementViewModel } from '../../../student/store/ResultManagementStore';
import { getEmptyResultManagementViewModel } from '../../../student/viewModel/ResultManagementViewModel';

interface Params {
  cineroomId: string;
  cardId: string;
}

export const CardStudentResultPage = observer(() => {
  //
  const params = useParams<Params>();

  const { initializeCardStudentResultQuery, setParams } = CardStudentResultStore.instance;

  const { data: card } = useFindCardById(params.cardId);

  useEffect(() => {
    setResultManagementViewModel(getEmptyResultManagementViewModel());
  }, []);

  useEffect(() => {
    initializeCardStudentResultQuery(card);
    setParams();
  }, [card, initializeCardStudentResultQuery, setParams]);

  return (
    <Container fluid>
      <CardStudentResultSearchBox />
      <CardStudentResultTopSubActions />
      <CardStudentResultList />
      <CardStudentResultBottomSubActions />
      <CardStudentResultPagination />
      <ResultManagementModalContainer />
    </Container>
  );
});
