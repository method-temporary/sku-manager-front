import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { Select } from 'semantic-ui-react';
import { useParams } from 'react-router-dom';
import { useFindCardById } from '../../../card/list/CardList.hook';
import { StudentService } from '../../../student';
import { SharedService } from 'shared/present';

interface Props {
  //
  findStudents: () => void;
  paginationKey: string;
}

export const SurveyRoundSelect = observer(({ findStudents, paginationKey }: Props) => {
  //
  const { cardId } = useParams<{ cardId: string }>();
  const { data: card } = useFindCardById(cardId);
  const { studentQuery, changeStudentQueryProps } = StudentService.instance;

  useEffect(() => {
    changeStudentQueryProps('round', null);
  }, []);

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
    const { changeStudentQueryProps } = StudentService.instance;
    const { setPage } = SharedService.instance;

    changeStudentQueryProps('round', value);
    setPage(paginationKey, 1);

    findStudents();
  };

  return (
    <Select
      className="ui small-border dropdown m0"
      value={studentQuery.round}
      placeholder="전체"
      options={countRound()}
      onChange={(e: any, data: any) => changeRound(data.value)}
    />
  );
});
