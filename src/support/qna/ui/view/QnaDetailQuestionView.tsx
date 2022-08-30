import * as React from 'react';
import { observer } from 'mobx-react';
import { Form, Select } from 'semantic-ui-react';
import moment from 'moment';

import { MemberViewModel } from '@nara.drama/approval';
import { FileBox, ValidationType } from '@nara.drama/depot';
import { PatronType, reactAutobind } from '@nara.platform/accent';

import { SelectTypeModel } from 'shared/model';
import { FormTable } from 'shared/components';
import { getPolyglotToAnyString } from 'shared/components/Polyglot';
import { DepotUtil, HtmlEditor } from 'shared/ui';

import QnaRom from 'support/qna/model/sdo/QnaRom';
import { CardWithContents } from 'card';
import CardSelectInfoView from 'card/card/ui/shared/view/CardSelectInfoView';
import { QuestionState } from '../../model/vo/QuestionState';
import { RequestChannel } from '../../model/vo/RequestChannel';

interface Props {
  isQna: boolean;
  qnaRom: QnaRom;
  requestUser: {
    key: number;
    id: string;
    name: string;
    companyName: string;
    departmentName: string;
    email: string;
  } | null;
  card: CardWithContents;
  collegesMap: Map<string, string>;
  channelMap: Map<string, string>;
  mainCategoryList: SelectTypeModel[];
  subCategoryList: SelectTypeModel[] | [];
  getChannel: (keyword: RequestChannel | '') => string | undefined;
  getCategory: (keyword: string, subCheck?: boolean) => string | undefined;
  onChangeCreateQnaProps: (name: string, value: any) => void;
  onSelectedRequestUser: (member: MemberViewModel) => void;
  getFileBoxIdForReference: (fileBoxId: string) => void;
}
@observer
@reactAutobind
class QnaDetailQuestionView extends React.Component<Props> {
  //
  addPElement(text: string): string {
    return text
      .split('\n')
      .map((splitItem) => `<p>${splitItem}</p>`)
      .join('');
  }

  render() {
    const {
      isQna,
      qnaRom,
      card,
      collegesMap,
      channelMap,
      requestUser,
      mainCategoryList,
      subCategoryList,
      getChannel,
      getCategory,
      onChangeCreateQnaProps,
      onSelectedRequestUser,
      getFileBoxIdForReference,
    } = this.props;

    const displayCardCheck =
      (isQna && qnaRom && qnaRom.question && qnaRom.question.relatedCardId && true) || (!isQna && true) || false;

    return (
      <FormTable title="문의 정보">
        <FormTable.Row name="접수채널">
          {qnaRom.question && qnaRom.question.requestChannel && getChannel(qnaRom.question.requestChannel)}
        </FormTable.Row>
        <FormTable.Row name="카테고리">
          {(isQna && qnaRom.question && qnaRom.question.state !== QuestionState.AnswerCompleted && (
            <Form.Group inline>
              <Form.Field
                width={3}
                control={Select}
                placeholder="Select"
                options={mainCategoryList}
                value={qnaRom && qnaRom.question && qnaRom.question.mainCategoryId}
                onChange={(e: any, data: any) => onChangeCreateQnaProps('question.mainCategoryId', data.value)}
              />
              <Form.Field
                width={3}
                disabled={!(qnaRom.question && qnaRom.question.mainCategoryId)}
                control={Select}
                placeholder="Select"
                options={subCategoryList}
                value={qnaRom && qnaRom.question && qnaRom.question.subCategoryId}
                onChange={(e: any, data: any) => onChangeCreateQnaProps('question.subCategoryId', data.value)}
              />
            </Form.Group>
          )) ||
            ((qnaRom.question &&
              qnaRom.question.mainCategoryId &&
              `${getCategory(qnaRom.question.mainCategoryId, false)}`) ||
              '') +
              ((qnaRom.question &&
                qnaRom.question.subCategoryId &&
                ` > ${getCategory(qnaRom.question.subCategoryId, true)}`) ||
                '')}
        </FormTable.Row>
        {displayCardCheck && (
          <FormTable.Row name="수강과정">
            <Form.Group inline>
              <CardSelectInfoView card={card} collegesMap={collegesMap} channelMap={channelMap} />
            </Form.Group>
          </FormTable.Row>
        )}
        <FormTable.Row name="문의자 정보">
          {qnaRom &&
            qnaRom.inquirerIdentity &&
            `${getPolyglotToAnyString(qnaRom.inquirerIdentity.name)} | ${getPolyglotToAnyString(
              qnaRom.inquirerIdentity.companyName
            )} | ${getPolyglotToAnyString(qnaRom.inquirerIdentity.departmentName)} | ${qnaRom.inquirerIdentity.email} `}
          {(requestUser &&
            qnaRom.question &&
            qnaRom.question.registeredTime &&
            `| ${moment(qnaRom.question.registeredTime).format('yyyy.MM.DD').toString()}`) ||
            ''}
        </FormTable.Row>
        <FormTable.Row name="문의 제목">{qnaRom.question && qnaRom.question.title}</FormTable.Row>
        <FormTable.Row name="문의 내용">
          <HtmlEditor
            value={
              (qnaRom.question &&
                qnaRom.question.content &&
                this.addPElement(qnaRom.question && qnaRom.question.content)) ||
              ''
            }
            readOnly
          />
        </FormTable.Row>
        <FormTable.Row name="첨부 파일">
          <FileBox
            options={{ readonly: true }}
            id={qnaRom && qnaRom.question && qnaRom.question.depotId}
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
      </FormTable>
    );
  }
}

export default QnaDetailQuestionView;
