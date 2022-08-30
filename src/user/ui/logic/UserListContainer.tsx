import 'react-datepicker/dist/react-datepicker.css';

import React from 'react';
import { inject, observer } from 'mobx-react';
import { RouteComponentProps, withRouter } from 'react-router';
import { Button, Container, Select } from 'semantic-ui-react';
import moment from 'moment';
import XLSX from 'xlsx';

import { reactAutobind, ReactComponent } from '@nara.platform/accent';
import { patronInfo } from '@nara.platform/dock';

import { SharedService, AccessRuleService } from 'shared/present';
import { SelectType, UserGroupRuleModel, SelectTypeModel, GroupBasedAccessRule } from 'shared/model';
import {
  PageTitle,
  SubActions,
  Pagination,
  SearchBox,
  alert,
  AlertModel,
  confirm,
  ConfirmModel,
  UserGroupSelectModal,
  Loader,
} from 'shared/components';
import { SearchBoxService } from 'shared/components/SearchBox';
import { LoaderService } from 'shared/components/Loader';
import { getPolyglotToAnyString } from 'shared/components/Polyglot';
import { addSelectTypeBoxAllOption } from 'shared/helper';

import { UserService } from '../../index';
import UserListView from '../view/UserListView';
import { UserGroupCategoryService } from '../../../usergroup';
import UserGroupService from '../../../usergroup/group/present/logic/UserGroupService';
import { UserExcelModel } from '../../model/UserExcelModel';

import { getExcelHeader, setExcelUserGroupInfo, setSkProfileUserGroupInfo } from './UserHelper';
import UserExcelUploadModal from './UserExcelUploadModal';
import { UserExcelUploadModel } from '../../model/UserExcelUploadModel';
import { UserWorkspaceService } from '../../../userworkspace';

interface Props extends RouteComponentProps<Params> {}

interface Params {
  cineroomId: string;
}

interface State {
  checked: boolean;
  categoryId: string;
  userGroupSequence: number;
  fileName: string;
  uploadModel: UserExcelUploadModel[];
  companySelectOptions: SelectTypeModel[];
}

interface Injected {
  userService: UserService;
  sharedService: SharedService;
  userGroupCategoryService: UserGroupCategoryService;
  userGroupService: UserGroupService;
  searchBoxService: SearchBoxService;
  accessRuleService: AccessRuleService;
  userWorkspaceService: UserWorkspaceService;
  loaderService: LoaderService;
}

@inject(
  'userService',
  'sharedService',
  'userGroupCategoryService',
  'userGroupService',
  'searchBoxService',
  'accessRuleService',
  'userWorkspaceService',
  'loaderService'
)
@observer
@reactAutobind
class UserListContainer extends ReactComponent<Props, State, Injected> {
  //
  companys: any[] = [];

  readonly paginationKey = 'profile';

  constructor(props: Props) {
    super(props);
    this.state = {
      checked: false,
      categoryId: '',
      userGroupSequence: -1,
      fileName: '',
      uploadModel: [],
      companySelectOptions: [],
    };

    // this.injected.userService.clearSkProfileQuery();
  }

  componentDidMount(): void {
    //
    this.init();
  }

  async init() {
    //
    const { userGroupCategoryService, userGroupService } = this.injected;

    await this.setSearchBoxOptions();

    if (this.state.companySelectOptions.length === 0) {
      userGroupCategoryService.findUserGroupCategorySelectType();
    }

    userGroupService.findUserGroupMap();
    // this.findListSkProfiles();
    this.onChangeSkProfileQueryProp('datePeriod.startDateMoment', moment('2019-12-01').startOf('day'));
  }

  async setSearchBoxOptions() {
    //
    const { userWorkspaceService } = this.injected;

    await userWorkspaceService.findAllWorkspaces();
    await this.getCompanySelectOptions();
  }

  findListSkProfiles() {
    //
    const { sharedService, userService } = this.injected;
    const { offset, limit } = sharedService.getPageModel(this.paginationKey);

    this.injected.userService.onChangeUserQueryProp('offset', offset);

    this.setState({ checked: false });

    userService.findAllUserBySearchKey(limit).then((skProfiles) => {
      if (skProfiles) {
        sharedService.setCount(this.paginationKey, skProfiles.totalCount);
      }
    });
  }

  onChangeSkProfileQueryProp(name: string, value: any) {
    //
    this.injected.userService.onChangeUserQueryProp(name, value);
  }

  onSkProfileClick(profileId: string) {
    //
    this.props.history.push(
      `/cineroom/${this.props.match.params.cineroomId}/user-management/user/user-detail/${profileId}`
    );
  }

