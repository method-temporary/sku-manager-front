import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { MemberViewModel } from '@nara.drama/approval';
import { alert, AlertModel, confirm, ConfirmModel, SubActions } from '../../../../shared/components';
import { Button } from 'semantic-ui-react';
import { ProposalState } from '../../../../student/model/vo/ProposalState';
import CardStudentStore from '../CardStudent.store';
import { useAccept, useFindCardStudentForAdminStudent, useReject } from '../CardStudent.hooks';
import { useFindCardById } from '../../../list/CardList.hook';
import { useFindStudentCount } from '../../cardStudentResult/CardStudentResult.hook';
import CompanionModal from '../../../../lecture/student/ui/logic/CompanionModal';
import ManagerListModal from 'cube/cube/ui/view/ManagerListModal';
import { useQueryClient } from 'react-query';
import { queryKeys } from 'query/queryKeys';
import CardStudentUploadResultListModal from 'card/student/ui/logic/CardStudentUploadResultListModal';
import { CardStudentRoundChangeModal } from './CardStudentRoundChangeModal';
import { setState } from 'dashBoard/store/DashBoardSentenceRdoStore';

export const CardStudentBottomSubActions = observer(() => {
  //
  const queryClient = useQueryClient();
  const [companionModalWin, setCompanionModalWin] = useState(false);
  const [remark, setRemark] = useState('');

  const {
    cardStudentParams,
    cardStudentQuery,
    cardStudentCountParams,
    selectedCardStudentIds,
    setParams,
    registerCardStudents,
    uploadFailedList,
    setUploadFailedList,
    clearStudentRoundChangeModal,
    setCardStudentSelected,
    setToRound,
    toRounds,
  } = CardStudentStore.instance;
  const { data: students, isLoading } = useFindCardStudentForAdminStudent(cardStudentParams);
  const { data: card } = useFindCardById(cardStudentParams.cardId);
  const { data: studentCount } = useFindStudentCount(cardStudentCountParams);
  const { mutateAsync: acceptMutateAsync } = useAccept();
  const { mutateAsync: rejectMutateAsync } = useReject();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [resultText, setResultText] = useState<string>('');
  const [roundChangeModalOpen, setRoundChangeModalOpen] = useState<boolean>(false);

  const acceptStudents = async (): Promise<void> => {
    //
    const selectedStudents =
      students?.results.filter((studentWiths) => selectedCardStudentIds.includes(studentWiths.student.id)) || [];

    const proposalStateList = selectedStudents?.filter((student) => student.student.proposalState === 'Approved');

    const capacity =
      card?.cardContents.enrollmentCards.find((enrollmentCard) => enrollmentCard.round === cardStudentQuery.round)
        ?.capacity || 0;

    const approvedStudentsCount = studentCount?.proposalStateCount.approvedCount || 0;

    if (selectedCardStudentIds.length < 1) {
      //
      alert(AlertModel.getCustomAlert(false, '안내', '학습자를 선택하세요', '확인', () => {}));
      return;
    }

    if (proposalStateList && proposalStateList.length > 0) {
      alert(AlertModel.getCustomAlert(false, '안내', '이미 처리된 사용자가 선택되었습니다.', '확인', () => {}));
      return;
    }

    if (capacity < approvedStudentsCount + selectedStudents?.length) {
      alert(
        AlertModel.getCustomAlert(
          true,
          '안내',
          `정원이 초과되었습니다 정원(${capacity} 명)/신청(${selectedStudents.length}명)/초과(${
            approvedStudentsCount + selectedStudents.length - capacity
          }명)`,
          '확인',
          () => {}
        )
      );
      return;
    }

    confirm(
      ConfirmModel.getCustomConfirm(
        '승인 요청 안내',
        '선택하신 학습자를 승인 하시겠습니까?',
        false,
        '확인',
        '취소',
        () => {
          acceptStudent();
        }
      ),
      false
    );
  };

  const acceptStudent = async (): Promise<void> => {
    await acceptMutateAsync({
      studentIds: selectedCardStudentIds,
      remark: '',
    });

    alert(AlertModel.getCustomAlert(false, '승인 안내', '선택하신 학습자가 승인 되었습니다.', '확인', () => {}));
  };

  const onOpenCompanion = () => {
    //
    const selectedStudents =
      students?.results.filter((studentWiths) => selectedCardStudentIds.includes(studentWiths.student.id)) || [];

    const rejectedStateList = selectedStudents.filter(
      (student) => student.student.proposalState === ProposalState.Rejected
    );

    if (selectedCardStudentIds.length < 1) {
      //
      alert(AlertModel.getCustomAlert(false, '안내', '학습자를 선택하세요', '확인', () => {}));
      return;
    }

    if (rejectedStateList.length > 0) {
      alert(AlertModel.getCustomAlert(false, '안내', '이미 처리된 사용자가 선택되었습니다.', '확인', () => {}));
      return;
    }

    setCompanionModalWin(true);
  };

  const handleCloseCompanion = async () => {
    //
    setCompanionModalWin(false);
    setParams();
  };

  const rejectStudents = async () => {
    //
    confirm(
      ConfirmModel.getCustomConfirm(
        '반려 요청 안내',
        '선택하신 학습자를 반려 하시겠습니까?',
        false,
        '확인',
        '취소',
        () => {
          rejectMutateAsync({
            studentIds: selectedCardStudentIds,
            remark,
          }).then(() => {
            alert(
              AlertModel.getCustomAlert(false, '반려 안내', '선택하신 학습자가 반려 되었습니다.', '확인', () => {
                setRemark('');
                setCompanionModalWin(false);
              })
            );
          });
        }
      )
    );
  };

  const onChangeStudentApprovalProps = (e: any, message: string): void => {
    setRemark(message);
  };

  const onRegisterStudents = async (_: MemberViewModel, memberList: MemberViewModel[]) => {
    if (!cardStudentQuery.round) {
      alert({
        title: '안내',
        message: '학습자 추가 시, 차수를 선택해 주세요.',
      });
      return;
    }
    /* eslint-disable no-await-in-loop */
    for (const member of memberList) {
      await registerCardStudents(cardStudentParams.cardId, member.email, cardStudentQuery.round);
    }

    const { uploadFailedList } = CardStudentStore.instance;
    if (uploadFailedList.length === 0) {
      alert({
        title: '안내',
        message: `총 ${memberList.length}명  중,  ${memberList.length}명이 등록되었습니다.`,
        onClose: () => {
          queryClient.invalidateQueries(queryKeys.findCardStudentForAdmin_Student(cardStudentParams));
        },
      });
    } else {
      const resultText = `총 ${memberList.length}건 중 ${
        memberList.length - (uploadFailedList && uploadFailedList.length)
      }건 성공 / ${uploadFailedList && uploadFailedList.length}건 실패`;

      setResultText(resultText);
      setModalOpen(true);
    }
  };

  const onCloseModal = () => {
    setUploadFailedList([]);
    setModalOpen(false);
    queryClient.invalidateQueries(queryKeys.findCardStudentForAdmin_Student(cardStudentParams));
  };

  const closeRoundChangeModal = () => {
    //
    setCardStudentSelected([]);
    queryClient.invalidateQueries(queryKeys.findCardStudentForAdmin_Student(cardStudentParams));
    setRoundChangeModalOpen(false);
  };

  const onOpenRoundChangeModal = () => {
    //
    const totalRoundNum = card?.cardContents?.enrollmentCards?.length || 0;

    if (totalRoundNum <= 1) {
      //
      alert(AlertModel.getCustomAlert(false, '안내', '변경 가능한 차수가 없습니다.', '확인', () => {}));
    } else if (!cardStudentQuery.round || cardStudentQuery.round <= 0) {
      //
      alert(AlertModel.getCustomAlert(false, '안내', '차수를 선택하세요', '확인', () => {}));
    } else if (selectedCardStudentIds.length < 1) {
      //
      alert(AlertModel.getCustomAlert(false, '안내', '학습자를 선택하세요', '확인', () => {}));
    } else {
      //
      clearStudentRoundChangeModal();

      setToRound(toRounds[0].value);
      setRoundChangeModalOpen(true);
    }
  };

  return (
    <SubActions>
      <SubActions.Left>
        <ManagerListModal handleOk={onRegisterStudents} buttonName="학습자 추가" multiSelect={true} />
      </SubActions.Left>
      <SubActions.Right>
        <Button onClick={onOpenRoundChangeModal} type="button">
          차수변경
        </Button>
        <Button onClick={acceptStudents} type="button">
          승인
        </Button>
        <Button onClick={onOpenCompanion} type="button">
          반려
        </Button>
      </SubActions.Right>
      <CompanionModal
        open={companionModalWin}
        handleClose={handleCloseCompanion}
        handleOk={rejectStudents}
        onChangeStudentRequestProps={onChangeStudentApprovalProps}
      />
      <CardStudentUploadResultListModal
        open={modalOpen}
        text={resultText}
        failedEmailList={uploadFailedList}
        onClosed={onCloseModal}
      />

      <CardStudentRoundChangeModal open={roundChangeModalOpen} onClose={closeRoundChangeModal} />
    </SubActions>
  );
});
