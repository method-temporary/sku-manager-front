import * as React from 'react';
import { observer } from 'mobx-react';
import { Icon, Form, Select } from 'semantic-ui-react';
import DatePicker from 'react-datepicker';
import moment from 'moment';

import { MemberViewModel } from '@nara.drama/approval';
import { FileBox, ValidationType } from '@nara.drama/depot';
import { PatronType, reactAutobind } from '@nara.platform/accent';

import { SelectTypeModel } from 'shared/model';
import { FormTable, Polyglot } from 'shared/components';
import { DepotUtil } from 'shared/ui';

import QnaRom from 'support/qna/model/sdo/QnaRom';

import { CardSelectModal, CardWithContents } from 'card';
import CardSelectInfoView from 'card/card/ui/shared/view/CardSelectInfoView';
import ManagerListModalView from 'cube/cube/ui/view/ManagerListModal';

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
  channelList: { key: string; text: string; value: string }[];
  mainCategoryList: SelectTypeModel[];
  subCategoryList: SelectTypeModel[] | [];
  // getChannel: (keyword: RequestChannel | '') => string | undefined;
  // getCategory: (keyword: string, subCheck?: boolean) => string | undefined;
  onChangeCreateQnaProps: (name: string, value: any) => void;
  onSelectedRequestUser: (member: MemberViewModel) => void;
  getFileBoxIdForReference: (fileBoxId: string) => void;
  onClickSelectedCardModal: () => void;
}
@observer
@reactAutobind
class CreateQnaQuestionView extends React.Component<Props> {
  //
  render() {
    const {
      isQna,
      qnaRom,
      requestUser,
      card,
      collegesMap,
      channelMap,
      channelList,
      mainCategoryList,
      subCategoryList,
      // getChannel,
      // getCategory,
      onChangeCreateQnaProps,
      onSelectedRequestUser,
      getFileBoxIdForReference,
      onClickSelectedCardModal,
    } = this.props;

    const displayCardCheck =
      (isQna && qnaRom && qnaRom.question && qnaRom.question.relatedCardId && true) || (!isQna && true) || false;

    return (
      <FormTable title="문의 정보">
        <FormTable.Row required name="문의 일자">
          <div className="ui input right icon">
            <DatePicker
              placeholderText="시작날짜를 선택해주세요."
              selected={
                (qnaRom.question.registeredTime && moment(qnaRom.question.registeredTime).toDate()) || moment().toDate()
              }
              onChange={(date: Date) =>
                onChangeCreateQnaProps('question.registeredTime', moment(date).toDate().getTime())
              }
              dateFormat="yyyy.MM.dd"
            />
            <Icon name="calendar alternate outline" />
          </div>
        </FormTable.Row>
        <FormTable.Row required name="접수채널">
          <Form.Group>
            <Form.Field
              control={Select}
              placeholder="Select"
              options={channelList}
              value={qnaRom && qnaRom.question && qnaRom.question.requestChannel}
              onChange={(e: any, data: any) => onChangeCreateQnaProps('question.requestChannel', data.value)}
            />
          </Form.Group>
        </FormTable.Row>
        <FormTable.Row required name="카테고리">
          <Form.Group>
            <Form.Field
              control={Select}
              placeholder="Select"
              options={mainCategoryList}
              value={qnaRom && qnaRom.question && qnaRom.question.mainCategoryId}
              onChange={(e: any, data: any) => onChangeCreateQnaProps('question.mainCategoryId', data.value)}
            />
            <Form.Field
              disabled={!(qnaRom.question && qnaRom.question.mainCategoryId)}
              control={Select}
              placeholder="Select"
              options={subCategoryList}
              value={qnaRom && qnaRom.question && qnaRom.question.subCategoryId}
              onChange={(e: any, data: any) => onChangeCreateQnaProps('question.subCategoryId', data.value)}
            />
          </Form.Group>
          {/* ) : (
            qnaRom.question &&
            `${getCategory(qnaRom.question.mainCategoryId, false)} > ${
              (qnaRom.question.subCategoryId && getCategory(qnaRom.question.subCategoryId, true)) || ''
            }` */}
        </FormTable.Row>
        {displayCardCheck && (
          <FormTable.Row name="수강과정">
            <Form.Group inline>
              <CardSelectModal
                readonly={false}
                singleSelectedCard={card}
                isSingle
                onClickOk={onClickSelectedCardModal}
              />
            </Form.Group>
            {card && <CardSelectInfoView card={card} collegesMap={collegesMap} channelMap={channelMap} />}
          </FormTable.Row>
        )}
        <FormTable.Row required name="문의자 정보">
          <Form.Group inline>
            <ManagerListModalView handleOk={onSelectedRequestUser} buttonName="문의자 정보" multiSelect={false} />
          </Form.Group>
          {(requestUser &&
            requestUser.id &&
            `${requestUser.name} | ${requestUser.companyName} | ${requestUser.departmentName} | ${requestUser.email} `) ||
            ''}
          {(requestUser &&
            qnaRom.question &&
            qnaRom.question.registeredTime &&
            `| ${moment(qnaRom.question.registeredTime).format('yyyy.MM.DD').toString()}`) ||
            ''}
        </FormTable.Row>
        <FormTable.Row required name="문의 제목">
          <Form.Group inline>
            <div
              className={
                qnaRom && qnaRom.question && qnaRom.question.title.length >= 100
                  ? 'ui right-top-count input error'
                  : 'ui right-top-count input'
              }
            >
              <span className="count">
                <span className="now">{(qnaRom && qnaRom.question && qnaRom.question.title.length) || 0}</span>/
                <span className="max">100</span>
              </span>
              <input
                id="title"
                type="text"
                placeholder="제목을 입력해주세요 (최대 100자까지 입력 가능)"
                value={(qnaRom && qnaRom.question && qnaRom.question.title) || ''}
                onChange={(e: any) => onChangeCreateQnaProps('question.title', e.target.value)}
                maxLength={100}
              />
            </div>
          </Form.Group>
          {/* )) || (qnaRom.question && qnaRom.question.title) || '' */}
        </FormTable.Row>
        <FormTable.Row required name="문의 내용">
          {/* <div
            className={
              qnaRom && qnaRom.question && qnaRom.question.content.length >= 1000
                ? 'ui right-top-count input error'
                : 'ui right-top-count input'
            }
          >
            <span className="count">
              <span className="now">{(qnaRom && qnaRom.question && qnaRom.question.content.length) || 0}</span>/
              <span className="max">1000</span>
            </span>
            <TextArea
              placeholder="내용을 입력해주세요. (1000자까지 입력가능)"
              rows={3}
              value={(qnaRom && qnaRom.question && qnaRom.question.content) || ''}
              onChange={(e: React.FormEvent<HTMLTextAreaElement>, data: TextAreaProps) => {
                onChangeCreateQnaProps('question.content', `${data.value}`);
              }}
            />
          </div> */}
          <Polyglot.SimpleEditor
            name={'question.content'}
            value={(qnaRom && qnaRom.question && qnaRom.question.content) || ''}
            maxLength={1000}
            placeholder={'내용을 입력해주세요. (1000자까지 입력가능)'}
            onChangeProps={onChangeCreateQnaProps}
          />
        </FormTable.Row>
        <FormTable.Row name="첨부 파일">
          <FileBox
            // options={{ readonly: isUpdatable }}
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

export default CreateQnaQuestionView;
