import React from 'react';
import { observer } from 'mobx-react';
import { reactAutobind } from '@nara.platform/accent';
import { MemberViewModel } from '@nara.drama/approval';
import moment from 'moment';

import CardContentsInfoView from '../view/CardContentsInfoView';

import { CardWithContents } from '../../model/CardWithContents';
import { CardService } from '../../index';
import CardInstructorsModel from '../../model/vo/CardInstructorsModel';

interface Props {
  isUpdatable: boolean;
  cardService: CardService;
  collegesMap: Map<string, string>;
  channelMap: Map<string, string>;
}

@observer
@reactAutobind
class CardContentsInfoContainer extends React.Component<Props> {
  //
  onClickOperatorSelect(member: MemberViewModel) {
    //
    const { changeCardContentsQueryProps } = this.props.cardService;

    changeCardContentsQueryProps('cardOperator.id', member.id);
    changeCardContentsQueryProps('cardOperator.email', member.email);
    changeCardContentsQueryProps('cardOperator.name', member.name);
    changeCardContentsQueryProps('cardOperator.companyCode', member.companyCode);
    changeCardContentsQueryProps('cardOperator.companyName', member.companyName);
  }

  getFileBoxIdForReference(fileBoxId: string) {
    //
    const { changeCardContentsQueryProps } = this.props.cardService;
    changeCardContentsQueryProps('fileBoxId', fileBoxId);
  }

  getAgreementFileBoxIdForReference(fileBoxId: string) {
    //
    const { changeCardContentsQueryProps } = this.props.cardService;
    changeCardContentsQueryProps('agreementFileBoxId', fileBoxId);
  }

  onChangeNumber(name: string, value: string, contents?: boolean) {
    //
    const { changeCardContentsQueryProps, changeCardQueryProps } = this.props.cardService;

    let val = value;
    if (val === '') {
      val = '0';
    } else if (value.startsWith('0') && value !== '0') {
      val = value.substr(1);
    }

    contents ? changeCardContentsQueryProps(name, val) : changeCardQueryProps(name, val);
  }

  onClickDeleteRelatedCard(index: number) {
    //
    const { relatedCards, setRelatedCards } = this.props.cardService;
    const copiedModalCards = [...relatedCards];

    const removeList = this.removeInList(index, copiedModalCards);

    setRelatedCards(removeList);
  }

  onClickSortRelatedCard(card: CardWithContents, seq: number, newSeq: number) {
    //
    const { relatedCards, setRelatedCards } = this.props.cardService;
    const copiedModalCards = [...relatedCards];

    copiedModalCards.splice(seq, 1);
    copiedModalCards.splice(newSeq, 0, card);

    setRelatedCards(copiedModalCards);
  }

  // select remove
  removeInList(index: number, oldList: any[]) {
    //
    return oldList.slice(0, index).concat(oldList.slice(index + 1));
  }

  onClickRelatedCardModalOk() {
    //
    const { cardService } = this.props;
    cardService.setRelatedCards(cardService.selectedCards);
  }

  onChangeRepresentativeInstructor(seq: number) {
    //
    const { cardContentsQuery, changeCardContentsQueryProps } = this.props.cardService;

    const { instructors } = cardContentsQuery;

    const newInstructors: CardInstructorsModel[] = [];

    instructors.map((instructor, index) =>
      newInstructors.push({
        ...instructor,
        representative: index === seq,
      })
    );

    changeCardContentsQueryProps('instructors', [...newInstructors]);
  }

  onChangeDatePicker(date: Date, fieldName: string) {
    //
    const { cardContentsQuery, changeCardContentsQueryProps } = this.props.cardService;

    if (date === null) return;

    // const value = moment(date).format('YYYY-MM-DD');
    //
    // const reg = /^\d{4}(-|\.)(0[1-9]|1[012])(-|\.)(0[1-9]|[12][0-9]|3[0-1])$/;
    //
    // if (reg.test(value)) {
    changeCardContentsQueryProps(fieldName, moment(date));
    if (
      fieldName === 'learningPeriod.startDateMoment' &&
      cardContentsQuery.learningPeriod.startDateMoment > cardContentsQuery.learningPeriod.endDateMoment
    ) {
      changeCardContentsQueryProps('learningPeriod.endDateMoment', moment(date));
    }
    // } else {
    //   alert(
    //     AlertModel.getCustomAlert(
    //       false,
    //       '날짜 형식 안내',
    //       '날짜 입력 형태가 맞지 않습니다. \n YYYY-MM-DD 또는 YYYY.MM.DD 형식으로 입력해주세요',
    //       'OK'
    //     )
    //   );
    // }
  }

  getLearningTimeText(): JSX.Element {
    //
    const { cardQuery } = this.props.cardService;

    let learningTimeText = '';
    let additionalLearningTimeTxt = '';

    const learningTime = cardQuery.learningTime;
    const additionalLearningTime = cardQuery.additionalLearningTime;

    if (parseInt(String(learningTime / 60), 10) > 0) {
      learningTimeText += `${parseInt(String(learningTime / 60), 10)}h `;
    }

    if (!(parseInt(String(learningTime / 60), 10) > 0 && learningTime % 60 === 0)) {
      learningTimeText += `${learningTime % 60}m`;
    }

    if (parseInt(String(additionalLearningTime / 60), 10) > 0) {
      additionalLearningTimeTxt += `${parseInt(String(additionalLearningTime / 60), 10)}h `;
    }

    if (!(parseInt(String(additionalLearningTime / 60), 10) > 0 && additionalLearningTime % 60 === 0)) {
      additionalLearningTimeTxt += `${additionalLearningTime % 60}m`;
    }

    return (
      <>
        <span>{learningTimeText}</span>
        <span className="span-information">{` + ${additionalLearningTimeTxt}`}</span>
      </>
    );
  }

  render() {
    //
    const { isUpdatable, cardService, collegesMap, channelMap } = this.props;
    const {
      relatedCardQuery,
      changeRelatedCardQueryProps,
      cardQuery,
      changeCardQueryProps,
      cardContentsQuery,
      changeCardContentsQueryProps,
      relatedCards,
    } = cardService;

    return (
      <CardContentsInfoView
        cardQuery={cardQuery}
        channelMap={channelMap}
        collegesMap={collegesMap}
        isUpdatable={isUpdatable}
        relatedCards={relatedCards}
        relatedCardQuery={relatedCardQuery}
        cardContentsQuery={cardContentsQuery}
        changeCardQueryProps={changeCardQueryProps}
        changeRelatedCardQueryProps={changeRelatedCardQueryProps}
        changeCardContentsQueryProps={changeCardContentsQueryProps}
        onChangeNumber={this.onChangeNumber}
        onClickOperatorSelect={this.onClickOperatorSelect}
        onClickSortRelatedCard={this.onClickSortRelatedCard}
        getFileBoxIdForReference={this.getFileBoxIdForReference}
        getAgreementFileBoxIdForReference={this.getAgreementFileBoxIdForReference}
        onClickDeleteRelatedCard={this.onClickDeleteRelatedCard}
        onClickRelatedCardModalOk={this.onClickRelatedCardModalOk}
        onChangeRepresentativeInstructor={this.onChangeRepresentativeInstructor}
        onChangeDatePicker={this.onChangeDatePicker}
        getLearningTimeText={this.getLearningTimeText}
      />
    );
  }
}

export default CardContentsInfoContainer;
