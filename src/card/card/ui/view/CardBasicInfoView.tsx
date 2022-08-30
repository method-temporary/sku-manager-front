import React from 'react';
import { observer } from 'mobx-react';
import { Form, Input, Select } from 'semantic-ui-react';
import moment from 'moment';

import { reactAutobind } from '@nara.platform/accent';

import { SelectType } from 'shared/model';
import { FormTable, RadioGroup, Polyglot } from 'shared/components';
import { getPolyglotToAnyString } from 'shared/components/Polyglot';

import { CollegeService } from '../../../../college';
import ChannelCategoryModal from '../logic/ChannelCategoryModal';
import { divisionCategories } from '../logic/CardHelper';

import { CardQueryModel } from '../../model/CardQueryModel';
import { CardContentsQueryModel } from '../../model/CardContentsQueryModel';

import CardListIgnoreAccessiblityModal from '../logic/CardListIgnoreAccessiblityModal';

interface Props {
  isUpdatable: boolean;
  cardId?: string;
  collegeService: CollegeService;
  cardQuery: CardQueryModel;
  cardContentsQuery: CardContentsQueryModel;
  approvalInfo: string;
  onClickPrerequisite: (value: string) => void;
  onChangeCardStampCount: (value: string) => void;
  changeCardQueryProps: (name: string, value: any) => void;
  renderSubCategoryText: () => JSX.Element;
  onClickCardImport?: () => void;
}

@observer
@reactAutobind
class CardBasicInfoView extends React.Component<Props> {
  //
  render() {
    //
    const {
      isUpdatable,
      cardId,
      collegeService,
      cardQuery,
      cardContentsQuery,
      approvalInfo,
      onClickPrerequisite,
      onChangeCardStampCount,
      changeCardQueryProps,
      renderSubCategoryText,
      onClickCardImport,
    } = this.props;
    const colleges = collegeService.collegesForCurrentCineroom;
    const { collegesMap, channelMap } = collegeService;
    const { mainCategory } = divisionCategories(cardQuery.categories);

    return (
      <FormTable title="기본정보">
        {(isUpdatable && !cardId && (
          <FormTable.Row name="Card 불러오기">
            <CardListIgnoreAccessiblityModal onClickOk={onClickCardImport} isSingle />
          </FormTable.Row>
        )) ||
          null}
        <FormTable.Row name="지원 언어">
          <Polyglot.Languages onChangeProps={changeCardQueryProps} readOnly={!isUpdatable} />
        </FormTable.Row>
        <FormTable.Row name="기본 언어">
          <Polyglot.Default onChangeProps={changeCardQueryProps} readOnly={!isUpdatable} />
        </FormTable.Row>
        <FormTable.Row name="메인 채널" required>
          {isUpdatable && (
            <ChannelCategoryModal
              cardQuery={cardQuery}
              changeCardQueryProp={changeCardQueryProps}
              colleges={colleges}
              collegeService={collegeService}
            />
          )}
          {mainCategory.channelId && (
            <span>
              {collegesMap.get(mainCategory.collegeId)} &gt;{' '}
              {(mainCategory.twoDepthChannelId && channelMap.get(mainCategory.twoDepthChannelId)) ||
                channelMap.get(mainCategory.channelId)}
            </span>
          )}
        </FormTable.Row>
        <FormTable.Row name="서브 채널">
          {isUpdatable && (
            <ChannelCategoryModal
              sub
              cardQuery={cardQuery}
              changeCardQueryProp={changeCardQueryProps}
              colleges={colleges}
              collegeService={collegeService}
            />
          )}
          {renderSubCategoryText()}
        </FormTable.Row>
        <FormTable.Row name="Card 명" required>
          {/*{isUpdatable ? (*/}
          {/*  <div*/}
          {/*    className={cardQuery.name.length >= 100 ? 'ui right-top-count input error' : 'ui right-top-count input'}*/}
          {/*  >*/}
          {/*    <span className="count">*/}
          {/*      <span className="now">{cardQuery.name.length}</span>/<span className="max">100</span>*/}
          {/*    </span>*/}
          {/*    <Form.Field*/}
          {/*      width={16}*/}
          {/*      control={Input}*/}
          {/*      id="name"*/}
          {/*      type="text"*/}
          {/*      placeholder="Please enter the 과정명. (Up to 100 characters)"*/}
          {/*      value={cardQuery && cardQuery.name}*/}
          {/*      onChange={(event: any) => onChangeCardName(event.target.value)}*/}
          {/*    />*/}
          {/*  </div>*/}
          {/*) : (*/}
          {/*  cardQuery.name*/}
          {/*)}*/}
          <Polyglot.Input
            languageStrings={cardQuery.name}
            name="name"
            onChangeProps={changeCardQueryProps}
            placeholder="과정명을 입력해주세요. (최대 200자까지 입력가능)"
            maxLength="200"
            readOnly={!isUpdatable}
          />
        </FormTable.Row>
        <FormTable.Row name="Stamp 발급여부" required>
          {isUpdatable ? (
            <Form.Group>
              <Form.Field
                control={Select}
                placeholder="Select"
                options={SelectType.stamp}
                value={cardQuery && cardQuery.stampReady}
                onChange={(e: any, data: any) => changeCardQueryProps('stampReady', data.value)}
              />
              {cardQuery && cardQuery.stampReady ? (
                <Form.Field
                  control={Input}
                  placeholder="Stamp 갯수"
                  value={cardQuery && cardQuery.stampCount}
                  onChange={(e: any, data: any) => onChangeCardStampCount(data.value)}
                  type="number"
                  min={0}
                />
              ) : null}
            </Form.Group>
          ) : cardQuery.stampCount > 0 ? (
            'Yes'
          ) : (
            'No'
          )}
        </FormTable.Row>
        {!isUpdatable && (
          <>
            <FormTable.Row name="생성 정보">
              {`${moment(cardContentsQuery.registeredTime).format('YYYY.MM.DD HH:mm:ss')} | ${getPolyglotToAnyString(
                cardContentsQuery.registrantName
              )}`}
            </FormTable.Row>
            <FormTable.Row name="승인 정보">{approvalInfo}</FormTable.Row>
          </>
        )}

        <FormTable.Row name="선수 Card 여부" required>
          {isUpdatable ? (
            <Form.Group>
              <RadioGroup
                values={['Yes', 'No']}
                value={cardContentsQuery.hasPrerequisite}
                onChange={(e: any, data: any) => onClickPrerequisite(data.value)}
              />
            </Form.Group>
          ) : cardContentsQuery.prerequisiteCards.length > 0 ? (
            'Yes'
          ) : (
            'No'
          )}
        </FormTable.Row>
      </FormTable>
    );
  }
}

export default CardBasicInfoView;
