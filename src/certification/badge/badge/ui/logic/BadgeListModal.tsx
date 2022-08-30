import React from 'react';
import { inject, observer } from 'mobx-react';
import { Button } from 'semantic-ui-react';

import { reactAutobind, ReactComponent } from '@nara.platform/accent';

import { PageModel } from 'shared/model';
import { SharedService, AccessRuleService } from 'shared/present';
import { Modal, Pagination } from 'shared/components';
import { SearchBoxService } from 'shared/components/SearchBox';

import { BadgeModel, BadgeWithStudentCountRomModel } from '_data/badge/badges/model';

import { BadgeService } from '../../../../index';
import { UserWorkspaceService } from '../../../../../userworkspace';
import { BadgeCategoryService } from '../../../category';
import { BadgeCategoryQueryModel } from '../../../category/model/BadgeCategoryQueryModel';
import BadgeSearchBoxContainer from './BadgeSearchBoxContainer';
import BadgeListModalView from '../view/BadgeListModalView';

interface Props {
  badge: BadgeModel;
}

interface State {
  relatedBadgeIds: string[];
  relatedBadges: BadgeWithStudentCountRomModel[];
}

interface Injected {
  badgeService: BadgeService;
  sharedService: SharedService;
  searchBoxService: SearchBoxService;
  userWorkspaceService: UserWorkspaceService;
  badgeCategoryService: BadgeCategoryService;
  accessRuleService: AccessRuleService;
}

@inject(
  'badgeService',
  'sharedService',
  'searchBoxService',
  'accessRuleService',
  'userWorkspaceService',
  'badgeCategoryService'
)
@observer
@reactAutobind
class BadgeListModal extends ReactComponent<Props, State, Injected> {
  //
  paginationKey = 'badgeModal';

  constructor(props: Props) {
    super(props);
    this.state = {
      relatedBadgeIds: [],
      relatedBadges: [],
    };

    this.init();
  }

  async init() {
    //
    const { badgeCategoryService } = this.injected;
    await badgeCategoryService.findAllBadgeCategories(
      BadgeCategoryQueryModel.asBadgeCategoryRdo(new BadgeCategoryQueryModel(), new PageModel(0, 99999999))
    );
  }

  onMount() {
    //
    const { badge } = this.injected.badgeService;

    this.setState({
      relatedBadgeIds: badge.relatedBadgeIds,
      relatedBadges: badge.relatedBadges === null ? [] : badge.relatedBadges,
    });
  }

  async findBadge() {
    //
    const { badgeService, sharedService } = this.injected;
    const pageModel = sharedService.getPageModel(this.paginationKey);
    const { badge } = badgeService;

    badgeService.changeBadgeModalQueryProp('groupSequence', badge.groupBasedAccessRule);
    badgeService.changeBadgeModalQueryProp('state', 'Opened');

    const totalCount = await badgeService.findModalBadges(pageModel);

    sharedService.setCount(this.paginationKey, totalCount);
  }

  onClickCheck(badgeModel: BadgeWithStudentCountRomModel, value: string) {
    //
    const { relatedBadgeIds, relatedBadges } = this.state;
    const copiedRelatedBadgeIds: string[] = [...relatedBadgeIds];
    const copiedRelatedBadges: BadgeWithStudentCountRomModel[] = [...relatedBadges];

    if (relatedBadgeIds.includes(value)) {
      //
      const filteredIds = copiedRelatedBadgeIds.filter((id) => id !== value);
      const filteredModels = copiedRelatedBadges.filter((badge) => badge.id !== value);

      this.setState({
        relatedBadgeIds: [...filteredIds],
        relatedBadges: [...filteredModels],
      });
    } else {
      //
      copiedRelatedBadgeIds.push(value);
      copiedRelatedBadges.push(badgeModel);

      this.setState({
        relatedBadgeIds: [...copiedRelatedBadgeIds],
        relatedBadges: [...copiedRelatedBadges],
      });
    }
  }

  onClickOk(close: () => void) {
    //
    const { changeBadgeProp } = this.injected.badgeService;
    const { relatedBadgeIds, relatedBadges } = this.state;

    changeBadgeProp('relatedBadgeIds', [...relatedBadgeIds]);
    changeBadgeProp('relatedBadges', [...relatedBadges]);

    close();
  }

  render() {
    //
    const { badgeService, userWorkspaceService, badgeCategoryService } = this.injected;
    const { badge } = this.props;

    const creatorCineroomId = badge.patronKey.keyString.slice(badge.patronKey.keyString.indexOf('@') + 1);

    return (
      <Modal size="large" trigger={<Button>Badge 검색</Button>} onMount={this.onMount}>
        <Modal.Header>Badge 검색</Modal.Header>
        <Modal.Content>
          <BadgeSearchBoxContainer
            findBadges={this.findBadge}
            paginationKey={this.paginationKey}
            modal
            creatorCineroomId={creatorCineroomId}
          />

          <Pagination name={this.paginationKey} onChange={this.findBadge}>
            <BadgeListModalView
              badgeIds={this.state.relatedBadgeIds}
              badges={badgeService.badgeWithStudents}
              userWorkspaceMap={userWorkspaceService.userWorkspaceMap}
              categoriesMap={badgeCategoryService.badgeCategoryMap}
              onClickCheck={this.onClickCheck}
            />
            <Pagination.Navigator />
          </Pagination>
        </Modal.Content>
        <Modal.Actions>
          <Modal.CloseButton>취소</Modal.CloseButton>
          <Modal.CloseButton primary onClickWithClose={(event, close) => this.onClickOk(close)}>
            추가
          </Modal.CloseButton>
        </Modal.Actions>
      </Modal>
    );
  }
}

export default BadgeListModal;
