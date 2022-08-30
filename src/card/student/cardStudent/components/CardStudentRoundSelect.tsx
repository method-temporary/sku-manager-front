import React from 'react';
import { observer } from 'mobx-react';
import { Select } from 'semantic-ui-react';
import CardStudentStore from '../CardStudent.store';
import { useFindCardById } from '../../../list/CardList.hook';

export const CardStudentRoundSelect = observer(() => {
  //
  const { cardStudentParams, cardStudentQuery, setRound, setOffset, setParams, setToRounds } =
    CardStudentStore.instance;
  const { data: card } = useFindCardById(cardStudentParams.cardId);

  const countRound = (): any[] => {
    //
    const roundList: any = [{ key: '전체', text: `전체`, value: null }];

    if (card?.cardContents.enrollmentCards !== null) {
      card?.cardContents.enrollmentCards.forEach((enrollmentCard) => {
        roundList.push({ key: enrollmentCard.round, text: `${enrollmentCard.round}차수`, value: enrollmentCard.round });
      });
    } else {
      roundList.push({ key: '전체', text: `전체`, value: null });
    }

    return roundList;
  };

  const changeRound = async (value: any) => {
    //
    setRound(value);
    changeToRoundList(value);
    setOffset(1);
    setParams();
  };

  // 변경할 차수 리스트 세팅
  const changeToRoundList = (round: number) => {
    //
    const roundList: any = [];

    if (!round) {
      //
      roundList.push({ key: `전체`, text: `전체`, value: null });
    } else if (card?.cardContents.enrollmentCards !== null) {
      //
      card?.cardContents.enrollmentCards.forEach((enrollmentCard) => {
        if (enrollmentCard.round !== round) {
          roundList.push({
            key: enrollmentCard.round,
            text: `${enrollmentCard.round}차수`,
            value: enrollmentCard.round,
          });
        }
      });
    }

    setToRounds(roundList);
  };

  return (
    <Select
      className="ui small-border dropdown m0"
      // value={cardStudentQuery.round}
      placeholder="전체"
      options={countRound()}
      onChange={(e: any, data: any) => changeRound(data.value)}
    />
  );
});
