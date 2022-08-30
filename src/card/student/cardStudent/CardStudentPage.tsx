import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { Container } from 'semantic-ui-react';
import { CardStudentSearchBox } from './components/CardStudentSearchBox';
import { CardStudentList } from './components/CardStudentList';
import { CardStudentsTopSubActions } from './components/CardStudentsTopSubActions';
import { useParams } from 'react-router';
import { CardStudentPagination } from './components/CardStudentPagination';
import CardStudentStore from './CardStudent.store';
import { useFindCardById } from '../../list/CardList.hook';
import { Loader } from '../../../shared/components';
import { CardStudentBottomSubActions } from './components/CardStudentBottomSubActions';

interface Params {
  cineroomId: string;
  cardId: string;
}

export const CardStudentPage = observer(() => {
  //
  const params = useParams<Params>();

  const { cardStudentParams, initializeCardStudentQuery, setParams } = CardStudentStore.instance;
  const { data: card } = useFindCardById(params.cardId);

  useEffect(() => {
    initializeCardStudentQuery(card);
    setParams();
  }, [card, initializeCardStudentQuery, setParams]);

  return (
    <Loader>
      <Container fluid>
        <CardStudentSearchBox />
        <CardStudentsTopSubActions />
        <CardStudentList />
        {card?.card.studentEnrollmentType === 'Enrollment' && <CardStudentBottomSubActions />}
        <CardStudentPagination />
      </Container>
    </Loader>
  );
});
