import * as React from 'react';
import { observer } from 'mobx-react';
import { Checkbox, Form } from 'semantic-ui-react';
import moment from 'moment';

import { FileBox, ValidationType } from '@nara.drama/depot';
import { PatronType, reactAutobind } from '@nara.platform/accent';

import { FormTable } from 'shared/components';
import { getPolyglotToAnyString } from 'shared/components/Polyglot';
import { DepotUtil, HtmlEditor } from 'shared/ui';

import QnaRom from 'support/qna/model/sdo/QnaRom';
import OperatorRom from 'support/operator/model/sdo/OperatorRom';
import { QuestionState } from 'support/qna/model/vo/QuestionState';

import { UserDetailModel } from 'user/model/UserDetailModel';

interface Props {
  isQna: boolean;
  qnaRom: QnaRom;
  operator: OperatorRom;
  mailSender: UserDetailModel;
  getState: (keyword: QuestionState) => string | undefined;
  onChangeCreateQnaProps: (name: string, value: any) => void;
  getFileBoxIdForReference: (fileBoxId: string) => void;
}
@observer
@reactAutobind
class QnaDetailAnswerView extends React.Component<Props> {
  //
  render() {
    const { isQna, qnaRom, getState, operator, mailSender, onChangeCreateQnaProps, getFileBoxIdForReference } =
      this.props;

    return (
      <FormTable title="답변 정보">
        <FormTable.Row name="최종 담당자">
          {(operator && operator.denizenId && (
            <>
              {operator.operatorGroupName &&
                getPolyglotToAnyString(operator.operatorGroupName) &&
                `${getPolyglotToAnyString(operator.operatorGroupName)} | `}
              {`${getPolyglotToAnyString(operator.operatorName)} | ${getPolyglotToAnyString(
                operator.company
              )} | ${getPolyglotToAnyString(operator.department)} | ${operator.email} | `}
            </>
          )) ||
            '- | '}
          {`${getState(qnaRom.question.state)} | ${
            (qnaRom.answer && qnaRom.answer.modifiedTime && moment(qnaRom.answer.modifiedTime).format('yyyy.MM.DD')) ||
            (qnaRom.question &&
              qnaRom.question.modifiedTime &&
              moment(qnaRom.question.modifiedTime).format('yyyy.MM.DD'))
          }`}
        </FormTable.Row>
        <FormTable.Row name="답변 내용">
          {/* <TextArea
              readOnly={true}
              placeholder="내용을 입력해주세요. (1000자까지 입력가능)"
              rows={3}
              value={(qnaRom && qnaRom.answer && qnaRom.answer.content) || ''}
              onChange={(e: React.FormEvent<HTMLTextAreaElement>, data: TextAreaProps) => {
                onChangeCreateQnaProps('answer.content', `${data.value}`);
              }}
            /> */}
          <HtmlEditor value={(qnaRom.answer && qnaRom.answer.content) || ''} readOnly />
        </FormTable.Row>
        <FormTable.Row name="첨부 파일">
          <FileBox
            options={{ readonly: true }}
            id={qnaRom && qnaRom.answer && qnaRom.answer.depotId}
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
        <FormTable.Row name="문의자 메일 발송">
          {mailSender && mailSender.user && qnaRom.latestOperatorSentEmail
            ? `Y | ${getPolyglotToAnyString(mailSender.user.name)}| ${getPolyglotToAnyString(
                mailSender.user.companyName
              )} | ${getPolyglotToAnyString(mailSender.user.departmentName)} | ${mailSender.user.email} | ${moment(
                qnaRom.latestOperatorSentEmail.registeredTime
              ).format('yyyy.MM.DD hh:mm:ss')}`
            : 'N'}
        </FormTable.Row>
        {!isQna && (
          <FormTable.Row name="문의자 답변 표시 여부">
            <Form.Field
              label={'문의자에게 해당 문의와 답변을 공개합니다.'}
              control={Checkbox}
              checked={qnaRom.question.visibleForQuestioner}
              onChange={(e: any, data: any) => onChangeCreateQnaProps('question.visibleForQuestioner', data.checked)}
              disabled={true}
            />
          </FormTable.Row>
        )}
        <FormTable.Row name="만족도 조사 결과">
          <Form.Field
            label={`${(qnaRom.answer && qnaRom.answer.satisfactionPoint) || 0}점${
              (qnaRom.answer && qnaRom.answer.satisfactionComment && ` | ${qnaRom.answer.satisfactionComment}`) || ''
            }`}
          />
        </FormTable.Row>
        <FormTable.Row name="메모">
          {/* <TextArea
                readOnly={true}
                placeholder="내용을 입력해주세요. (1000자까지 입력가능)"
                rows={3}
                value={(qnaRom && qnaRom.answer && qnaRom.answer.memo) || ''}
                onChange={(e: React.FormEvent<HTMLTextAreaElement>, data: TextAreaProps) => {
                  onChangeCreateQnaProps('answer.memo', `${data.value}`);
                }}
              /> */}

          <HtmlEditor value={(qnaRom.answer && qnaRom.answer.memo) || '-'} readOnly />
        </FormTable.Row>
      </FormTable>
    );
  }
}

export default QnaDetailAnswerView;
