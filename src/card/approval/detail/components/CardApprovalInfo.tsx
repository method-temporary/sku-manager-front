import React from 'react';
import { observer } from 'mobx-react';
import { Button } from 'semantic-ui-react';

import { FormTable, RejectEmailModal } from 'shared/components';
import { getDefaultLanguage, getPolyglotToAnyString } from 'shared/components/Polyglot';
import { HtmlEditor } from 'shared/ui';

import { CardStates } from '_data/lecture/cards/model/vo';

import CardDetailStore from '../../../detail/CardDetail.store';
import CardCreateStore from '../../../create/CardCreate.store';
import CardApprovalDetailStore from '../CardApprovalDetail.store';

interface Props {
  //
  onClickOpen: () => void;
  onClickReject: () => void;
}

const CardApprovalInfo = observer(({ onClickOpen, onClickReject }: Props) => {
  //
  const { langSupports, name } = CardCreateStore.instance;
  const { cardState, approvalInfo, registrantName } = CardDetailStore.instance;
  const { email, remark, setNewRemark } = CardApprovalDetailStore.instance;

  return (
    <>
      <FormTable title="승인 정보">
        <FormTable.Row name="Card 승인 여부">
          {cardState === CardStates.OpenApproval ? (
            <>
              <RejectEmailModal
                onShow={() => true}
                onChangeRemark={(name, value) => setNewRemark(value)}
                onClickReject={onClickReject}
                emailList={[email]}
                nameList={[getPolyglotToAnyString(registrantName)]}
                cubeTitles={[getPolyglotToAnyString(name, getDefaultLanguage(langSupports))]}
                type="Course_reject"
                isApprovalRoleOwner
              />
              <Button onClick={onClickOpen} primary>
                승인
              </Button>
            </>
          ) : (
            approvalInfo
          )}
        </FormTable.Row>
        {remark && (
          <FormTable.Row name="반려 사유">
            <HtmlEditor value={remark || ''} readOnly />
          </FormTable.Row>
        )}
      </FormTable>
    </>
  );
});

export default CardApprovalInfo;
