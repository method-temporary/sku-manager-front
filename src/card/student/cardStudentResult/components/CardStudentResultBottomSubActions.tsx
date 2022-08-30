import React from 'react';
import { observer } from 'mobx-react';
import { Button, Grid } from 'semantic-ui-react';
import CardStudentResultStore from '../CardStudentResult.store';
import { displayLearningState, LearningState } from '_data/shared/LearningState';
import { AlertModel, ConfirmModel, confirm, alert } from '../../../../shared/components';
import { useFindCardStudentForAdminResult, useModifyStudentsState } from '../CardStudentResult.hook';
import { StudentLearningStateUdo } from '_data/lecture/students/model/sdo/StudentLearningStateUdo';

export const CardStudentResultBottomSubActions = observer(() => {
  //
  const { selectedCardStudentIds, cardStudentResultParams, setCardStudentSelected, setParams } =
    CardStudentResultStore.instance;
  const { data: students, isLoading, refetch } = useFindCardStudentForAdminResult(cardStudentResultParams);
  const { mutateAsync: modifyStudentsStateMutateAsync } = useModifyStudentsState();

  const onClickModifyStudentsState = (state: LearningState) => {
    //
    // const { studentService } = this.injected;
    // const { selectedIds, selectedStudents } = studentService;
    const displayState = displayLearningState(state);
    //

    if (selectedCardStudentIds.length === 0) {
      alert(AlertModel.getRequiredChoiceAlert('학습자'));
      return;
    }

    const selectedStudents =
      students?.results
        .filter((student) => selectedCardStudentIds.includes(student.student.id))
        .map((student) => student.student) || [];

    for (let i = 0; i < selectedStudents.length; i++) {
      //
      const student = selectedStudents[i];

      if (state === 'Passed' && student.phaseCount !== student.completePhaseCount) {
        alert(AlertModel.getCustomAlert(false, '안내', '카드를 완료하지 못한 학습자가 있습니다.', '확인'));
        return;
      }

      if (state === student.learningState) {
        alert(
          AlertModel.getCustomAlert(
            false,
            '안내',
            `${displayLearningState(state)} 처리된 사용자가 선택되었습니다.`,
            '확인'
          )
        );
        return;
      }
    }

    const udo: StudentLearningStateUdo = {
      studentIds: selectedCardStudentIds,
      learningState: state,
    };

    confirm(
      ConfirmModel.getCustomConfirm(
        `${displayState}처리 요청 안내`,
        `선택하신 학습자를 ${displayState} 처리 하시겠습니까?`,
        false,
        `${displayState}`,
        '취소',
        async () => {
          await modifyStudentsStateMutateAsync(udo);

          await alert(
            AlertModel.getCustomAlert(false, '안내', `정상적으로 ${displayState} 처리 되었습니다.`, '확인', () => {})
          );
        }
      ),
      false
    );
  };

  return (
    <Grid className="list-info">
      <Grid.Row>
        <Grid.Column width={8}>
          <label style={{ color: '#FF0000' }}>
            {`* "이수상태 : 미이수"인 경우 학습 완료시에도 자동 이수처리 되지 않사오니, 반드시 "이수상태 :
                결과처리대기"로 변경 후 학습 참여를 안내해 주세요`}
          </label>
        </Grid.Column>
        <Grid.Column width={8}>
          <div className="right">
            <Button type="button" onClick={() => onClickModifyStudentsState('Passed')}>
              이수
            </Button>
            <Button type="button" onClick={() => onClickModifyStudentsState('Missed')}>
              미이수
            </Button>
            <Button type="button" onClick={() => onClickModifyStudentsState('NoShow')}>
              불참
            </Button>
            <Button type="button" onClick={() => onClickModifyStudentsState('Progress')}>
              결과처리대기
            </Button>
          </div>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
});
