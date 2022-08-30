import React from 'react';
import { observer } from 'mobx-react';
import { reactAutobind } from '@nara.platform/accent';
import { Table } from 'semantic-ui-react';

import { LearningContentModel } from '../../../../_data/lecture/cards/model/vo/LearningContentModel';
import { LearningContentType } from '../../model/vo/LearningContentType';

import CardLearningContentsCubeView from './CardLearningContentsCubeView';
import CardLearningContentSubActionsView from './CardLearningContentSubActionsView';
import CardLearningContentsDiscussionView from './CardLearningContentsDiscussionView';
import Discussion from '../../../../discussion/model/Discussion';
import { CardService } from 'card/card';

interface Props {
  //
  isUpdatable: boolean;
  index: number;
  count: number;
  cardService: CardService;
  learningContent: LearningContentModel;
  onClickDeleteLearningContents: (index: number) => void;
  onClickSortLearningContents: (contents: LearningContentModel, seq: number, newSeq: number) => void;
  onClickAddDiscussion: (discussion: Discussion, index: number, pIndex: number) => void;
}

@observer
@reactAutobind
class CardLearningContentsChapterView extends React.Component<Props> {
  //
  render() {
    //
    const {
      isUpdatable,
      index,
      count,
      learningContent,
      onClickDeleteLearningContents,
      onClickSortLearningContents,
      onClickAddDiscussion,
      cardService,
    } = this.props;

    return (
      <Table.Row key={index}>
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
        <Table.Cell>
          <Table celled>
            <Table.Body>
              {learningContent.children.map((content, cIndex) =>
                content.learningContentType === LearningContentType.Cube ? (
                  <CardLearningContentsCubeView
                    isUpdatable={isUpdatable}
                    key={cIndex}
                    index={cIndex}
                    count={learningContent.children.length}
                    learningContent={content}
                  />
                ) : (
                  <CardLearningContentsDiscussionView
                    isUpdatable={isUpdatable}
                    key={cIndex}
                    index={cIndex}
                    pIndex={index}
                    cardService={cardService}
                    count={count}
                    learningContent={content}
                    onClickAddDiscussion={onClickAddDiscussion}
                  />
                )
              )}
            </Table.Body>
          </Table>
        </Table.Cell>
      </Table.Row>
    );
  }
}

export default CardLearningContentsChapterView;
