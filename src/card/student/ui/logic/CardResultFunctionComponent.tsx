import React, { useEffect } from 'react';

import { setResultManagementViewModel } from 'student/store/ResultManagementStore';
import { getEmptyResultManagementViewModel } from 'student/viewModel/ResultManagementViewModel';
import { CardResultManagementContainer } from '../../index';
import { CardQueryModel } from '../../../card';
import { CardContentsQueryModel } from '../../../card/model/CardContentsQueryModel';

interface CourseResultManagementContainerProps {
  cardId: string;
  surveyFormId: string;
  surveyCaseId: string;
  cardQuery: CardQueryModel;
  cardContentsQuery: CardContentsQueryModel;
}

export default function CardResultFunctionComponent({
  cardId,
  surveyFormId,
  surveyCaseId,
  cardQuery,
  cardContentsQuery,
}: CourseResultManagementContainerProps) {
  useEffect(() => {
    setResultManagementViewModel(getEmptyResultManagementViewModel());
  }, []);

  return (
    <CardResultManagementContainer
      cardId={cardId}
      surveyFormId={surveyFormId}
      surveyCaseId={surveyCaseId}
      cardQuery={cardQuery}
      cardContentsQuery={cardContentsQuery}
    />
  );
}
