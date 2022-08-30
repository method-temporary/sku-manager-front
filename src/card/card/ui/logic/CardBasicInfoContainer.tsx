import React from 'react';
import { observer } from 'mobx-react';
import { reactAutobind } from '@nara.platform/accent';

import { confirm, ConfirmModel } from 'shared/components/AlertConfirm';

import { CollegeService } from '../../../../college';

import { CardService } from '../../index';
import { divisionCategories } from './CardHelper';
import { MemberService } from '../../../../approval';

import CardBasicInfoView from '../view/CardBasicInfoView';
import { learningManagementUrl } from '../../../../Routes';
import { RouteComponentProps, withRouter } from 'react-router';
import { CardCategory } from 'shared/model/CardCategory';

interface Props extends RouteComponentProps<Params> {
  isUpdatable: boolean;
  cardId?: string;
  cardService: CardService;
  memberService: MemberService;
  collegeService: CollegeService;
  approvalInfo: string;
  onClickCardImport?: () => void;
}

interface Params {
  cineroomId: string;
  copiedId: string;
}

@observer
@reactAutobind
class CardBasicInfoContainer extends React.Component<Props> {
  //
  onChangeCardStampCount(value: string) {
    //
    const { changeCardQueryProps } = this.props.cardService;

    let val = value;
    if (val === '') {
      val = '0';
    } else if (value.startsWith('0') && value !== '0') {
      val = value.substr(1);
    }

    changeCardQueryProps('stampCount', val);
  }

  onClickPrerequisite(value: string) {
    //
    const { prerequisiteCards, changeCardContentsQueryProps, clearPrerequisiteCards } = this.props.cardService;

    if (value === 'No' && prerequisiteCards.length > 0) {
      confirm(
        ConfirmModel.getCustomConfirm(
          '선수코스 없음 선택',
          '선택된 선수코스가 해지됩니다. 계속하시겠습니까?',
          false,
          '확인',
          '취소',
          () => {
            clearPrerequisiteCards();
            changeCardContentsQueryProps('hasPrerequisite', value);
          }
        )
      );
    } else {
      changeCardContentsQueryProps('hasPrerequisite', value);
    }
  }

  renderSubCategoryText(): JSX.Element {
    //
    const { cardService, collegeService } = this.props;
    const { subCategories } = divisionCategories(cardService.cardQuery.categories);
    const { collegesMap, channelMap } = collegeService;

    const subColleges: string[] = [];
    const subCollegesTexts: string[] = [];
    const copiedCategorys: CardCategory[] = [];

    subCategories &&
      subCategories.forEach((category) => {
        subColleges.indexOf(category.collegeId) === -1 && subColleges.push(category.collegeId);
      });

    subCategories.forEach((category) => {
      const hasChild = subCategories.some(
        (subCategory) => subCategory.twoDepthChannelId && subCategory.channelId === category.channelId
      );
      const isSeconCategory = (category.twoDepthChannelId && true) || false;

      (!hasChild || isSeconCategory) && copiedCategorys.push(category);
    });

    subColleges &&
      subColleges.forEach((collegeId) => {
        let text = '';
        copiedCategorys
          .filter((category) => category.collegeId === collegeId)
          .forEach((category, cIndex) => {
            cIndex === 0
              ? (text = `${collegesMap.get(category.collegeId)} > ${
                  (category.twoDepthChannelId && channelMap.get(category.twoDepthChannelId)) ||
                  channelMap.get(category.channelId)
                }`)
              : (text += `, ${
                  (category.twoDepthChannelId && channelMap.get(category.twoDepthChannelId)) ||
                  channelMap.get(category.channelId)
                }`);
          });

        subCollegesTexts.push(text);
      });

    return (
      <>
        {subCollegesTexts.map((text, index) => (
          <p key={index}>{text}</p>
        ))}
      </>
    );
  }

  render() {
    //
    const { isUpdatable, cardId, collegeService, cardService, approvalInfo, onClickCardImport } = this.props;
    const { cardQuery, cardContentsQuery, changeCardQueryProps } = cardService;

    this.renderSubCategoryText();

    return (
      <CardBasicInfoView
        isUpdatable={isUpdatable}
        cardId={cardId}
        collegeService={collegeService}
        cardQuery={cardQuery}
        cardContentsQuery={cardContentsQuery}
        changeCardQueryProps={changeCardQueryProps}
        approvalInfo={approvalInfo}
        onClickPrerequisite={this.onClickPrerequisite}
        onChangeCardStampCount={this.onChangeCardStampCount}
        renderSubCategoryText={this.renderSubCategoryText}
        onClickCardImport={onClickCardImport}
      />
    );
  }
}

export default withRouter(CardBasicInfoContainer);
