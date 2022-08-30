import React from 'react';
import { observer } from 'mobx-react';
import { Button } from 'semantic-ui-react';

import { reactAutobind } from '@nara.platform/accent';

import { SelectType } from 'shared/model';
import { FormTable, RejectEmailModal } from 'shared/components';
import { getDefaultLanguage, getPolyglotToAnyString } from 'shared/components/Polyglot';
import { HtmlEditor } from 'shared/ui';

import { CardStates } from '../../../../_data/lecture/cards/model/vo/CardStates';
import { CardQueryModel } from '../../model/CardQueryModel';

import { CardContentsQueryModel } from '../../model/CardContentsQueryModel';

interface Props {
  cardQuery: CardQueryModel;
  cardContentsQuery: CardContentsQueryModel;
  changeCardReactedProps: (name: string, value: any) => void;
  approvalInfo: string;
  remark: string;
  onClickRejected: () => void;
  onClickOpened: () => void;
}

@observer
@reactAutobind
class CardApprovalInfoView extends React.Component<Props> {
  //
  render() {
    //
    const {
      cardQuery,
      cardContentsQuery,
      approvalInfo,
      remark,
      onClickRejected,
      onClickOpened,
      changeCardReactedProps,
    } = this.props;

    const nameList = [getPolyglotToAnyString(cardContentsQuery.registrantName)];
    const emailList = [cardContentsQuery.email];

    return (
      <FormTable title="승인 정보">
        <FormTable.Row name="Card 승인 여부">
          {cardQuery && cardQuery.cardState === CardStates.OpenApproval ? (
            <>
              {/*<Button onClick={onClickRejected}>반려</Button>*/}
              <RejectEmailModal
                onShow={() => true}
                onChangeRemark={(e: any, data) => changeCardReactedProps('remark', data)}
                onClickReject={onClickRejected}
                emailList={emailList}
                nameList={nameList}
                cubeTitles={[getPolyglotToAnyString(cardQuery.name, getDefaultLanguage(cardQuery.langSupports))]}
                type={SelectType.mailOptions[4].value}
                isApprovalRoleOwner
              />
              <Button onClick={onClickOpened} primary>
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
    );
  }
}

export default CardApprovalInfoView;
