import * as React from 'react';
import { observer } from 'mobx-react';
import { Form, Checkbox, Radio, Label, TextArea, TextAreaProps } from 'semantic-ui-react';

import { FileBox, ValidationType } from '@nara.drama/depot';
import { PatronType, reactAutobind } from '@nara.platform/accent';

import { FormTable, Polyglot } from 'shared/components';
import { getPolyglotToAnyString } from 'shared/components/Polyglot';
import { DepotUtil } from 'shared/ui';

import QnaRom from 'support/qna/model/sdo/QnaRom';
import { QuestionState } from 'support/qna/model/vo/QuestionState';
import { RequestChannel } from 'support/qna/model/vo/RequestChannel';
import OperatorSelectedModal from 'support/operator/ui/view/OperatorSelectedModal';
import OperatorWithUserIdentity from 'support/operator/model/sdo/OperatorWithUserIdentity';
import { UserModel } from 'user/model/UserModel';
import { OperatorWithUserIdentityRom } from '../../model/sdo/OperatorWithUserIdentityRom';

interface Props {
  isQna: boolean;
  qnaRom: QnaRom;
  managerInfo: UserModel;
  onClickOkButtonInOperatorModal: (operatorList: OperatorWithUserIdentity[]) => void;
  onChangeCreateQnaProps: (name: string, value: any) => void;
  getFileBoxIdForReference: (fileBoxId: string) => void;
  onClickRemoveSelectedOperator: (denizenId: string) => void;
  onClickSendMailCheckBox: (denizenId: string) => void;
}
@observer
@reactAutobind
class CreateQnaAnswerView extends React.Component<Props> {
  //

  getOperatorCheckBoxLabel(operator: OperatorWithUserIdentityRom, cardOperator?: boolean): string {
    //
    if (cardOperator) {
      return operator.operatorGroupName
        ? `${operator.cardOperator ? '카드 담당자 | ' : ''}
        ${getPolyglotToAnyString(operator.operatorGroupName)} |
        ${getPolyglotToAnyString(operator.operatorName)} | ${getPolyglotToAnyString(operator.company)} |
        ${getPolyglotToAnyString(operator.department)} | ${operator.email}`
        : '';
    }

    return operator.operatorGroupName
      ? `${getPolyglotToAnyString(operator.operatorGroupName)} | ${getPolyglotToAnyString(
          operator.operatorName
        )} | ${getPolyglotToAnyString(operator.company)}
                          | ${getPolyglotToAnyString(operator.department)} | ${operator.email} | `
      : '';
  }

