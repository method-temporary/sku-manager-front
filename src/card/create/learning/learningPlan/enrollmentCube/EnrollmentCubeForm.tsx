import React from 'react';
import { observer } from 'mobx-react';
import { Button, Table } from 'semantic-ui-react';
import { CubeTypeRow } from './components/CubeTypeRow';
import { CubeMainChannelRow } from './components/CubeMainChannelRow';
import { CubeNameRow } from './components/CubeNameRow';
import { CubeGoalRow } from './components/CubeGoalRow';
import { CubeApplicantRow } from './components/CubeApplicantRow';
import { CubeDescriptionRow } from './components/CubeDescriptionRow';
import { CubeCompletionTermRow } from './components/CubeCompletionTermRow';
import { CubeEtcGuideRow } from './components/CubeEtcGuideRow';
import { CubeTagRow } from './components/CubeTagRow';
import { CubeLearningTimeRow } from './components/CubeLearningTimeRow';
import { CubeDifficultlyRow } from './components/CubeDifficultlyRow';
import { CubeOrganizerRow } from './components/CubeOrganizerRow';
import { CubeInstructorRow } from './components/CubeInstructorRow';
import { CubeOperatorRow } from './components/CubeOperatorRow';
import { CubeLearningPeriodRow } from './components/CubeLearningPeriodRow';
import { CubeLearningLocationRow } from './components/CubeLearningLocationRow';
import { CubeUrlRow } from './components/CubeUrlRow';
import { CubeLearningChargeRow } from './components/CubeLearningChargeRow';
import { SubActions } from '../../../../../shared/components';
import EnrollmentCubeStore from './EnrollmentCube.store';
import { registerCube, updateCube } from './EnrollmentCube.util';
import { setCardInstructors, setCardLearningTime } from '../../CardLearningInfoPage.util';

interface props {
  readonly?: boolean;
}

export const EnrollmentCubeForm = observer(({ readonly }: props) => {
  //
  const { selectedCubeId, reset, createMode } = EnrollmentCubeStore.instance;

  const onClickCancelButton = () => {
    //
    reset();
  };

  const onClickSaveButton = async () => {
    const result =
      (createMode && !selectedCubeId && (await registerCube())) || (selectedCubeId && (await updateCube())) || false;
    // 화면 초기화
    result && reset();
    // card의 강사 세팅
    result && setCardInstructors();
    // Card 학습 시간 설정
    result && setCardLearningTime();
  };

  return (
    <>
      <Table celled>
        <colgroup>
          <col width="30%" />
          <col />
        </colgroup>
        <Table.Body>
          <CubeTypeRow readonly={readonly} />
          <CubeMainChannelRow readonly={readonly} />
          {/*
           * > 활용 범위(Component : CubeExposureInfoRow) Deprecated
           * 사유 : 기획상 Enrollment Cube에서는 활용도가 낮다고 판단됨
           * 작업 일시 : 2022-04-25
           * 작업자 : 김민준
           */}
          {/*<CubeExposureInfoRow readonly={readonly} />*/}
          <CubeNameRow readonly={readonly} />
          <CubeGoalRow readonly={readonly} />
          <CubeApplicantRow readonly={readonly} />
          <CubeDescriptionRow readonly={readonly} />
          <CubeCompletionTermRow readonly={readonly} />
          <CubeEtcGuideRow readonly={readonly} />
          <CubeTagRow readonly={readonly} />
          <CubeLearningTimeRow readonly={readonly} />
          <CubeDifficultlyRow readonly={readonly} />
          <CubeOrganizerRow readonly={readonly} />
          <CubeInstructorRow readonly={readonly} />
          <CubeOperatorRow readonly={readonly} />
          <CubeLearningPeriodRow readonly={readonly} />
          <CubeLearningLocationRow readonly={readonly} />
          <CubeUrlRow readonly={readonly} />
          <CubeLearningChargeRow readonly={readonly} />
          <Table.Row style={{ display: 'none' }} />
        </Table.Body>
      </Table>
      <SubActions form>
        {!createMode && (
          <SubActions.Center>
            <Button type="button" icon="angle up" basic onClick={onClickCancelButton} />
          </SubActions.Center>
        )}

        {!readonly && (
          <SubActions.Right>
            <Button type="button" onClick={onClickCancelButton}>
              취소
            </Button>
            <Button type="button" primary onClick={onClickSaveButton}>
              저장
            </Button>
          </SubActions.Right>
        )}
      </SubActions>
    </>
  );
});
