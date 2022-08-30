import React from 'react';
import { observer } from 'mobx-react';
import { reactAutobind } from '@nara.platform/accent';
import { Table } from 'semantic-ui-react';

import { CardService } from '../../index';
import CardChapterModal from '../logic/CardChapterModal';
import { LearningContentModel } from '../../../../_data/lecture/cards/model/vo/LearningContentModel';
import { LearningContentType } from '../../model/vo/LearningContentType';

import CardLearningContentsCubeView from './CardLearningContentsCubeView';
import CardLearningContentsDiscussionView from './CardLearningContentsDiscussionView';
import CardLearningContentsChapterView from './CardLearningContentsChapterView';
import Discussion from '../../../../discussion/model/Discussion';

interface Props {
  isUpdatable: boolean;
  cardService: CardService;
  learningContents: LearningContentModel[];
  onClickDeleteLearningContents: (index: number) => void;
  onClickSortLearningContents: (learningContentModel: LearningContentModel, seq: number, newSeq: number) => void;
  onClickAddDiscussion: (discussion: Discussion, index: number, pIndex: number) => void;
}

@observer
@reactAutobind
class CardLearningContentsView extends React.Component<Props> {
  //
  render() {
    //
    const {
      isUpdatable,
      cardService,
      learningContents,
      onClickDeleteLearningContents,
      onClickSortLearningContents,
      onClickAddDiscussion,
    } = this.props;

    return (
      <Table celled>
        <colgroup>
          <col width="20%" />
          <col width="80%" />
        </colgroup>

        {/* 2021. 04. 19. 박종유 승인일 때에도 수정 가능으로 인한 조건 제거*/}
        {/*{isUpdatable && cardState !== CardState.Opened && (*/}
        {isUpdatable && (
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell colSpan={2}>
                Cube / Talk / Chapter List 정보
                <CardChapterModal cardService={cardService} learningContents={learningContents} />
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
        )}

        <Table.Body>
          {learningContents.map((learningContent, index) => {
            if (learningContent.learningContentType === LearningContentType.Chapter) {
              return (
                <CardLearningContentsChapterView
                  isUpdatable={isUpdatable}
                  key={index}
                  index={index}
                  count={learningContents.length}
                  cardService={cardService}
                  learningContent={learningContent}
                  onClickDeleteLearningContents={onClickDeleteLearningContents}
                  onClickSortLearningContents={onClickSortLearningContents}
                  onClickAddDiscussion={onClickAddDiscussion}
                />
              );
            } else if (learningContent.learningContentType === LearningContentType.Cube) {
              return (
                <CardLearningContentsCubeView
                  isUpdatable={isUpdatable}
                  key={index}
                  index={index}
                  count={learningContents.length}
                  learningContent={learningContent}
                  onClickDeleteLearningContents={onClickDeleteLearningContents}
                  onClickSortLearningContents={onClickSortLearningContents}
                />
              );
            } else {
              return (
                <CardLearningContentsDiscussionView
                  isUpdatable={isUpdatable}
                  key={index}
                  index={index}
                  count={learningContents.length}
                  cardService={cardService}
                  learningContent={learningContent}
                  onClickDeleteLearningContents={onClickDeleteLearningContents}
                  onClickSortLearningContents={onClickSortLearningContents}
                  onClickAddDiscussion={onClickAddDiscussion}
                />
              );
            }
          })}
        </Table.Body>
      </Table>
    );
  }
}

export default CardLearningContentsView;
