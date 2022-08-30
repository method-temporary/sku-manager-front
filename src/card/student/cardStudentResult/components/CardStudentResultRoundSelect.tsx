import React from 'react';
import { observer } from 'mobx-react';
import { Select } from 'semantic-ui-react';
import CardStudentStore from '../../cardStudent/CardStudent.store';
import CardStudentResultStore from '../CardStudentResult.store';
import { useFindCardById } from '../../../list/CardList.hook';

export const CardStudentResultRoundSelect = observer(() => {
  //
  const { cardStudentResultQuery, cardStudentResultParams, setOffset, setRound, setParams } =
    CardStudentResultStore.instance;
  const { data: card } = useFindCardById(cardStudentResultParams.cardId);

  const countRound = (): any[] => {
    //
    const roundList: any = [{ key: '전체', text: `전체`, value: null }];

    if (card?.cardContents.enrollmentCards !== null) {
      card?.cardContents.enrollmentCards.forEach((enrollmentCard) => {
        roundList.push({ key: enrollmentCard.round, text: `${enrollmentCard.round}차수`, value: enrollmentCard.round });
      });
    }

    return roundList;
  };

  const changeRound = async (value: any) => {
    //
    setRound(value);
    setOffset(1);
    setParams();
  };

  return (
    <Select
      className="ui small-border dropdown m0"
      // value={cardStudentResultQuery.round}
      placeholder="전체"
      options={countRound()}
      onChange={(e: any, data: any) => changeRound(data.value)}
    />
  );
});
