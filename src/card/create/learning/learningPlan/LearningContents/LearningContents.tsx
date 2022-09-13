import React from 'react';
import { observer } from 'mobx-react';
import { Button, Table } from 'semantic-ui-react';

import { alert, AlertModel, SubActions } from 'shared/components';

import CubeSelectedModal from 'cube/shaerd/compnents/cubeSelectedModal/CubeSelectedModal';
import CardCreateStore from '../../../CardCreate.store';
import LearningContentList from './components/LearningContentList';
import { getSelectedCubes, onOkCubeSelect, onOkDiscussion } from './LearningContents.util';
import LearningContentsStore from './LearningContents.store';

import DiscussionModal from 'discussion/shared/components/discussionModal/DiscussionModal';

import { initRoundInfo } from '../../Learning.util';
import ChapterModal from '../../LearningContents/components/ChapterModal/ChapterModal';
import { LearningContentWithOptional } from '../../LearningContents/model/learningContentWithOptional';
import EnrollmentCubeStore from '../enrollmentCube/EnrollmentCube.store';
import { CubeWithReactiveModel } from '../../../../../cube/cube';
import LearningStore from '../../Learning.store';

interface Props {
  //
  readonly?: boolean;
}

const LearningContents = observer(({ readonly }: Props) => {
  //
  const { langSupports } = CardCreateStore.instance;
  const { studentEnrollmentType } = LearningStore.instance;
  const { learningContents, setLearningContents } = LearningContentsStore.instance;
  const { setCreateMode, reset } = EnrollmentCubeStore.instance;
  const selectedCubes = getSelectedCubes();

  const onOkChapter = (learningContents: LearningContentWithOptional[]) => {
    //
    setLearningContents(learningContents);
  };

  const onClickCreateCube = () => {
    const { enrollmentCards } = LearningStore.instance;

    if (enrollmentCards.length === 0) {
      //
      alert(
        AlertModel.getCustomAlert(
          true,
          '알림',
          'Classroom / E-learning을 추가하기 위해서는 차수가 최소 1개 이상이여야 합니다.',
          '확인'
        )
      );
      return;
    }

    reset();
    initRoundInfo();
    setCreateMode(true);
  };

  const onOkSelect = async (selectedCubes: CubeWithReactiveModel[]) => {
    await onOkCubeSelect(selectedCubes);
  };

  return (
    <>
      <LearningContentList readonly={readonly} />
      {!readonly && (
        <Table.Row>
          <Table.Cell colSpan={4}>
            <SubActions form>
              <SubActions.Left>
                {studentEnrollmentType === 'Enrollment' && (
                  <Button type="button" onClick={onClickCreateCube}>
                    Classroom / E-learning 추가
                  </Button>
                )}
                {/* Cube 선택 모달 */}
                <CubeSelectedModal selectedCubes={selectedCubes} onOk={onOkSelect} />
                {/* Talk 모달  */}
                {/* <DiscussionModal langSupports={langSupports} onOk={onOkDiscussion} /> */}
              </SubActions.Left>
              <SubActions.Right>
                {learningContents.length !== 0 && (
                  <ChapterModal langSupports={langSupports} learningContents={learningContents} onOk={onOkChapter} />
                )}
              </SubActions.Right>
            </SubActions>
            <p style={{ color: '#ff0000' }}>
              * 등록된 Cube를 변경하는 경우 이수 처리 오류 및 학습자 혼선이 생길 수 있습니다. 사전 학습자 공지를 반드시
              부탁드리며 수정에 유의하시기 바랍니다.
            </p>
            <p style={{ color: '#ff0000' }}>* Cube 선택 후 Chapter를 추가 할 수 있습니다.</p>
          </Table.Cell>
        </Table.Row>
      )}
    </>
  );
});

export default LearningContents;