  render() {
    const {
      isQna,
      qnaRom,
      managerInfo,
      onClickOkButtonInOperatorModal,
      onChangeCreateQnaProps,
      getFileBoxIdForReference,
      onClickRemoveSelectedOperator,
      onClickSendMailCheckBox,
    } = this.props;

    const operatorList =
      (qnaRom &&
        qnaRom.operators &&
        qnaRom.operators.length > 0 &&
        qnaRom.operators.filter((operator) => !operator.cardOperator)) ||
      [];
    const cardOperator =
      qnaRom &&
      qnaRom.operators &&
      qnaRom.operators.length > 0 &&
      qnaRom.operators.find((operator) => operator.cardOperator);

    const disableContents =
      (qnaRom.question &&
        qnaRom.question.requestChannel === RequestChannel.QNA &&
        operatorList &&
        operatorList.length > 0 &&
        !operatorList.find((operaotr) => operaotr.denizenId === managerInfo.id) &&
        true) ||
      false;

    // console.log(qnaRom.answer.depotId);

    return (
      <FormTable title="답변 정보">
        <FormTable.Row name="답변 내용" required={!disableContents}>
          {/* <div
              className={
                qnaRom && qnaRom.answer && qnaRom.answer.content.length >= 1000
                  ? 'ui right-top-count input error'
                  : 'ui right-top-count input'
              }
            >
              <span className="count">
                <span className="now">{(qnaRom && qnaRom.answer && qnaRom.answer.content.length) || 0}</span>/
                <span className="max">1000</span>
              </span>
              <TextArea
                placeholder="내용을 입력해주세요. (1000자까지 입력가능)"
                rows={3}
                value={(qnaRom && qnaRom.answer && qnaRom.answer.content) || ''}
                onChange={(e: React.FormEvent<HTMLTextAreaElement>, data: TextAreaProps) => {
                  onChangeCreateQnaProps('answer.content', `${data.value}`);
                }}
                readOnly={disableContents}
              />
              </div> */}

          <Polyglot.SimpleEditor
            name={'answer.content'}
            value={(qnaRom && qnaRom.answer && qnaRom.answer.content) || ''}
            maxLength={1000}
            placeholder={'내용을 입력해주세요. (1000자까지 입력가능)'}
            onChangeProps={onChangeCreateQnaProps}
            disabled={disableContents}
          />
        </FormTable.Row>
        <FormTable.Row name="첨부 파일">
          <FileBox
            options={{
              readonly: disableContents,
            }}
            id={(qnaRom && qnaRom.answer && qnaRom.answer.depotId) || ''}
            vaultKey={{
              keyString: 'sku-depot',
              patronType: PatronType.Pavilion,
            }}
            patronKey={{
              keyString: 'sku-denizen',
              patronType: PatronType.Denizen,
            }}
            validations={[
              {
                type: ValidationType.Extension,
                validator: DepotUtil.extensionValidatorByDocument,
              },
            ]}
            onChange={getFileBoxIdForReference}
          />
        </FormTable.Row>
        <FormTable.Row required name="처리 상태">
          <Form.Group>
            <Form.Field
              label={'문의접수'}
              control={Radio}
              checked={
                qnaRom.question.state === QuestionState.QuestionReceived ||
                qnaRom.question.state === null ||
                qnaRom.question.state === undefined
              }
              onChange={() => onChangeCreateQnaProps('question.state', QuestionState.QuestionReceived)}
            />
            <Form.Field
              label={'답변대기'}
              control={Radio}
              checked={qnaRom.question.state === QuestionState.AnswerWaiting}
              onChange={() => onChangeCreateQnaProps('question.state', QuestionState.AnswerWaiting)}
            />
            <Form.Field
              label={'답변완료'}
              control={Radio}
              checked={qnaRom.question.state === QuestionState.AnswerCompleted}
              onChange={() => onChangeCreateQnaProps('question.state', QuestionState.AnswerCompleted)}
            />
          </Form.Group>
        </FormTable.Row>
        <FormTable.Row name="문의자 답변 발송">
          <Form.Field
            label={'문의자에게 위 내용을 메일로 발송합니다.'}
            control={Checkbox}
            checked={qnaRom.answer.checkMail}
            onChange={(e: any, data: any) => onChangeCreateQnaProps('answer.checkMail', data.checked)}
            disabled={disableContents}
          />
        </FormTable.Row>
        <FormTable.Row name="담당자 정보">
          <Form.Group inline>
            <OperatorSelectedModal onClickOk={onClickOkButtonInOperatorModal} />
          </Form.Group>
          {cardOperator && (
            <>
              <Form.Group>
                <Form.Field
                  key={`card-operator`}
                  control={Checkbox}
                  checked={
                    qnaRom &&
                    qnaRom.operatorsToSendMail &&
                    qnaRom.operatorsToSendMail.length > 0 &&
                    qnaRom.operatorsToSendMail.some((denizenId) => denizenId == cardOperator.denizenId)
                  }
                  label={this.getOperatorCheckBoxLabel(cardOperator, true)}
                  onClick={() => onClickSendMailCheckBox(cardOperator.denizenId)}
                />
              </Form.Group>
              <br />
            </>
          )}
          {
            operatorList &&
              operatorList.length > 0 &&
              operatorList.map((operator, idx) => {
                return (
                  <>
                    <Form.Group>
                      <Form.Field
                        key={`operator-${idx}`}
                        control={Checkbox}
                        checked={
                          qnaRom &&
                          qnaRom.operatorsToSendMail &&
                          qnaRom.operatorsToSendMail.length > 0 &&
                          qnaRom.operatorsToSendMail.some((denizenId) => denizenId == operator.denizenId)
                        }
                        label={this.getOperatorCheckBoxLabel(operator)}
                        onClick={() => onClickSendMailCheckBox(operator.denizenId)}
                      />
                      <Label
                        className="operator-checkbox-label"
                        onClick={() => onClickRemoveSelectedOperator(operator.denizenId)}
                      >
                        X
                      </Label>
                    </Form.Group>
                    <br />
                  </>
                );
              })
            // ||
            // (qnaRom.operators &&
            //   qnaRom.operators.length > 0 &&
            //   qnaRom.operators.map((operator, idx) => {
            //     return (
            //       <>
            //         {operator.operatorGroupId && getOperatorGroupName(operator.operatorGroupId)} |{' '}
            //         {getPolyglotToAnyString(operator.name)} | {getPolyglotToAnyString(operator.companyName)} |{' '}
            //         {getPolyglotToAnyString(operator.companyName)} | {operator.email}
            //         <br />
            //       </>
            //     );
            //   }))
          }
          <span className="span-information"> * 선택한 담당자들에게 문의 확인 요청 메일이 발송됩니다. </span>
        </FormTable.Row>
        {!isQna && (
          <FormTable.Row name="문의자 답변 표시 여부">
            <Form.Field
              label={'문의자에게 해당 문의와 답변을 공개합니다.'}
              control={Checkbox}
              checked={qnaRom.question.visibleForQuestioner}
              onChange={(e: any, data: any) => onChangeCreateQnaProps('question.visibleForQuestioner', data.checked)}
              disabled={disableContents}
            />
          </FormTable.Row>
        )}
        <FormTable.Row name="메모">
          <div
            className={
              qnaRom && qnaRom.answer && qnaRom.answer.memo.length >= 1000
                ? 'ui right-top-count input error'
                : 'ui right-top-count input'
            }
          >
            <span className="count">
              <span className="now">{(qnaRom && qnaRom.answer && qnaRom.answer.memo.length) || 0}</span>/
              <span className="max">1000</span>
            </span>
            <TextArea
              placeholder="내용을 입력해주세요. (1000자까지 입력가능)"
              rows={3}
              value={(qnaRom && qnaRom.answer && qnaRom.answer.memo) || ''}
              onChange={(e: React.FormEvent<HTMLTextAreaElement>, data: TextAreaProps) => {
                onChangeCreateQnaProps('answer.memo', `${data.value}`);
              }}
            />
          </div>
          {/* <SimpleEditorView
            name={'answer.memo'}
            value={(qnaRom && qnaRom.answer && qnaRom.answer.memo) || ''}
            maxLength={1000}
            placeholder={'내용을 입력해주세요. (1000자까지 입력가능)'}
            onChangeProps={onChangeCreateQnaProps}
          /> */}
        </FormTable.Row>
      </FormTable>
    );
  }
}

export default CreateQnaAnswerView;
