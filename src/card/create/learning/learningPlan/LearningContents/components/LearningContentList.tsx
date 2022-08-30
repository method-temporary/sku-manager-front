import React from 'react';
import { observer } from 'mobx-react';
import { Button, Table } from 'semantic-ui-react';

import { LearningContentTypeFunc } from '_data/lecture/cards/model/vo';

import LearningContentsStore from '../LearningContents.store';
import LearningContentsCube from './LearningContentsCube';
import { EnrollmentCubeForm } from '../../enrollmentCube/EnrollmentCubeForm';
import { setEnrollmentCubeDetail } from '../../../Learning.util';
import EnrollmentCubeStore from '../../enrollmentCube/EnrollmentCube.store';
import CardCreateStore from '../../../../CardCreate.store';
import DiscussionList from '../../../../../../discussion/shared/components/discussionModal/components/DiscussionList';
import { LearningContentWithOptional } from '../../../LearningContents/model/learningContentWithOptional';
import { LearningContentType } from '../../../../../card/model/vo/LearningContentType';
import { getPolyglotToAnyString } from '../../../../../../shared/components/Polyglot';
import ChapterDescModal from 'card/create/learning/LearningContents/components/ChapterModal/components/ChapterDescModal';
import { SubActions } from '../../../../../../shared/components';
import { findStudentByCubeId } from '../../../../../../_data/lecture/students/api/studentApi';
import { alert, AlertModel } from 'shared/components';

interface Props {
  readonly?: boolean;
}

const LearningContentList = observer(({ readonly }: Props) => {
  //
  const { langSupports } = CardCreateStore.instance;
  const { learningContents, setLearningContents } = LearningContentsStore.instance;
  const { createMode, setCreateMode, selectedCubeId, setSelectedCubeId } = EnrollmentCubeStore.instance;

  const onClickSortButton = (content: LearningContentWithOptional, idx: number, nextIdx: number) => {
    const copiedList = [...learningContents];

    copiedList.splice(idx, 1);
    copiedList.splice(nextIdx, 0, content);

    setLearningContents(copiedList);
  };

  const onClickCubeDetailButton = async (cubeId: string) => {
    await setEnrollmentCubeDetail(cubeId);
    setSelectedCubeId(cubeId);
    setCreateMode(false);
  };

  const getCubeLearningTable = (learningContent: LearningContentWithOptional) => {
    return (
      <>
        <LearningContentsCube learningContent={learningContent} />
        {(selectedCubeId === learningContent.contentId && <EnrollmentCubeForm readonly={readonly} />) ||
          ((learningContent.contentDetailType === 'ELearning' ||
            learningContent.contentDetailType === 'ClassRoomLecture') && (
            <SubActions form>
              <SubActions.Center>
                <Button
                  type="button"
                  icon="angle down"
                  basic
                  onClick={() => onClickCubeDetailButton(learningContent.contentId)}
                />
              </SubActions.Center>
            </SubActions>
          ))}
      </>
    );
  };

  const onClickMinus = async (deleteLearningContent: LearningContentWithOptional, index: number) => {
    //
    if (
      (deleteLearningContent.learningContentType === 'Cube' &&
        deleteLearningContent.contentDetailType === 'ELearning') ||
      deleteLearningContent.contentDetailType === 'ClassRoomLecture'
    ) {
      //
      const cubeIdAndStudentCounts = await findStudentByCubeId([deleteLearningContent.contentId]);

      if (cubeIdAndStudentCounts.length > 0 && cubeIdAndStudentCounts[0].count > 0) {
        //
        alert(AlertModel.getCustomAlert(false, '경고', '학습자가 있는  Cube는 삭제할 수 없습니다.', '확인'));
      } else {
        //
        setLearningContents(
          learningContents.filter((_, idx) => idx !== index).map((learningContent) => learningContent)
        );
      }
    } else {
      //
      setLearningContents(learningContents.filter((_, idx) => idx !== index).map((learningContent) => learningContent));
    }
  };

  return (
    <>
      {learningContents.map((learningContent, index) => {
        return (
          <Table.Row>
            <Table.Cell className="tb-header">
              {learningContent.learningContentType === LearningContentType.Chapter ? (
                <>
                  <span>
                    {LearningContentTypeFunc.learningContentsTypeDisplay(learningContent.learningContentType)}
                  </span>
                  <p>{getPolyglotToAnyString(learningContent.name)}</p>
                  <p>
                    <ChapterDescModal chapter={learningContent} />
                  </p>
                </>
              ) : (
                <p>{`${LearningContentTypeFunc.learningContentsTypeDisplay(learningContent.learningContentType)} ${
                  index + 1
                }`}</p>
              )}
              {!readonly && (
                <div className="action-btn-group">
                  <Button
                    type="button"
                    icon="minus"
                    size="mini"
                    basic
                    onClick={() => onClickMinus(learningContent, index)}
                  />
                  <Button
                    type="button"
                    icon="angle down"
                    size="mini"
                    basic
                    onClick={() => onClickSortButton(learningContent, index, index + 1)}
                    disabled={index === learningContents.length - 1}
                  />
                  <Button
                    type="button"
                    icon="angle up"
                    size="mini"
                    basic
                    onClick={() => onClickSortButton(learningContent, index, index - 1)}
                    disabled={index === 0}
                  />
                </div>
              )}
            </Table.Cell>
            <Table.Cell colSpan={3}>
              <>
                {learningContent.learningContentType === 'Cube' && getCubeLearningTable(learningContent)}
                {learningContent.learningContentType === 'Discussion' && learningContent.cardDiscussion && (
                  <DiscussionList
                    langSupports={langSupports}
                    cardDiscussion={learningContent.cardDiscussion}
                    readonly={readonly}
                  />
                )}
                {learningContent.learningContentType === 'Chapter' &&
                  learningContent.children &&
                  learningContent.children.map((childrenContent) => {
                    if (childrenContent.learningContentType === 'Cube') {
                      //
                      return getCubeLearningTable(childrenContent);
                    } else if (childrenContent.learningContentType === 'Discussion' && childrenContent.cardDiscussion) {
                      //
                      return (
                        <DiscussionList
                          langSupports={langSupports}
                          cardDiscussion={childrenContent.cardDiscussion}
                          readonly={readonly}
                        />
                      );
                    }
                  })}
              </>
            </Table.Cell>
          </Table.Row>
        );
      })}
      {createMode && (
        <Table.Row>
          <Table.Cell className="tb-header">
            <p>{`Cube ${learningContents.length + 1}`}</p>
          </Table.Cell>
          <Table.Cell colSpan={3}>
            <EnrollmentCubeForm readonly={readonly} />
          </Table.Cell>
        </Table.Row>
      )}
    </>
  );
});

export default LearningContentList;
