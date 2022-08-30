import React from 'react';
import { inject, observer } from 'mobx-react';
import { RouteComponentProps, withRouter } from 'react-router';

import { reactAutobind, ReactComponent } from '@nara.platform/accent';

import { PageModel, UserGroupRuleModel, GroupBasedAccessRule, SelectTypeModel } from 'shared/model';
import { AccessRuleService } from 'shared/present';
import { getPolyglotToAnyString } from 'shared/components/Polyglot';
import { SearchBoxService } from 'shared/components/SearchBox';

import UserWorkspaceService from 'userworkspace/present/logic/UserWorkspaceService';
import { BadgeService } from '../../../../index';
import { BadgeCategoryService } from '../../../category';
import { BadgeCategoryQueryModel } from '../../../category/model/BadgeCategoryQueryModel';
import BadgeSearchBoxView from '../view/BadgeSearchBoxView';

interface Props extends RouteComponentProps<Params> {
  findBadges: () => void;
  paginationKey: string;
  modal?: boolean;
  creatorCineroomId?: string;
}

interface Params {
  cineroomId: string;
}

interface States {
  badgeCategories: SelectTypeModel[];
}

interface Injected {
  badgeService: BadgeService;
  badgeCategoryService: BadgeCategoryService;
  searchBoxService: SearchBoxService;
  accessRuleService: AccessRuleService;
  userWorkspaceService: UserWorkspaceService;
}

@inject('badgeService', 'userWorkspaceService', 'badgeCategoryService', 'searchBoxService', 'accessRuleService')
@observer
@reactAutobind
class BadgeSearchBoxContainer extends ReactComponent<Props, States, Injected> {
  //
  constructor(props: Props) {
    super(props);

    this.state = {
      badgeCategories: [new SelectTypeModel()],
    };
  }

  async componentDidMount() {
    //
    const { cineroomId } = this.props.match.params;
    const { badgeCategoryService } = this.injected;

    this.onClickCancelUserGroups();

    await badgeCategoryService.findAllBadgeCategories(
      BadgeCategoryQueryModel.asBadgeCineroomCategoryRdo('', new PageModel(0, 99999999))
    );

    if (cineroomId === 'ne1-m2-c2') {
      this.getBadgeCategorySelectOptions('');
    } else {
      this.getBadgeCategorySelectOptions(cineroomId);
    }
  }

  getBadgeCategorySelectOptions(id: string) {
    //
    const { badgeCategoryService } = this.injected;

    const badgeCategoryOptions: SelectTypeModel[] = [new SelectTypeModel()];

    if (id === '') {
      //
      badgeCategoryService.badgeCategories?.forEach((badgeCategory) => {
        badgeCategoryOptions.push(
          new SelectTypeModel(badgeCategory.id, getPolyglotToAnyString(badgeCategory.name), badgeCategory.id)
        );
      });
    } else {
      //
      badgeCategoryService.badgeCategories
        .filter(
          (badgeCategory) =>
            badgeCategory.patronKey.keyString.slice(badgeCategory.patronKey.keyString.indexOf('@') + 1) === id
        )
        ?.forEach((badgeCategory) =>
          badgeCategoryOptions.push(
            new SelectTypeModel(badgeCategory.id, getPolyglotToAnyString(badgeCategory.name), badgeCategory.id)
          )
        );
    }
    this.setState({ badgeCategories: badgeCategoryOptions });
  }

  onSaveAccessRule(userGroupRules: UserGroupRuleModel[]): void {
    //
    const { accessRuleService, searchBoxService } = this.injected;
    const accessRuleList = userGroupRules.map((userGroupRule) => userGroupRule.seq);
    const ruleStrings = GroupBasedAccessRule.getRuleValueString(userGroupRules);

    accessRuleService.clearGroupBasedAccessRule();
    accessRuleService.changeGroupBasedAccessRuleProp(
      `groupAccessRoles[${accessRuleService.groupBasedAccessRule.accessRules.length}].accessRoles`,
      accessRuleService.accessRules
    );

    searchBoxService.changePropsFn('groupSequences', accessRuleList);
    searchBoxService.changePropsFn('ruleStrings', ruleStrings);
  }

  onClickCancelUserGroups() {
    //
    const { searchBoxService } = this.injected;

    searchBoxService.changePropsFn('groupSequences', []);
    searchBoxService.changePropsFn('ruleStrings', '');
  }

  selectTypeBadgeCategory(data: string) {
    this.getBadgeCategorySelectOptions(data);
  }

  render() {
    //
    const { findBadges, paginationKey, modal, creatorCineroomId } = this.props;
    const { badgeService, userWorkspaceService } = this.injected;
    const { cineroomId } = this.props.match.params;
    const { badgeCategories } = this.state;
    const queryModel = modal ? badgeService.badgeModalQueryModel : badgeService.badgeQueryModel;
    const changeProps = modal ? badgeService.changeBadgeModalQueryProp : badgeService.changeBadgeQueryProp;

    if (cineroomId !== 'ne1-m2-c2' || modal) {
      if (creatorCineroomId) {
        changeProps('cineroomId', creatorCineroomId);
      } else {
        changeProps('cineroomId', cineroomId);
      }
    } else {
      changeProps('cineroomId', '');
    }

    return (
      <BadgeSearchBoxView
        findBadges={findBadges}
        queryModel={queryModel}
        changeBadgeQueryProp={changeProps}
        paginationKey={paginationKey}
        userWorkspaceSelect={userWorkspaceService.userWorkspaceSelect}
        selectTypeBadgeCategories={badgeCategories}
        onSaveAccessRule={this.onSaveAccessRule}
        onClickCancelUserGroups={this.onClickCancelUserGroups}
        modal={modal}
        cineroomId={cineroomId}
        selectTypeBadgeCategory={this.selectTypeBadgeCategory}
      />
    );
  }
}

export default withRouter(BadgeSearchBoxContainer);
