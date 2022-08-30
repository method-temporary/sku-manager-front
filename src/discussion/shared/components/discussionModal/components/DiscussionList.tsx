import React from 'react';
import { observer } from 'mobx-react';
import { Table } from 'semantic-ui-react';
import { getPolyglotToString, LangSupport } from 'shared/components/Polyglot';
import { CardDiscussion } from '_data/lecture/cards/model/CardDiscussion';

import DiscussionModal from '../DiscussionModal';
import { onOkDiscussion } from '../../../../../card/create/learning/learningPlan/LearningContents/LearningContents.util';

interface Props {
  //
  langSupports: LangSupport[];
  cardDiscussion: CardDiscussion;
  readonly?: boolean;
}

const DiscussionList = observer(({ langSupports, cardDiscussion, readonly }: Props) => {
  //
  return (
    <Table celled>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Talk 내용</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        <Table.Row className="pointer">
          <DiscussionModal
            langSupports={langSupports}
            discussion={cardDiscussion}
            readonly={readonly}
            trigger={<span>{getPolyglotToString(cardDiscussion.title)}</span>}
            triggerAs="td"
            onOk={onOkDiscussion}
          />
        </Table.Row>
      </Table.Body>
    </Table>
  );
});

export default DiscussionList;
