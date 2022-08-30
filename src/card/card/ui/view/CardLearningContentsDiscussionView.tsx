import React from 'react';
import { observer } from 'mobx-react';
import { reactAutobind } from '@nara.platform/accent';
import { Table } from 'semantic-ui-react';

import { LearningContentModel } from '../../../../_data/lecture/cards/model/vo/LearningContentModel';

import CardLearningContentSubActionsView from './CardLearningContentSubActionsView';
import DiscussionModal from '../../../../discussion/ui/logic/DiscussionModal';
import Discussion from '../../../../discussion/model/Discussion';
import { CardService } from 'card/card';

interface Props {
  //
  isUpdatable: boolean;
  pIndex?: number;
  index: number;
  count: number;
  cardService: CardService;
  learningContent: LearningContentModel;
  onClickDeleteLearningContents?: (index: number) => void;
  onClickSortLearningContents?: (contents: LearningContentModel, seq: number, newSeq: number) => void;
  onClickAddDiscussion: (discussion: Discussion, index: number, pIndex: number) => void;
}

@observer
@reactAutobind
class CardLearningContentsDiscussionView extends React.Component<Props> {
  //
  render() {
    //
    const {
      isUpdatable,
      pIndex,
      index,
      count,
      cardService,
      learningContent,
      onClickDeleteLearningContents,
      onClickSortLearningContents,
      onClickAddDiscussion,
    } = this.props;

    return (
      <Table.Row key={index}>
        {onClickDeleteLearningContents && onClickSortLearningContents && (
          <Table.Cell>
            <CardLearningContentSubActionsView
              isUpdatable={isUpdatable}
              type={learningContent.learningContentType}
              index={index}
              count={count}
              learningContent={learningContent}
              onClickDeleteLearningContents={onClickDeleteLearningContents}
              onClickSortLearningContents={onClickSortLearningContents}
            />
          </Table.Cell>
        )}
        <Table.Cell>
          <Table celled>
            <colgroup>
              <col width="100%" />
            </colgroup>

            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Talk 내용</Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              <Table.Row>
                {learningContent.discussion ? (
                  <DiscussionModal
                    isUpdatable={isUpdatable}
                    cardService={cardService}
                    index={index}
                    pIndex={pIndex}
                    learningDiscussion={learningContent.discussion}
                    onClickOk={onClickAddDiscussion}
                  />
                ) : (
                  <Table.Cell>{learningContent.name} feedbackId 없음</Table.Cell>
                )}
              </Table.Row>
            </Table.Body>
          </Table>
        </Table.Cell>
      </Table.Row>
    );
  }
}

export default CardLearningContentsDiscussionView;
