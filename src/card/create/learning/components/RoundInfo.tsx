import React from 'react';
import { observer } from 'mobx-react';
import { Button, Form, Input, Table } from 'semantic-ui-react';

import { alert, AlertModel, RadioGroup } from 'shared/components';
import LearningStore from '../Learning.store';
import RoundList from './RoundList';
import { settingRoundInfoInAllEnrollmentCubes } from '../Learning.util';
import EnrollmentCubeStore from '../learningPlan/enrollmentCube/EnrollmentCube.store';
import { getInitEnrollmentCardWithOptional } from '../model/EnrollmentCardWithOptional';
import { YesNo } from '../../../../shared/model';

interface Props {
  //
  readonly?: boolean;
}

const RoundInfo = observer(({ readonly }: Props) => {
  //
  const {
    enrollingAvailable,
    approvalProcess,
    sendingMail,
    cancellationPenalty,
    enrollmentCards,
    setEnrollingAvailable,
    setApprovalProcess,
    setSendingMail,
    setCancellationPenalty,
    setEnrollmentCards,
  } = LearningStore.instance;

  const { setSelectedCubeId } = EnrollmentCubeStore.instance;

  const onAddRounds = () => {
    //
    const enrollmentCard = getInitEnrollmentCardWithOptional();

    enrollmentCard.round = enrollmentCards.length + 1;

    setEnrollmentCards([...enrollmentCards, enrollmentCard]);

    setSelectedCubeId('');

    settingRoundInfoInAllEnrollmentCubes();
  };

  const onClickEnrollingAvailable = (value: YesNo) => {
    //
    setEnrollingAvailable(value);

    if (value === 'No') {
      setApprovalProcess(value);
      setSendingMail(value);
    }
  };

  const onClickApprovalButton = (value: YesNo) => {
    setApprovalProcess(value);
    onClickSendingMail(value);
  };

  const onClickSendingMail = (value: YesNo) => {
    setSendingMail(value);

    if (value === 'Yes') {
      alert(
        AlertModel.getCustomAlert(
          false,
          '안내',
          '학습자와 승인권자에게 수강관련 메일이 발송됩니다. \n메일 발송이 필요 없으시면 N으로 변경해주세요.',
          '확인',
          () => {}
        )
      );
    }
  };

  return (
    <Table celled>
      <colgroup>
        <col width="13%" />
        <col />
      </colgroup>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell className="title-header" colSpan={2}>
            차수 운영 정보
          </Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        <Table.Row>
          {/*enrollingAvailable*/}
          <Table.Cell className="tb-header">
            수강신청 유/무 <span className="required">*</span>
          </Table.Cell>
          <Table.Cell>
            {!readonly ? (
              <Form.Group>
                <RadioGroup
                  value={enrollingAvailable}
                  values={['Yes', 'No']}
                  onChange={(e: any, data: any) => onClickEnrollingAvailable(data.value)}
                />
              </Form.Group>
            ) : (
              <>{enrollingAvailable}</>
            )}
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell className="tb-header">
            승인 프로세스 <span className="required">*</span>
          </Table.Cell>
          <Table.Cell>
            {!readonly ? (
              <Form.Group>
                <RadioGroup
                  value={approvalProcess}
                  values={['Yes', 'No']}
                  onChange={(e: any, data: any) => onClickApprovalButton(data.value)}
                  disabled={enrollingAvailable === 'No'}
                />
              </Form.Group>
            ) : (
              <>{approvalProcess}</>
            )}
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell className="tb-header">
            메일발송 여부 <span className="required">*</span>
          </Table.Cell>
          <Table.Cell>
            {!readonly ? (
              <Form.Group>
                <RadioGroup
                  value={sendingMail}
                  values={['Yes', 'No']}
                  onChange={(e: any, data: any) => onClickSendingMail(data.value)}
                  disabled={enrollingAvailable === 'No'}
                />
              </Form.Group>
            ) : (
              <>{sendingMail}</>
            )}
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell className="tb-header">No Show Penalty</Table.Cell>
          <Table.Cell>
            {!readonly ? (
              <div
                className={
                  cancellationPenalty && cancellationPenalty.length >= 100
                    ? 'ui right-top-count input error'
                    : 'ui right-top-count input'
                }
              >
                <span className="count">
                  <span className="now">{(cancellationPenalty && cancellationPenalty.length) || 0}</span>/
                  <span className="max">100</span>
                </span>
                <Form.Field
                  control={Input}
                  width={16}
                  value={cancellationPenalty}
                  placeholder="No Show 일 경우 패널티 정보를 입력해주세요. (100자까지 입력가능)"
                  onChange={(_: any, data: any) => setCancellationPenalty(data.value)}
                  maxLength={100}
                />
              </div>
            ) : (
              <>{cancellationPenalty}</>
            )}
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell colSpan={2}>
            <span className="span-information">
              차수는 Card 기준으로 생성되며, Classroom / E-learning을 1개 이상 포함해야 합니다.
            </span>

            {enrollmentCards &&
              enrollmentCards.map((enrollmentCard, index) => (
                <>
                  <RoundList key={index} index={index} enrollmentCard={enrollmentCard} readonly={readonly} />
                  {enrollmentCards.length !== index + 1 && <hr className="contour" />}
                </>
              ))}

            {!readonly && (
              <div style={{ paddingTop: '10px' }}>
                <Button type="button" onClick={onAddRounds}>
                  차수 추가
                </Button>
              </div>
            )}
          </Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  );
});

export default RoundInfo;
