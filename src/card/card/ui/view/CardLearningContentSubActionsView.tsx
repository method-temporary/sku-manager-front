import React from 'react';
import { observer } from 'mobx-react';
import { Button } from 'semantic-ui-react';

import { reactAutobind } from '@nara.platform/accent';

import { getPolyglotToAnyString } from 'shared/components/Polyglot';

import { learningContentsTypeDisplay } from '../logic/CardHelper';
import { LearningContentModel } from '../../../../_data/lecture/cards/model/vo/LearningContentModel';
import { LearningContentType } from '../../model/vo/LearningContentType';
import CardChapterDescriptionModal from './CardChapterDescriptionModal';

interface Props {
  //
  isUpdatable: boolean;
  type: LearningContentType;
  index: number;
  count: number;
  learningContent: LearningContentModel;
  onClickDeleteLearningContents: (index: number) => void;
  onClickSortLearningContents: (contents: LearningContentModel, seq: number, newSeq: number) => void;
}

@observer
@reactAutobind
class CardLearningContentSubActionsView extends React.Component<Props> {
  //
  render() {
    //
    const {
      isUpdatable,
      type,
      index,
      count,
      learningContent,
      onClickDeleteLearningContents,
      onClickSortLearningContents,
    } = this.props;

    return (
      <>
        {type === LearningContentType.Chapter ? (
          <>
            <span>{learningContentsTypeDisplay(type)}</span>
            <p>{getPolyglotToAnyString(learningContent.name)}</p>
            <p>
              <CardChapterDescriptionModal chapter={learningContent} />
            </p>
          </>
        ) : (
          <p>{`${learningContentsTypeDisplay(type)} ${index + 1}`}</p>
        )}
        {/* 2021. 04. 19. 박종유 승인일 때에도 수정 가능으로 인한 조건 제거*/}
        {/*{isUpdatable && cardState !== CardState.Opened && (*/}
        {isUpdatable && (
          <div className="action-btn-group">
            <Button icon="minus" size="mini" basic onClick={() => onClickDeleteLearningContents(index)} />
            {count > 1 ? (
              <>
                <Button
                  icon="angle down"
                  size="mini"
                  basic
                  onClick={() => onClickSortLearningContents(learningContent, index, index + 1)}
                  disabled={index === count - 1}
                />
                <Button
                  icon="angle up"
                  size="mini"
                  basic
                  onClick={() => onClickSortLearningContents(learningContent, index, index - 1)}
                  disabled={index === 0}
                />
              </>
            ) : null}
          </div>
        )}
      </>
    );
  }
}

export default CardLearningContentSubActionsView;