  onSearchClickProfile() {
    //
    this.findListSkProfiles();
  }

  async onChangeUserGroupCategory(categoryId: string) {
    //
    // await this.injected.userService.onChangeSkQueryProfileProp('userGroupSequence', -1);
    await this.setState({ userGroupSequence: -1, categoryId });

    await this.injected.userGroupService.findUserGroupSelectType(categoryId);
  }

  async onChangeUserGroup(sequence: number) {
    //
    await this.setState({ userGroupSequence: sequence });
  }

  onClickCheckAll(value: boolean) {
    //
    const { users, changeUserProp } = this.injected.userService;

    this.setState({ checked: value });

    users.results &&
      users.results.forEach((skProfile, index) => {
        changeUserProp(index, 'checked', value);
      });
  }

  onClickCheckOne(index: number, name: string, value: boolean) {
    //
    this.injected.userService.changeUserProp(index, name, value);
  }

  onClickPageChange(page: number) {
    //
    this.setState({ checked: false });
    this.injected.sharedService.setPage(this.paginationKey, page);
    this.findListSkProfiles();
  }

  async onClickAddUserGroup() {
    //
    const { userQuery, users, assignUserGroupUser, onChangeUserQueryProp } = this.injected.userService;
    const checkedList = users.results
      .filter((userWithPisAgreement) => userWithPisAgreement.user.checked)
      .map((userWithPisAgreement) => userWithPisAgreement.user.id);

    onChangeUserQueryProp('userGroupSequence', this.state.userGroupSequence);

    if (checkedList.length === 0) {
      alert(AlertModel.getRequiredChoiceAlert('구성원'));
      return;
    }

    if (userQuery.userGroupSequence === -1) {
      alert(AlertModel.getRequiredChoiceAlert('사용자 그룹'));
      return;
    }

    confirm(
      ConfirmModel.getCustomConfirm('확인', '사용자 그룹에 추가하시겠습니까?', false, '추가', '취소', () => {
        assignUserGroupUser(checkedList, [userQuery.userGroupSequence]);
        alert(AlertModel.getSaveSuccessAlert(this.findListSkProfiles));
      }),
      false
    );
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

  async onClickExcelDown() {
    //
    const { userService, userGroupCategoryService, loaderService } = this.injected;
    const cineroomId =
      this.state.companySelectOptions.length > 0 ? this.getCineroomIdByUsId() : patronInfo.getCineroomId() || '';

    loaderService.openLoader(true);

    this.injected.userService.onChangeUserQueryProp('offset', 0);

    const wbList: UserExcelModel[] = [];

    const { groupHeader, header, merge } = await getExcelHeader(userGroupCategoryService, cineroomId);

    const users = await userService.findAllUserForExcel(99999999);

    const userGroupMap = this.injected.userGroupService.userGroupMap;

    await users.forEach((userWithPisAgreement) => {
      const skProfileExcel = new UserExcelModel(userWithPisAgreement);
      let userGroupName = '';

      userWithPisAgreement.user.userGroupSequences.sequences.map((sequence, index) =>
        index === 0
          ? (userGroupName = userGroupMap.get(sequence)?.userGroupName || '')
          : (userGroupName += ', ' + userGroupMap.get(sequence)?.userGroupName)
      );

      skProfileExcel['사용자 그룹'] = userGroupName;

      wbList.push(skProfileExcel);
    });

    const fileName = await this.excelDown(wbList, groupHeader, header, merge, cineroomId);
    loaderService.closeLoader(true);
    return fileName;
  }

  excelDown(wbList: UserExcelModel[], groupHeader: string[], header: string[], merge: any[], cineroomId: string) {
    //
    const sheet = XLSX.utils.json_to_sheet([], { header: groupHeader });

    sheet['!merges'] = merge;
    XLSX.utils.sheet_add_json(sheet, wbList, {
      origin: -1,
      header,
    });

    setExcelUserGroupInfo(sheet, wbList, this.injected.userGroupCategoryService);

    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, sheet, '구성원 관리');

    const day = moment();
    const date = day.format('YYYY-MM-DD');
    const time = day.format('HH:mm:ss');
    const fileName = `구성원 관리 목록 -.${date}_${time}.xlsx`;
    XLSX.writeFile(wb, fileName, { compression: true });
    return fileName;
  }

