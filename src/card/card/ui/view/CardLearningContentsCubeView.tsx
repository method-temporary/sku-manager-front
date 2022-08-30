import React from 'react';
import { observer } from 'mobx-react';
import { reactAutobind } from '@nara.platform/accent';
import { Table } from 'semantic-ui-react';
import moment from 'moment';

import { PolyglotModel } from 'shared/model';
import { getPolyglotToAnyString } from 'shared/components/Polyglot';

import { LearningContentModel } from '../../../../_data/lecture/cards/model/vo/LearningContentModel';
import CardLearningContentSubActionsView from './CardLearningContentSubActionsView';

interface Props {
  //
  isUpdatable: boolean;
  index: number;
  count: number;
  learningContent: LearningContentModel;
  onClickDeleteLearningContents?: (index: number) => void;
  onClickSortLearningContents?: (contents: LearningContentModel, seq: number, newSeq: number) => void;
}

@observer
@reactAutobind
class CardLearningContentsCubeView extends React.Component<Props> {
  //
  render() {
    //
    const { isUpdatable, index, count, learningContent, onClickDeleteLearningContents, onClickSortLearningContents } =
      this.props;

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
              <col />
              <col width="15%" />
              <col width="15%" />
              <col width="15%" />
              <col width="15%" />
            </colgroup>

            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>제목</Table.HeaderCell>
                <Table.HeaderCell>학습유형</Table.HeaderCell>
                <Table.HeaderCell>Channel</Table.HeaderCell>
                <Table.HeaderCell>등록일자</Table.HeaderCell>
                <Table.HeaderCell>생성자</Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              <Table.Row>
                <Table.Cell>{getPolyglotToAnyString(learningContent.name)}</Table.Cell>
                <Table.Cell>{learningContent.contentDetailType}</Table.Cell>
                <Table.Cell>{learningContent.channel}</Table.Cell>
                <Table.Cell>{moment(learningContent.time).format('YYYY-MM-DD')}</Table.Cell>
                <Table.Cell>{getPolyglotToAnyString(learningContent.registrantName || new PolyglotModel())}</Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        </Table.Cell>
      </Table.Row>
    );
  }
}

export default CardLearningContentsCubeView;
