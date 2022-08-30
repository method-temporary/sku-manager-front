import React from 'react';
import { observer } from 'mobx-react';
import { reactAutobind } from '@nara.platform/accent';
import { Table } from 'semantic-ui-react';

import { FormTable } from 'shared/components';

import { CardService } from '../../index';
import CardCubeListModal from '../logic/CardCubeListModal';
import { LearningContentModel } from '../../../../_data/lecture/cards/model/vo/LearningContentModel';
import CardLearningContentsView from './CardLearningContentsView';
import { CubeWithReactiveModel } from '../../../../cube/cube';
import DiscussionModal from '../../../../discussion/ui/logic/DiscussionModal';
import Discussion from '../../../../discussion/model/Discussion';
import { CardThumbnailSelectView } from './CardThumbnailSelectView';

interface Props {
  isUpdatable: boolean;
  cineroomId: string;
  cardService: CardService;
  // onClickAddDiscussion: () => void;
  onClickAddDiscussion: (discussion: Discussion, index: number, pIndex: number) => void;
  onClickDeleteLearningContents: (index: number) => void;
  onClickSortLearningContents: (learningContentModel: LearningContentModel, seq: number, newSeq: number) => void;
  onClickCubeListOk: (cubes: CubeWithReactiveModel[], cubeIds: string[]) => boolean;
}

@observer
@reactAutobind
class CardLearningInfoView extends React.Component<Props> {
  //
  render() {
    //
    const {
      isUpdatable,
      cardService,
      onClickAddDiscussion,
      onClickDeleteLearningContents,
      onClickSortLearningContents,
      onClickCubeListOk,
    } = this.props;

    const { cardContentsQuery } = cardService;

    return (
      <FormTable title="Chapter / Cube / Talk List 정보">
        {/* 2021. 04. 19. 박종유 승인일 때에도 수정 가능으로 인한 조건 제거*/}
        {/*{isUpdatable && cardService.cardQuery.cardState !== CardState.Opened ? (*/}
        {isUpdatable ? (
          <FormTable.Row
            name="Chapter / Cube / Talk"
            required
            subText=" 등록된 Cube를 변경하는 경우 이수 처리 오류 및 학습자 혼선이 생길 수 있습니다. 사전 학습자 공지를 반드시 부탁드리며, 수정에 유의하시기 바랍니다."
          >
            <div>
              <CardCubeListModal onClickOk={onClickCubeListOk} />
              {/*<Button onClick={onClickAddDiscussion}>Talk 추가</Button>*/}
              <DiscussionModal isUpdatable={isUpdatable} onClickOk={onClickAddDiscussion} cardService={cardService} />
              <span className="span-information">Cube 선택 후 Chapter를 추가 할 수 있습니다.</span>
            </div>
            {cardContentsQuery.learningContents.length > 0 && (
              <CardLearningContentsView
                isUpdatable={isUpdatable}
                cardService={cardService}
                learningContents={cardContentsQuery.learningContents}
                onClickDeleteLearningContents={onClickDeleteLearningContents}
                onClickSortLearningContents={onClickSortLearningContents}
                onClickAddDiscussion={onClickAddDiscussion}
              />
            )}
          </FormTable.Row>
        ) : (
          <Table.Row>
            <Table.Cell colSpan={2}>
              <CardLearningContentsView
                isUpdatable={isUpdatable}
                cardService={cardService}
                learningContents={cardContentsQuery.learningContents}
                onClickDeleteLearningContents={onClickDeleteLearningContents}
                onClickSortLearningContents={onClickSortLearningContents}
                onClickAddDiscussion={onClickAddDiscussion}
              />
            </Table.Cell>
          </Table.Row>
        )}
        <FormTable.Row name="썸네일" required>
          <CardThumbnailSelectView isUpdatable={isUpdatable} />
        </FormTable.Row>
      </FormTable>
    );
  }
}

export default CardLearningInfoView;