  excelUpload(file: File, failFn?: () => void) {
    //
    const { loaderService } = this.injected;

    loaderService.openPageLoader(true);

    this.setState({ fileName: file.name });
    const fileReader = new FileReader();
    fileReader.onload = (e: any) => {
      let binary = '';
      const data = new Uint8Array(e.target.result);
      const length = data.byteLength;

      for (let i = 0; i < length; i++) {
        binary += String.fromCharCode(data[i]);
      }

      const workbook: any = XLSX.read(binary, { type: 'binary', cellText: true, cellDates: true });

      workbook.SheetNames.forEach((item: any) => {
        const jsonArray = XLSX.utils.sheet_to_json(workbook.Sheets[item], { range: 1, raw: false });
        if (jsonArray.length === 0) {
          return;
        }

        setSkProfileUserGroupInfo(jsonArray, this.injected.userGroupCategoryService)
          .then((response) => {
            if (response.getSuccess) {
              this.setState({ uploadModel: response.getList });
            } else {
              const uploadModel: UserExcelUploadModel[] = [];

              this.setState({ fileName: '', uploadModel });
              alert(AlertModel.getCustomAlert(false, '엑셀 업로드 실패', response.getMessage, '확인'));
            }
            return response.getSuccess;
          })
          .then((success) => {
            if (!success) {
              failFn && failFn();
            }
            loaderService.closeLoader(true);
          })
          .catch(() => {
            const uploadModel: UserExcelUploadModel[] = [];
            this.setState({ fileName: '', uploadModel });
            alert(AlertModel.getCustomAlert(false, '엑셀 업로드 실패', '잠시 후에 다시 시도해 주세요.', '확인'));
            loaderService.closeLoader(true);
          });
      });
    };
    fileReader.readAsArrayBuffer(file);
  }

  excelRead(close: () => void) {
    //
    const { userService, loaderService } = this.injected;

    loaderService.openPageLoader(true);

    if (this.state.fileName === '') {
      alert(AlertModel.getRequiredChoiceAlert('엑셀 파일'));
      loaderService.closeLoader(true);
      return;
    }

    userService.reassignUserGroupWithExcel(this.state.uploadModel).then((response) => {
      loaderService.closeLoader(true);
      alert(
        AlertModel.getCustomAlert(
          false,
          '업로드 결과',
          `총 ${response.requestCount}명의 구성원 중 성공 : ${response.successCount} 실패 : ${
            (response.failedEmails && response.failedEmails.length) || 0
          } `,
          '확인',
          () => {
            this.findListSkProfiles();
            close();
          },
          (response.failedEmails && this.getFailedEmailsText(response.failedEmails)) || undefined
        )
      );
    });

    const uploadModel: UserExcelUploadModel[] = [];
    this.setState({ fileName: '', uploadModel });
  }

  getFailedEmailsText(failedEmails: string[]) {
    //
    let failEmailsText = '실패한 E-mail : ';

    failedEmails &&
      failedEmails.forEach((email) => {
        failEmailsText += `\n ${email}`;
      });

    return failEmailsText;
  }

  getCompanySelectOptions() {
    //
    const { userWorkspaces, getWorkSpaceByCineroomId } = this.injected.userWorkspaceService;
    const cineroomId = this.props.match.params.cineroomId;

    const companySelectOptions: SelectTypeModel[] = [];

    if (cineroomId === 'ne1-m2-c2') {
      userWorkspaces &&
        userWorkspaces.forEach((userWorkspace) => {
          if (userWorkspace.id !== 'ne1-m2-c2') {
            companySelectOptions.push(
              new SelectTypeModel(userWorkspace.usid, getPolyglotToAnyString(userWorkspace.name), userWorkspace.usid)
            );
          }
        });
    } else {
      getWorkSpaceByCineroomId(cineroomId).then((workSpace) => {
        if (workSpace.hasChildren) {
          userWorkspaces &&
            userWorkspaces.forEach((userWorkspace) => {
              if (!userWorkspace.hasChildren && userWorkspace.parentId === workSpace.id) {
                companySelectOptions.push(
                  new SelectTypeModel(
                    userWorkspace.usid,
                    getPolyglotToAnyString(userWorkspace.name),
                    userWorkspace.usid
                  )
                );
              }
            });
        }
      });
    }

    this.setState({ companySelectOptions });
  }

  getCineroomIdByUsId() {
    //
    const { userService, userWorkspaceService } = this.injected;
    const { userQuery } = userService;
    const { userWorkspaces } = userWorkspaceService;

    const companyCode = userQuery.company;

    let cineroomId = '';

    userWorkspaces &&
      userWorkspaces.forEach((workSpace) => {
        if (workSpace.usid === companyCode) {
          cineroomId = workSpace.id;
        }
      });

    return cineroomId;
  }

