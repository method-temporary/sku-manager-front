import React from 'react';
import { inject, observer } from 'mobx-react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Button, Container } from 'semantic-ui-react';

import { reactAutobind, ReactComponent } from '@nara.platform/accent';

import { SelectType, PageModel, SelectTypeModel } from 'shared/model';
import {
  alert,
  AlertModel,
  confirm,
  ConfirmModel,
  PageTitle,
  Pagination,
  SearchBox,
  SubActions,
  RejectEmailModal,
} from 'shared/components';
import { SharedService } from 'shared/present';
import { getDefaultLanguage, getPolyglotToAnyString } from 'shared/components/Polyglot';
import { SearchBoxService } from 'shared/components/SearchBox';
import { castToSelectTypeModel, addSelectTypeBoxAllOption } from 'shared/helper';

import { MemberModel } from '_data/approval/members/model';
import { BadgeState } from '_data/badge/badges/model/vo';

import { certificationManagementUrl } from '../../../../../Routes';
import { MemberService } from '../../../../../approval';
import { UserWorkspaceService } from '../../../../../userworkspace';

import { BadgeApprovalService } from '../../../../index';
import { BadgeCategoryService } from '../../../category';
import BadgeService from '../../../badge/present/logic/BadgeService';
import { BadgeCategoryQueryModel } from '../../../category/model/BadgeCategoryQueryModel';
import { excelDownLoad } from '../../../badge/ui/logic/BadgeHelper';
import BadgeApprovalExcelModel from '../../model/BadgeApprovalExcelModel';
import BadgeApprovalListView from '../view/BadgeApprovalListView';

interface Params {
  cineroomId: string;
}

interface Props extends RouteComponentProps<Params> {}

interface States {
  badgeCategories: SelectTypeModel[];
  emailList: string[];
  nameList: string[];
  badgeNameList: string[];
  operatorInfoList: MemberModel[];
}

interface Injected {
  badgeApprovalService: BadgeApprovalService;
  badgeCategoryService: BadgeCategoryService;
  badgeService: BadgeService;
  sharedService: SharedService;
  searchBoxService: SearchBoxService;
  memberService: MemberService;
  userWorkspaceService: UserWorkspaceService;
}

@inject(
  'badgeApprovalService',
  'sharedService',
  'badgeCategoryService',
  'searchBoxService',
  'badgeService',
  'memberService',
  'userWorkspaceService'
)
@observer
@reactAutobind
class BadgeApprovalListContainer extends ReactComponent<Props, States, Injected> {
  //
  paginationKey = 'badgeApproval';

  constructor(props: Props) {
    super(props);

    this.state = {
      badgeCategories: [new SelectTypeModel()],
      nameList: [],
      emailList: [],
      badgeNameList: [],
      operatorInfoList: [],
    };
  }

  componentDidMount() {
    //
    this.init();
  }

