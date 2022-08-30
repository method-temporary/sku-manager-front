import React from 'react';
import { observer } from 'mobx-react';
import { DropdownProps } from 'semantic-ui-react';

import { SubActions } from 'shared/components';
import { LimitSelect } from 'shared/ui';

import { getInitCardAdminCount } from '_data/lecture/cards/model/CardAdminCount';

import CardApprovalListStore from '../CardApprovalList.store';
import { useFindCardApprovalCount } from '../CardApproval.hook';

const CardApprovalSubActions = observer(() => {
  //
  const { limit, cardApprovalRdo, setLimit, setCardApprovalRdo } = CardApprovalListStore.instance;

  const { data } = useFindCardApprovalCount(cardApprovalRdo);
  const { cardStateCount, totalCardCount } = data || getInitCardAdminCount();

  const onChangeLimit = (_e: React.SyntheticEvent<HTMLElement>, data: DropdownProps) => {
    //
    setLimit(data.value as number);
    setCardApprovalRdo();
  };

  return (
    <SubActions>
      <SubActions.Left>
        <SubActions.Count>
          <strong>{totalCardCount}</strong> 개 | 승인요청 <strong>{cardStateCount.openApprovalCount}</strong>개 / 승인
          <strong>{cardStateCount.openedCount}</strong> 개 / 반려 <strong>{cardStateCount.rejectedCount}</strong>개
        </SubActions.Count>
      </SubActions.Left>
      <SubActions.Right>
        <LimitSelect limit={limit} onChange={onChangeLimit} />
      </SubActions.Right>
    </SubActions>
  );
});

export default CardApprovalSubActions;