  render() {
    //
    const { userService } = this.injected;
    const { userQuery, users, onChangeUserQueryProp } = userService;
    const { startNo } = this.injected.sharedService.getPageModel(this.paginationKey);

    return (
      <Container fluid>
        <PageTitle breadcrumb={SelectType.sectionProfiles}>구성원 관리 </PageTitle>

        <SearchBox
          changeProps={onChangeUserQueryProp}
          queryModel={userQuery}
          onSearch={this.onSearchClickProfile}
          name={this.paginationKey}
        >
          <SearchBox.Group name="가입일자">
            <SearchBox.DatePicker
              startFieldName="period.startDateMoment"
              endFieldName="period.endDateMoment"
              ago="2019-12-01"
            />
          </SearchBox.Group>
          <SearchBox.Group>
            {this.state.companySelectOptions.length > 0 && (
              <SearchBox.Select
                name="소속회사"
                fieldName="company"
                placeholder="전체"
                options={addSelectTypeBoxAllOption(this.state.companySelectOptions)}
                // options={addSelectTypeBoxAllOption(this.injected.userWorkspaceService.userWorkspaceSelectUsId)}
              />
            )}
            <SearchBox.Select
              name="개인정보동의"
              fieldName="signed"
              placeholder="전체"
              options={SelectType.pisAgreement}
            />
          </SearchBox.Group>
          <SearchBox.Query
            options={SelectType.searchProfile}
            placeholders={['전체', '검색어를 입력해주세요.']}
            searchWordDisabledKey="searchPart"
            searchWordDisabledValues={['', '전체']}
          />
          <SearchBox.Group name="사용자 그룹">
            <div className="field">
              <UserGroupSelectModal
                multiple
                onConfirm={this.onSaveAccessRule}
                button="선택"
                title="사용자 그룹 추가"
                description="사용자 그룹을 선택해주세요."
              />
            </div>
            <SearchBox.Input width={6} fieldName="ruleStrings" readOnly placeholder="사용자 그룹을 선택하세요." />
            <SearchBox.FieldButton onClick={this.onClickCancelUserGroups}>선택 취소</SearchBox.FieldButton>
          </SearchBox.Group>
        </SearchBox>

        <Pagination name={this.paginationKey} onChange={(data) => this.onClickPageChange(data.activePage)}>
          <SubActions>
            <SubActions.Left width={3}>
              <SubActions.Count number={users && users.totalCount} text="명 등록" />
            </SubActions.Left>
            <SubActions.Right width={13}>
              <UserExcelUploadModal
                fileName={this.state.fileName}
                uploadFile={this.excelUpload}
                onCancel={() => {
                  const uploadModel: UserExcelUploadModel[] = [];
                  this.setState({ fileName: '', uploadModel });
                }}
                onOk={this.excelRead}
              />
              <SubActions.ExcelButton
                download
                disabled={this.state.companySelectOptions.length > 0 && userQuery.company === ''}
                onClick={this.onClickExcelDown}
              />

              {this.state.companySelectOptions.length === 0 && (
                <>
                  <label>선택한 사용자를 </label>
                  <Select
                    className="small-border m0 sub-actions"
                    placeholder="사용자 그룹 분류"
                    value={this.state.categoryId}
                    options={this.injected.userGroupCategoryService.userGroupCategorySelectType}
                    onChange={(event: any, data: any) => this.onChangeUserGroupCategory(data.value)}
                  />
                  <Select
                    className="small-border m0 sub-actions"
                    placeholder="사용자 그룹"
                    value={this.state.userGroupSequence === -1 ? '' : this.state.userGroupSequence}
                    options={this.injected.userGroupService.userGroupSelectType}
                    onChange={(event: any, data: any) => this.onChangeUserGroup(data.value)}
                  />
                  <Button primary type="button" onClick={this.onClickAddUserGroup}>
                    그룹에 추가
                  </Button>
                </>
              )}
              <Pagination.LimitSelect />
            </SubActions.Right>
          </SubActions>

          <Loader>
            <UserListView
              checked={this.state.checked}
              startNo={startNo}
              results={users.results}
              onClickCheckAll={this.onClickCheckAll}
              onClickCheckOne={this.onClickCheckOne}
              onSkProfileClick={this.onSkProfileClick}
              userGroupMap={this.injected.userGroupService.userGroupMap}
            />
          </Loader>

          <Pagination.Navigator />
        </Pagination>
      </Container>
    );
  }
}

export default withRouter(UserListContainer);
