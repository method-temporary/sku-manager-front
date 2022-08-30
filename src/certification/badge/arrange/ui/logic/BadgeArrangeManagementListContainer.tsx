import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { reactAutobind, ReactComponent } from '@nara.platform/accent';
import { RouteComponentProps, withRouter } from 'react-router';
import { SharedService } from 'shared/present';

import { certificationManagementUrl } from '../../../../../Routes';
import BadgeArrangeTreeSidebar from '../view/BadgeArrangeTreeSidebar';
import BadgeArrangeService from '../../present/logic/BadgeArrangeService';
import ChartTreeViewModel from '../../model/ChartTreeViewModel';

import { BadgeCategoryService } from '../../../category';
import BadgeArrangeManagementListView from '../view/BadgeArrangeManagementListView';
import { alert, AlertModel } from 'shared/components';
import { PageModel } from 'shared/model';
import BadgeWithStudentCountRomModel from '../../../../../_data/badge/badges/model/BadgeWithStudentCountRomModel';
import { BadgeCategoryQueryModel } from '../../../category/model/BadgeCategoryQueryModel';
import { UserWorkspaceService } from '../../../../../userworkspace';

interface Props extends RouteComponentProps<Params> {}

interface States {
  arrangeTree: ChartTreeViewModel[];
}

interface Params {
  cineroomId: string;
}

interface Injected {
  badgeArrangeService: BadgeArrangeService;
  sharedService: SharedService;
  badgeCategoryService: BadgeCategoryService;
  userWorkspaceService: UserWorkspaceService;
}

@inject('badgeArrangeService', 'sharedService', 'userWorkspaceService', 'badgeCategoryService')
@observer
@reactAutobind
class BadgeArrangeManagementListContainer extends ReactComponent<Props, States, Injected> {
  //
  constructor(props: Props) {
    super(props);

    this.state = {
      arrangeTree: [],
    };
  }

  componentDidMount() {
    //
    this.init();
  }

  async init() {
    //
    await this.setBadgeCategoryProps();
    await this.findAllArrangesTree();
  }

  async findAllArrangesTree() {
    //
    const { badgeArrangeService, badgeCategoryService } = this.injected;
    badgeArrangeService.clearBadgeList();

    const offsetElementList = await badgeCategoryService.findAllBadgeCategories(
      BadgeCategoryQueryModel.asBadgeCategoryDisPlayOrder(
        badgeCategoryService.badgeCategoryQuery,
        new PageModel(0, 99999999)
      )
    );

    badgeArrangeService.findAllArrangesTree(offsetElementList.results).then((menuTree) => {
      this.setState({ arrangeTree: menuTree });

      if (menuTree && menuTree.length && menuTree[0].nodes.length) {
        const categoryId = menuTree[0].nodes[0].categoryId || '';
        const categoryName = menuTree[0].nodes[0].label;
        const treeId = menuTree[0].nodes[0].treeId || '';

        this.handleChangeTreeNode(treeId, categoryName, categoryId);
      }
    });
  }

  setBadgeCategoryProps(cineroomId?: string) {
    //
    const { badgeArrangeService, badgeCategoryService } = this.injected;

    let id;
    if (cineroomId) {
      id = cineroomId;
    } else {
      id = this.props.match.params.cineroomId;
    }

    badgeArrangeService.setCineroomId(id);
    badgeCategoryService.changeBadgeCategoryQueryProps('cineroomId', id);
  }

  findAllArrangeBadgeByCategory(treeId: string, categoryName: string, categoryId: string) {
    //
    const { badgeArrangeService } = this.injected;

    badgeArrangeService.setSelectedCategory(treeId, categoryName, categoryId);
    badgeArrangeService.findAllBadgeArrangeByCategory();
  }

  handleChangeTreeNode(treeId: string, categoryName: string, categoryId: string) {
    //
    this.findAllArrangeBadgeByCategory(treeId, categoryName, categoryId);
  }

  handleUpDownButtonClick(badge: BadgeWithStudentCountRomModel, oldSeq: number, newSeq: number) {
    //
    const { badgeArrangeService } = this.injected;
    badgeArrangeService.setBadgeResultsSet(badge, oldSeq, newSeq);
  }

  handleSaveButtonClick() {
    //
    const { badgeArrangeService } = this.injected;
    badgeArrangeService.modifyBadgeArrange().then(() => {
      alert(
        AlertModel.getSaveSuccessAlert(() => {
          const { badgeArrangeService } = this.injected;
          badgeArrangeService.findAllBadgeArrangeByCategory();
        })
      );
    });
  }

  onChangeQueryProps(data: any) {
    this.setBadgeCategoryProps(data.value);
    this.findAllArrangesTree();
  }

  routeToBadgeDetail(badgeId: string) {
    //
    this.props.history.push(
      `/cineroom/${this.props.match.params.cineroomId}/${certificationManagementUrl}/badges/badge-detail/${badgeId}`
    );
  }

  render() {
    const { badgeCategoryQuery } = this.injected.badgeArrangeService;
    const { userWorkspaceService, badgeCategoryService, badgeArrangeService } = this.injected;
    const { badges, selectedCategory } = badgeArrangeService;
    const { arrangeTree } = this.state;
    const { userWorkspaceSelect, userWorkspaceMap } = userWorkspaceService;
    const { cineroomId } = this.props.match.params;

    return (
      <>
        <BadgeArrangeTreeSidebar
          company="All"
          onChange={this.handleChangeTreeNode}
          arrangeTree={arrangeTree}
          badgeCategoryQuery={badgeCategoryQuery}
          userWorkspaceSelect={userWorkspaceSelect}
          onChangeQueryProp={this.onChangeQueryProps}
          cineroomId={cineroomId}
        />
        <BadgeArrangeManagementListView
          handleSaveButtonClick={this.handleSaveButtonClick}
          handleUpDownButtonClick={this.handleUpDownButtonClick}
          badges={badges}
          selectedCategoryName={selectedCategory.name}
          categoriesMap={badgeCategoryService.badgeCategoryMap}
          userWorkspaceMap={userWorkspaceMap}
          routeToBadgeDetail={this.routeToBadgeDetail}
          arrangeTree={arrangeTree}
        />
      </>
    );
  }
}
export default withRouter(BadgeArrangeManagementListContainer);