  async init() {
    //
    const { badgeService, badgeCategoryService } = this.injected;
    const { cineroomId } = this.props.match.params;
    // const email = localStorage.getItem('nara.email')!;
    // const approver = await badgeApproverService.findApproverByEmail(email);

    await badgeCategoryService.findAllBadgeCategories(
      BadgeCategoryQueryModel.asBadgeCineroomCategoryRdo('', new PageModel(0, 99999999))
    );

    if (cineroomId === 'ne1-m2-c2') {
      this.getBadgeCategorySelectOptions('');
    } else {
      this.getBadgeCategorySelectOptions(cineroomId);
    }

    await badgeService.findBadgeCounts();
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

  onChangeBadgeCategories(data: string) {
    //
    this.getBadgeCategorySelectOptions(data);
  }

  async findBadgeApprovals() {
    //
    const { badgeApprovalService, sharedService, memberService } = this.injected;
    const pageModel = sharedService.getPageModel(this.paginationKey);

    const totalCount = await badgeApprovalService.findBadgeApprovals(pageModel);
    const operatorIds = badgeApprovalService.badgeApprovals
      .filter((badge) => BadgeState.OpenApproval === badge.state)
      .map((badge) => badge.operator);
    const operatorsInfo = await memberService.findMemberByIds(operatorIds);

    this.setState({ operatorInfoList: operatorsInfo });
    sharedService.setCount(this.paginationKey, totalCount);
  }

  async onSearch() {
    //
    const { clearBadgeApprovalUdo, clearSelectedAllBadgeApprovalPages } = this.injected.badgeApprovalService;

    clearSelectedAllBadgeApprovalPages();
    clearBadgeApprovalUdo();

    await this.findBadgeApprovals();
  }

  // TODO Badge Approval Send Main
  onClickCheckOne(id: string, operatorId: string) {
    //
    const { badgeApprovalService, sharedService } = this.injected;
    const {
      badgeApprovals,
      badgeApproveUdo,
      selectedAllBadgeApprovalPages,
      addSelectedBadgeApproval,
      removeSelectedBadgeApproval,
      addSelectedAllBadgeApprovalPages,
      removeSelectedAllBadgeApprovalPages,
    } = badgeApprovalService;

    let { emailList, nameList, badgeNameList } = this.state;
    const { operatorInfoList } = this.state;

    const pageModel = sharedService.getPageModel(this.paginationKey);

    let copiedEmail = [...emailList];
    let copiedName = [...nameList];
    let copiedBadgeName = [...badgeNameList];

    if (badgeApproveUdo.badgeIds.includes(id)) {
      const idIndex = removeSelectedBadgeApproval(id);

      copiedEmail = copiedEmail.filter((data, indx) => idIndex !== indx);
      copiedName = copiedName.filter((data, indx) => idIndex !== indx);
      copiedBadgeName = copiedBadgeName.filter((data, indx) => idIndex !== indx);

      emailList = copiedEmail;
      nameList = copiedName;
      badgeNameList = copiedBadgeName;

      this.setState({ emailList, nameList, badgeNameList });

      if (selectedAllBadgeApprovalPages.includes(pageModel.page)) {
        removeSelectedAllBadgeApprovalPages(pageModel.page);
      }
    } else {
      const addedIds = addSelectedBadgeApproval(id);

      const ids = badgeApprovals
        .filter((badgeApproval) => badgeApproval.state === BadgeState.OpenApproval)
        .map((badgeApproval) => badgeApproval.id);

      const badgeNames = badgeApprovals
        .filter((badgeApproval) => badgeApproval.id === id)
        .map((badgeApproval) =>
          getPolyglotToAnyString(badgeApproval.name, getDefaultLanguage(badgeApproval.langSupports))
        );

      const email = operatorInfoList
        .filter((operator) => operator.patronKey.keyString === operatorId)
        .map((operator) => operator.email);

      const name = operatorInfoList
        .filter((operator) => operator.patronKey.keyString === operatorId)
        .map((operator) => getPolyglotToAnyString(operator.name, getDefaultLanguage(operator.langSupports)));

      copiedEmail.push(...email);
      copiedName.push(...name);
      copiedBadgeName.push(...badgeNames);

      emailList = copiedEmail;
      nameList = copiedName;
      badgeNameList = copiedBadgeName;

      this.setState({ emailList, nameList, badgeNameList });

      for (let i = 0; i < ids.length; i++) {
        const id = ids[i];

        if (!addedIds.includes(id)) {
          return;
        }
      }

      addSelectedAllBadgeApprovalPages(pageModel.page);
    }
  }

  onClickCheckAll(value: boolean) {
    //
    const { badgeApprovalService, sharedService } = this.injected;

    const {
      badgeApprovals,
      addSelectedBadgeApproval,
      removeSelectedBadgeApproval,
      addSelectedAllBadgeApprovalPages,
      removeSelectedAllBadgeApprovalPages,
    } = badgeApprovalService;
    const pageModel = sharedService.getPageModel(this.paginationKey);

    const { operatorInfoList } = this.state;

    const ids = badgeApprovals
      .filter((badgeApproval) => badgeApproval.state === BadgeState.OpenApproval)
      .map((badgeApproval) => badgeApproval.id);

    const badgeNames = badgeApprovals
      .filter((badgeApproval) => badgeApproval.state === BadgeState.OpenApproval)
      .map((badgeApproval) =>
        getPolyglotToAnyString(badgeApproval.name, getDefaultLanguage(badgeApproval.langSupports))
      );

    const operatorIds = badgeApprovals
      .filter((badgeApproval) => badgeApproval.state === BadgeState.OpenApproval)
      .map((badgeApproval) => badgeApproval.operator);

    let emailList: string[] = [];
    let nameList: string[] = [];
    let badgeNameList: string[] = [];

    badgeNameList.push(...badgeNames);
    if (operatorIds.length !== operatorInfoList.length) {
      //
      for (let i = 0; i < operatorIds.length; i++) {
        //
        const operator = operatorInfoList.filter((info) => info.patronKey.keyString === operatorIds[i]);
        emailList.push(...operator.map((operator) => operator.email));
        nameList.push(
          ...operator.map((operator) =>
            getPolyglotToAnyString(operator.name, getDefaultLanguage(operator.langSupports))
          )
        );
      }
    } else {
      //
      emailList = operatorInfoList.map((operator) => operator.email);
      nameList = operatorInfoList.map((operator) =>
        getPolyglotToAnyString(operator.name, getDefaultLanguage(operator.langSupports))
      );
    }

    if (value) {
      ids.map((id) => addSelectedBadgeApproval(id));
      addSelectedAllBadgeApprovalPages(pageModel.page);
    } else {
      ids.map((id) => removeSelectedBadgeApproval(id));
      removeSelectedAllBadgeApprovalPages(pageModel.page);

      emailList = [];
      nameList = [];
      badgeNameList = [];
    }

    this.setState({ emailList, nameList, badgeNameList });
  }

  async onClickExcelDownLoad() {
    //
    const { badgeApprovalService, userWorkspaceService, badgeCategoryService } = this.injected;

    const length = await badgeApprovalService.findExcelBadgeApprovals();
    const userWorkspaceMap = userWorkspaceService.userWorkspaceMap;
    const categoryMap = badgeCategoryService.badgeCategoryMap;

    const wbList: BadgeApprovalExcelModel[] = [];

    badgeApprovalService.badgeApprovalsExcel?.forEach((badgeWithStudent, index) => {
      wbList.push(
        new BadgeApprovalExcelModel(
          badgeWithStudent,
          length - index,
          userWorkspaceMap.get(badgeWithStudent.cineroomId),
          categoryMap.get(badgeWithStudent.categoryId)
        )
      );
    });

    const fileName = await excelDownLoad(wbList, 'Badge', 'Badge 승인 목록');
    return fileName;
  }

  async onClickMultiOpened() {
    //
    if (this.checkEmail()) {
      confirm(ConfirmModel.getApprovalBadgeConfirm(this.approvalSuccessAlert), false);
    }
  }

  async approvalSuccessAlert() {
    //
    const { badgeApprovalService } = this.injected;

    await badgeApprovalService.modifyAllBadgeStatesOpened();

    alert(
      AlertModel.getApprovalSuccessAlert(() => {
        //
        this.routeToBadgeApprovalList();
      })
    );
  }

  async onClickMultiRejected(): Promise<void> {
    //
    const { badgeApprovalService } = this.injected;

    await badgeApprovalService.modifyAllBadgesStatesRejected();

    this.routeToBadgeApprovalList();
  }

  routeToBadgeApprovalDetail(badgeId: string) {
    //
    this.props.history.push(
      `/cineroom/${this.props.match.params.cineroomId}/${certificationManagementUrl}/badge-approval/approval-detail/${badgeId}`
    );
  }

  routeToBadgeApprovalList() {
    this.props.history.push(
      `/cineroom/${this.props.match.params.cineroomId}/${certificationManagementUrl}/badge-approval/approval-list/`
    );
  }

  checkEmail() {
    const { badgeApprovalService } = this.injected;
    const { badgeApproveUdo } = badgeApprovalService;

    if (badgeApproveUdo.badgeIds.length === 0) {
      alert(AlertModel.getCustomAlert(false, '알림', '학습자를 선택하세요.', '확인'));
      return false;
    } else {
      return true;
    }
  }

  componentWillUnmount() {
    //
    const { badgeApprovalService } = this.injected;
    badgeApprovalService.clearBadgeApprovalQueryProps();
    badgeApprovalService.clearBadgeApprovalUdo();
  }

  render() {
    //
    const { badgeApprovalService, sharedService, userWorkspaceService, badgeCategoryService, badgeService } =
      this.injected;
    const { badgeApprovalQueryModel, changeBadgeApprovalQueryPros } = badgeApprovalService;

    const { startNo, page } = sharedService.getPageModel(this.paginationKey);
    const { userWorkspaceMap, userWorkspaceSelect } = userWorkspaceService;
    const { badgeApprovals, badgeApproveUdo, selectedAllBadgeApprovalPages, setSelectedBadgeApproval } =
      badgeApprovalService;
    const categoriesMap = badgeCategoryService.badgeCategoryMap;
    const checkAll = selectedAllBadgeApprovalPages.includes(page);
    const { cineroomId } = this.props.match.params;

    const { badgeCategories, emailList, nameList, badgeNameList } = this.state;

    const { badgeCounts } = badgeService;

    if (cineroomId === 'ne1-m2-c2') {
      changeBadgeApprovalQueryPros('cineroomId', '');
    } else {
      changeBadgeApprovalQueryPros('cineroomId', cineroomId);
    }
    return (
      <Container fluid>
        <PageTitle breadcrumb={SelectType.badgeApprovalSections} />

        <SearchBox
          name={this.paginationKey}
          queryModel={badgeApprovalQueryModel}
          onSearch={this.onSearch}
          changeProps={changeBadgeApprovalQueryPros}
        >
          <SearchBox.Group name="등록일자">
            <SearchBox.DatePicker
              startFieldName="period.startDateMoment"
              endFieldName="period.endDateMoment"
              searchButtons
            />
          </SearchBox.Group>
          <SearchBox.Group>
            <SearchBox.Select
              name="사용처"
              fieldName="cineroomId"
              options={addSelectTypeBoxAllOption(userWorkspaceSelect)}
              placeholder="전체"
              onChange={(event, data) => this.onChangeBadgeCategories(data.value)}
              disabled={cineroomId !== 'ne1-m2-c2'}
            />
            <SearchBox.Select name="분야" fieldName="categoryId" options={badgeCategories} placeholder="전체" />
            <SearchBox.Select
              name="유형"
              fieldName="type"
              options={castToSelectTypeModel(SelectType.badgeType)}
              placeholder="전체"
            />
            <SearchBox.Select
              name="Level"
              fieldName="level"
              options={castToSelectTypeModel(SelectType.badgeDifficulty)}
              placeholder="전체"
            />
            <SearchBox.Select
              name="Badge 상태"
              fieldName="state"
              options={castToSelectTypeModel(SelectType.badgeState)}
              placeholder="전체"
            />
          </SearchBox.Group>
          <SearchBox.Query
            options={SelectType.searchPartForBadge}
            placeholders={['전체', '검색어를 입력하세요.']}
            searchWordDisabledValues={['', '전체']}
          />
        </SearchBox>

        <Pagination name={this.paginationKey} onChange={this.findBadgeApprovals}>
          <SubActions>
            <SubActions.Left>
              <SubActions.Count>
                <strong>{badgeCounts.totalCount}</strong>개 Badge 등록 | 승인
                <strong>{badgeCounts.openedCount}</strong>개 / 승인대기
                <strong>{badgeCounts.openApprovalCount}</strong>개 / 반려
                <strong>{badgeCounts.rejectedCount}</strong>개
              </SubActions.Count>
            </SubActions.Left>
            <SubActions.Right>
              <Pagination.LimitSelect />
              <SubActions.ExcelButton download onClick={this.onClickExcelDownLoad} />
            </SubActions.Right>
          </SubActions>

          <BadgeApprovalListView
            badgeApprovals={badgeApprovals}
            checkAll={checkAll}
            startNo={startNo}
            userWorkspaceMap={userWorkspaceMap}
            categoriesMap={categoriesMap}
            routeToBadgeApprovalDetail={this.routeToBadgeApprovalDetail}
            selectedBadgeApprovalIds={badgeApproveUdo.badgeIds}
            onClickCheckOne={this.onClickCheckOne}
            onClickCheckAll={this.onClickCheckAll}
          />

          <SubActions>
            <SubActions.Right>
              <RejectEmailModal
                onShow={this.checkEmail}
                onClickReject={this.onClickMultiRejected}
                emailList={emailList}
                nameList={nameList}
                cubeTitles={badgeNameList}
                onChangeRemark={(name, value) => setSelectedBadgeApproval(name, value)}
                type={SelectType.mailOptions[5].value}
                buttonText="일괄반려"
                isApprovalRoleOwner
              />
              <Button onClick={this.onClickMultiOpened} primary>
                일괄승인
              </Button>
            </SubActions.Right>
          </SubActions>
          <Pagination.Navigator />
        </Pagination>
      </Container>
    );
  }
}

export default withRouter(BadgeApprovalListContainer);
