import React from 'react';
import { observer } from 'mobx-react';
import { reactAutobind } from '@nara.platform/accent';
import { MemberViewModel } from '@nara.drama/approval';
import { FileBox, PatronType, ValidationType } from '@nara.drama/depot';
import DatePicker from 'react-datepicker';
import { Checkbox, Form, Icon, Input, Select, Table } from 'semantic-ui-react';
import moment from 'moment';

import { FormTable, Polyglot } from 'shared/components';
import { SelectType } from 'shared/model';
import { getPolyglotToAnyString } from 'shared/components/Polyglot';
import { DepotUtil } from 'shared/ui';

import ManagerListModal from '../../../../cube/cube/ui/view/ManagerListModal';

import { CardSelectModal } from '../../index';
import { CardQueryModel, CardWithContents } from '../..';
import { CardContentsQueryModel } from '../../model/CardContentsQueryModel';
import CardRelatedCardListView from './CardRelatedCardListView';
import CardInstructorListView from './CardInstructorListView';

interface Props {
  isUpdatable: boolean;

  cardQuery: CardQueryModel;
  relatedCardQuery: CardQueryModel;
  cardContentsQuery: CardContentsQueryModel;

  changeCardQueryProps: (name: string, value: any) => void;
  changeRelatedCardQueryProps: (name: string, value: any) => void;
  changeCardContentsQueryProps: (name: string, value: any) => void;

  collegesMap: Map<string, string>;
  channelMap: Map<string, string>;

  relatedCards: CardWithContents[];

  getFileBoxIdForReference: (fileBoxId: string) => void;
  getAgreementFileBoxIdForReference: (fileBoxId: string) => void;

  onChangeNumber: (name: string, value: string, content: boolean) => void;
  onClickOperatorSelect: (member: MemberViewModel) => void;
  onClickSortRelatedCard: (card: CardWithContents, seq: number, newSeq: number) => void;
  onClickDeleteRelatedCard: (index: number) => void;
  onClickRelatedCardModalOk: () => void;
  onChangeRepresentativeInstructor: (seq: number) => void;
  onChangeDatePicker: (date: Date, fieldName: string) => void;
  getLearningTimeText: () => JSX.Element;
}

@observer
@reactAutobind
class CardContentsInfoView extends React.Component<Props> {
  //
  cardDescriptionQuillRef: any = null;

  // componentDidMount(): void {
  //   //
  //   if (this.props.isUpdatable) {
  //     //Card 소개 ReactQuill 객체의 Max Length 설정
  //     const cardDescriptionQuillEditor = this.cardDescriptionQuillRef.getEditor();
  //     cardDescriptionQuillEditor.on('text-change', (delta: { ops: any }, old: any, source: any) => {
  //       const charLen = cardDescriptionQuillEditor.getLength();
  //       if (charLen > 1000) {
  //         cardDescriptionQuillEditor.deleteText(1000, charLen);
  //       }
  //     });
  //   }
  // }

