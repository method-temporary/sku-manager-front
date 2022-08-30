import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Button, Modal } from 'semantic-ui-react';
import QuizPreview from './QuizPreview';
import { MediaService } from 'cube/media';
import CreateQuizTableHeaderContainer from './CreateQuizTableHeaderContainer';
import CreateQuizTableContentContainer from './CreateQuizTableContentContainer';
import CreateQuizTableFooterContainer from './CreateQuizTableFooterContainer';
import { deleteQuiz, registerQuiz } from 'cubetype/quiz/api/QuizApi';
import QuizQuestions, { getEmptyQuizQuestions } from 'cubetype/quiz/model/QuizQuestions';
import QuizMessage from 'cubetype/quiz/model/QuizMessage';
import { reactAlert } from '@nara.platform/accent';
import QuizTableList from 'cubetype/quiz/model/QuizTableList';

interface Props {
  mediaService?: MediaService;
  open: boolean;
  show: (open: boolean) => void;
  findQuizList: () => void;
  updateQuiz?: QuizTableList | null;
}

const CreateQuizModalContainer: React.FC<Props> = ({ open, show, mediaService, findQuizList, updateQuiz }) => {
  const [openPreview, setOpenPreview] = useState<boolean>(false);
  const [previewData, setPreviewData] = useState<QuizTableList>();
  const [previewState, setPreviewState] = useState<boolean>(false);
  const [quizHeaderState, setQuizHeaderState] = useState<{
    showTime: number;
    endTime: number;
    name: string;
    id: string;
  }>();
  const [quizContentState, setQuizContentState] = useState<QuizQuestions[]>();
  const [quizFooterState, setQuizFooterState] = useState<QuizMessage>();
  const mediaServiceQuizIds = mediaService?.media.mediaContents.internalMedias[0].quizIds;

  useEffect(() => {
    if (updateQuiz) {
      RequestUpdateQuizTable(updateQuiz);
      return;
    }
    RequestEmptyQuizTable();
  }, [updateQuiz]);

  const RequestUpdateQuizTable = (modifyQuiz: QuizTableList) => {
    if (modifyQuiz) {
      setQuizHeaderState({
        name: modifyQuiz.name,
        showTime: modifyQuiz.showTime,
        endTime: modifyQuiz.endTime,
        id: modifyQuiz.id,
      });
      setQuizContentState(modifyQuiz.quizQuestions.sort((prev, next) => prev.number - next.number));
      setQuizFooterState({
        message: modifyQuiz.resultAlertMessage.message,
        img: modifyQuiz.resultAlertMessage.img,
      });
      setPreviewData({
        name: modifyQuiz.name,
        showTime: modifyQuiz.showTime,
        endTime: modifyQuiz.endTime,
        id: modifyQuiz.id,
        quizQuestions: modifyQuiz.quizQuestions,
        resultAlertMessage: {
          message: modifyQuiz.resultAlertMessage.message,
          img: modifyQuiz.resultAlertMessage.img,
        },
      });
      setPreviewState(true);
    }
  };

  const RequestEmptyQuizTable = () => {
    setQuizHeaderState({ name: '', endTime: 0, showTime: 0, id: '' });
    setQuizContentState([getEmptyQuizQuestions()]);
    setQuizFooterState({ message: '', img: '' });
    setPreviewState(false);
  };

  const onClosePopup = () => {
    if (openPreview) {
      return;
    }
    findQuizList();
    show(false);
  };

  const onSaveQuizTable = useCallback(async () => {
    if (!mediaService) {
      return;
    }

    if (quizHeaderState && quizContentState && quizFooterState) {
      if (quizHeaderState?.showTime === 0) {
        reactAlert({
          title: '안내',
          message: '노출시간을 확인하세요.',
          onClose: () => setQuizHeaderState({ ...quizHeaderState, showTime: 0 }),
        });
        return;
      }

      const combineData = {
        ...quizHeaderState,
        quizQuestions: quizContentState,
        resultAlertMessage: quizFooterState,
      };

      const emptyAnswerCheck = combineData.quizQuestions.map((quiz, index) => {
        if (quiz.answer && (quiz.type === 'SingleChoice' || quiz.type === 'MultipleChoice')) {
          const NoAnswerCheck = quiz?.quizQuestionItems?.filter((row) => row.answerItem === true).length;
          if (NoAnswerCheck === 0) {
            reactAlert({
              title: '안내',
              message: `${index + 1}번 문항의 정답을 확인해주세요.`,
            });
            return false;
          }
        }
        return quiz;
      });

      if (emptyAnswerCheck.includes(false)) {
        return;
      }

      if (updateQuiz) {
        await registerQuiz(combineData).then(() => {
          const mediaServiceQuizIds = mediaService.media.mediaContents.internalMedias[0].quizIds;
          if (quizHeaderState && mediaServiceQuizIds) {
            mediaServiceQuizIds?.map((id) => id === quizHeaderState?.id && id);
            const newQuizIds = [...mediaService?.media?.mediaContents?.internalMedias];
            mediaService?.setSeletedPanoptos(newQuizIds);
          }
        });
      } else {
        await registerQuiz(combineData).then((res) => {
          const mediaServiceQuizIds = mediaService.media.mediaContents.internalMedias[0].quizIds;
          if (res && mediaServiceQuizIds) {
            if (!quizHeaderState.id) {
              mediaServiceQuizIds.push(res);
              const newQuizIds = [...mediaService?.media?.mediaContents?.internalMedias];
              mediaService?.setSeletedPanoptos(newQuizIds);
              setQuizHeaderState({ ...quizHeaderState, id: mediaServiceQuizIds[mediaServiceQuizIds.length - 1] });
            }
          } else if (mediaServiceQuizIds === null) {
            const quizIds: string[] = [];
            quizIds.push(res);
            mediaService.media.mediaContents.internalMedias[0].quizIds = quizIds;
            mediaService?.setSeletedPanoptos(mediaServiceQuizIds);
          }
        });
      }

      reactAlert({
        title: '',
        message: '저장이 완료 되었습니다.',
        onClose: () => setPreviewState(true),
      });
      setPreviewData({
        name: combineData.name,
        showTime: combineData.showTime,
        endTime: combineData.endTime,
        id: combineData.id,
        quizQuestions: combineData.quizQuestions,
        resultAlertMessage: {
          message: combineData.resultAlertMessage.message,
          img: combineData.resultAlertMessage.img,
        },
      });
    }
    findQuizList();
  }, [quizHeaderState, quizContentState, quizFooterState, updateQuiz]);

  const onDeleteQuizTable = useCallback(async () => {
    // TODO : 개선 후 사용 => 큐브 등록 페이지 / 퀴즈 등록현황 테이블에서 선택한 퀴즈 삭제 API
    // await deleteQuiz(mediaServiceQuizIds[currentQuizIndex]);
    if (!mediaService) {
      return;
    }

    if (updateQuiz) {
      if (mediaServiceQuizIds && mediaServiceQuizIds.length > 0) {
        const currentQuizIndex = mediaServiceQuizIds?.findIndex((id) => id === updateQuiz.id);
        mediaService.media.mediaContents.internalMedias[0].quizIds = mediaServiceQuizIds.filter(
          (_, index) => index !== currentQuizIndex
        );
        mediaService.setSeletedPanoptos(mediaService?.media?.mediaContents?.internalMedias);
      }
    } else {
      if (mediaServiceQuizIds) {
        const currentQuizId = mediaServiceQuizIds[mediaServiceQuizIds.length - 1];
        mediaService.media.mediaContents.internalMedias[0].quizIds = mediaServiceQuizIds.filter(
          (id) => id !== currentQuizId
        );
        mediaService.setSeletedPanoptos(mediaService?.media?.mediaContents?.internalMedias);
      }
    }
    onClosePopup();
  }, [mediaServiceQuizIds]);

  return (
    <Modal size="large" open={open}>
      <Modal.Header>
        영상퀴즈
        <Button type="button" style={{ float: 'right' }} onClick={onClosePopup}>
          Cancel
        </Button>
      </Modal.Header>
      <Modal.Content>
        {/* 교육자료, 노출시간 Start => 고정 테이블 */}
        <CreateQuizTableHeaderContainer quizHeaderState={quizHeaderState} setQuizHeaderState={setQuizHeaderState} />

        {/* 퀴즈영역 테이블 Start => 유형에 따른 변동 */}
        <div style={{ position: 'relative', paddingBottom: '20px', marginBottom: '20px' }}>
          <CreateQuizTableContentContainer
            quizContentState={quizContentState}
            setQuizContentState={setQuizContentState}
          />
        </div>

        {/* 완료메시지 테이블 Start => 고정 테이블 */}
        {/* <CreateQuizTableFooterContainer
          quizFooterState={quizFooterState}
          setQuizFooterState={setQuizFooterState}
        /> */}

        {openPreview && <QuizPreview previewData={previewData} onClose={() => setOpenPreview(false)} />}
      </Modal.Content>
      <Modal.Actions style={{ display: 'flex', justifyContent: 'space-between' }}>
        {(updateQuiz || previewState) && (
          <Button style={{ margin: '0 0 0 22.5px' }} onClick={onDeleteQuizTable} type="button">
            삭제
          </Button>
        )}
        <div style={{ margin: '0 22.5px 0 auto' }}>
          {(updateQuiz || previewState) && (
            <Button style={{ margin: '0 5px 0 0' }} onClick={() => setOpenPreview(true)} type="button">
              미리보기
            </Button>
          )}
          <Button style={{ margin: '0 5px 0 0' }} type="button" onClick={onSaveQuizTable}>
            저장
          </Button>
          <Button style={{ margin: 0 }} type="button" onClick={onClosePopup}>
            닫기
          </Button>
        </div>
      </Modal.Actions>
    </Modal>
  );
};

export default React.memo(CreateQuizModalContainer);