  render() {
    //
    const {
      isUpdatable,
      relatedCardQuery,
      changeRelatedCardQueryProps,
      cardQuery,
      changeCardQueryProps,
      cardContentsQuery,
      changeCardContentsQueryProps,
      onClickOperatorSelect,
      getFileBoxIdForReference,
      getAgreementFileBoxIdForReference,
      onChangeNumber,
      onClickDeleteRelatedCard,
      onClickSortRelatedCard,
      collegesMap,
      channelMap,
      relatedCards,
      onClickRelatedCardModalOk,
      onChangeRepresentativeInstructor,
      onChangeDatePicker,
      getLearningTimeText,
    } = this.props;

    const instructors = cardContentsQuery.instructors;

    return (
      <FormTable title="부가 정보">
        <FormTable.Row name="교육기간">
          {isUpdatable ? (
            <Form.Group>
              <Form.Field
                control={Checkbox}
                label="일정제한"
                checked={cardContentsQuery.restrictLearningPeriod}
                onChange={(e: any, data: any) => changeCardContentsQueryProps('restrictLearningPeriod', data.checked)}
              />
              <Form.Field>
                <div className="ui input right icon">
                  <DatePicker
                    placeholderText="시작날짜를 선택해주세요."
                    selected={
                      (cardContentsQuery &&
                        cardContentsQuery.learningPeriod &&
                        cardContentsQuery.learningPeriod.startDateObj) ||
                      ''
                    }
                    onChange={(date: Date) => onChangeDatePicker(date, 'learningPeriod.startDateMoment')}
                    // minDate={moment().toDate()}
                    dateFormat="yyyy.MM.dd"
                  />
                  <Icon name="calendar alternate outline" />
                </div>
              </Form.Field>
              <div className="dash">-</div>
              <Form.Field>
                <div className="ui input right icon">
                  <DatePicker
                    placeholderText="종료날짜를 선택해주세요."
                    selected={
                      (cardContentsQuery &&
                        cardContentsQuery.learningPeriod &&
                        cardContentsQuery.learningPeriod.endDateObj) ||
                      ''
                    }
                    onChange={(date: Date) => onChangeDatePicker(date, 'learningPeriod.endDateMoment')}
                    minDate={
                      (cardContentsQuery &&
                        cardContentsQuery.learningPeriod &&
                        cardContentsQuery.learningPeriod.startDateObj) ||
                      ''
                    }
                    dateFormat="yyyy.MM.dd"
                  />
                  <Icon name="calendar alternate outline" />
                </div>
              </Form.Field>
            </Form.Group>
          ) : (
            `${moment(cardContentsQuery.learningPeriod.startDate).format('YYYY-MM-DD')} - ${moment(
              cardContentsQuery.learningPeriod.endDate
            ).format('YYYY-MM-DD')}`
          )}
          <p style={{ color: '#ff0000' }}>{` * 일정제한 기능 사용 시, 교육 기간 종료 후 학습이 제한됩니다.`}</p>
        </FormTable.Row>
        <FormTable.Row name="참여 기간 설정">
          {isUpdatable ? (
            <Form.Group>
              <Form.Field
                control={Checkbox}
                label="기간설정"
                checked={cardContentsQuery.hasValidLearningDate}
                onChange={(e: any, data: any) => changeCardContentsQueryProps('hasValidLearningDate', data.checked)}
              />
              <Form.Field
                control={Input}
                disabled={!cardContentsQuery.hasValidLearningDate}
                type="number"
                min={0}
                value={cardContentsQuery.validLearningDate}
                onChange={(e: any, data: any) => onChangeNumber('validLearningDate', data.value, true)}
              />
              <span className="label">일</span>
            </Form.Group>
          ) : cardContentsQuery.validLearningDate ? (
            `${cardContentsQuery.validLearningDate} 일`
          ) : (
            '-'
          )}
          <p
            style={{ color: '#FF0000' }}
          >{` * 참여 기간 설정 시, 학습 시작일로부터 설정된 일정 내에만 학습에 참여할 수 있습니다.`}</p>
        </FormTable.Row>
        {/* <FormTable.Row name="총 학습 시간">{getLearningTimeText()}</FormTable.Row>
          <FormTable.Row name="추가 학습 시간">
            {isUpdatable ? (
              <Form.Group>
                <Form.Field
                  width={3}
                  control={Input}
                  type="number"
                  min={0}
                  value={cardQuery.additionalLearningTime}
                  onChange={(e: any, data: any) => onChangeNumber('additionalLearningTime', data.value, false)}
                />
                <span className="label">분</span>
              </Form.Group>
            ) : (
              `${cardQuery.additionalLearningTime || 0} 분`
            )}
          </FormTable.Row> */}
        <FormTable.Row name="Card 표시 문구" required>
          {/*{isUpdatable ? (*/}
          {/*  <Form.Field*/}
          {/*    width={16}*/}
          {/*    control={TextArea}*/}
          {/*    id="simpleDescription"*/}
          {/*    type="text"*/}
          {/*    placeholder="Card 표시 문구를 입력해주세요. (최대 200자까지 입력가능)"*/}
          {/*    value={cardQuery && cardQuery.simpleDescription}*/}
          {/*    onChange={(e: any, data: any) =>*/}
          {/*      data.value.length < 201 && changeCardQueryProps('simpleDescription', data.value)*/}
          {/*    }*/}
          {/*  />*/}
          {/*) : (*/}
          {/*  <span className="white-space-pre">{cardQuery.simpleDescription}</span>*/}
          {/*)}*/}
          <Polyglot.TextArea
            name="simpleDescription"
            onChangeProps={changeCardQueryProps}
            languageStrings={cardQuery.simpleDescription}
            maxLength={200}
            placeholder={isUpdatable ? 'Card 표시 문구를 입력해주세요. (최대 200자까지 입력가능)' : ''}
            readOnly={!isUpdatable}
          />
        </FormTable.Row>
        <FormTable.Row name="Card 소개" required>
          {/*<HtmlEditor*/}
          {/*  quillRef={(el) => {*/}
          {/*    this.cardDescriptionQuillRef = el;*/}
          {/*  }}*/}
          {/*  modules={SelectType.modules}*/}
          {/*  formats={SelectType.formats}*/}
          {/*  placeholder="Card 소개를 입력해주세요. (1,000자까지 입력가능)"*/}
          {/*  onChange={(html) => changeCardContentsQueryProps('description', html === '<p><br></p>' ? '' : html)}*/}
          {/*  value={*/}
          {/*    (cardContentsQuery && getPolyglotToString(cardContentsQuery.description, cardQuery.defaultLanguage)) || ''*/}
          {/*  }*/}
          {/*  readOnly={!isUpdatable}*/}
          {/*/>*/}

          <Polyglot.Editor
            name="description"
            languageStrings={cardContentsQuery.description}
            onChangeProps={changeCardContentsQueryProps}
            maxLength={3000}
            placeholder={isUpdatable ? 'Card 소개를 입력해주세요. (3,000자까지 입력가능)' : ''}
            readOnly={!isUpdatable}
          />
        </FormTable.Row>
        <FormTable.Row name="담당자" required>
          {isUpdatable && (
            <ManagerListModal handleOk={onClickOperatorSelect} buttonName="담당자 선택" multiSelect={false} />
          )}
          {cardContentsQuery.cardOperator && cardContentsQuery.cardOperator.id && (
            <Table celled>
              <colgroup>
                <col width="30%" />
                <col width="20%" />
                <col width="50%" />
              </colgroup>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell textAlign="center">소속</Table.HeaderCell>
                  <Table.HeaderCell textAlign="center">이름</Table.HeaderCell>
                  <Table.HeaderCell textAlign="center">이메일</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                <Table.Row>
                  <Table.Cell>{getPolyglotToAnyString(cardContentsQuery.cardOperator.companyName)}</Table.Cell>
                  <Table.Cell>{getPolyglotToAnyString(cardContentsQuery.cardOperator.name)}</Table.Cell>
                  <Table.Cell>{cardContentsQuery.cardOperator.email}</Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
          )}
        </FormTable.Row>
        <FormTable.Row name="난이도" required>
          {isUpdatable ? (
            <Form.Field
              control={Select}
              width={4}
              placeholder="Select"
              options={SelectType.difficulty}
              value={(cardQuery && cardQuery.difficultyLevel) || ''}
              onChange={(e: any, data: any) => changeCardQueryProps('difficultyLevel', data.value)}
            />
          ) : (
            cardQuery.difficultyLevel
          )}
        </FormTable.Row>
        <FormTable.Row name="교육자료">
          <>
            <FileBox
              options={{ readonly: !isUpdatable }}
              fileBoxId={cardContentsQuery && cardContentsQuery.fileBoxId}
              id={cardContentsQuery && cardContentsQuery.fileBoxId}
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
                  type: ValidationType.Duplication,
                  validator: DepotUtil.sizeWithDuplicationValidator,
                },
                {
                  type: ValidationType.Extension,
                  validator: DepotUtil.extensionValidatorByDocument,
                },
              ]}
              onChange={getFileBoxIdForReference}
            />

            {isUpdatable && (
              <>
                <p className="info-text-gray">- DOC,PDF,EXL 파일을 등록하실 수 있습니다.</p>
                <p className="info-text-gray">- 최대 20MB 용량의 파일을 등록하실 수 있습니다.</p>
              </>
            )}
          </>
        </FormTable.Row>
        <FormTable.Row name="강사 정보">
          <CardInstructorListView
            isUpdatable={isUpdatable}
            instructors={instructors}
            onChangeRepresentativeInstructor={onChangeRepresentativeInstructor}
          />
        </FormTable.Row>
        <FormTable.Row name="관련 과정">
          {isUpdatable && (
            <CardSelectModal
              searchQuery={relatedCardQuery}
              changeSearchQueryProps={changeRelatedCardQueryProps}
              onClickOk={onClickRelatedCardModalOk}
              selectedCards={relatedCards}
            />
          )}

          {relatedCards.length > 0 && (
            <CardRelatedCardListView
              isUpdatable={isUpdatable}
              relatedCards={relatedCards}
              onClickDeleteRelatedCard={onClickDeleteRelatedCard}
              onClickSortRelatedCard={onClickSortRelatedCard}
              collegesMap={collegesMap}
              channelMap={channelMap}
            />
          )}
        </FormTable.Row>

        <FormTable.Row name="서약 진행">
          <Form.Field
            control={Checkbox}
            label="서약 진행 여부(Y/N)"
            checked={cardContentsQuery.pisAgreementRequired}
            onChange={(e: any, data: any) => changeCardContentsQueryProps('pisAgreementRequired', data.checked)}
            disabled={!isUpdatable}
          />
          {cardContentsQuery.pisAgreementRequired && (
            <Polyglot.PisAgreement
              name="pisAgreementDepotId"
              titleName="pisAgreementTitle"
              onChangeProps={changeCardContentsQueryProps}
              languageStrings={cardContentsQuery.pisAgreementDepotId}
              titleLanguageStrings={cardContentsQuery.pisAgreementTitle}
              validations={[
                {
                  type: ValidationType.Duplication,
                  validator: DepotUtil.duplicationValidator,
                },
                {
                  type: ValidationType.Extension,
                  validator: DepotUtil.extensionValidatorPDF,
                },
                {
                  type: ValidationType.Duplication,
                  validator: DepotUtil.multiFileValidator,
                },
              ]}
              desc={<p className="info-text-gray">- PDF 파일 1개 만 등록하실 수 있습니다.</p>}
              readOnly={!isUpdatable}
            />
          )}
        </FormTable.Row>
      </FormTable>
    );
  }
}

export default CardContentsInfoView;
