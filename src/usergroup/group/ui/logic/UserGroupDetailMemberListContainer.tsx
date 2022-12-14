import React from 'react';
import { inject, observer } from 'mobx-react';
import { reactAutobind, ReactComponent } from '@nara.platform/accent';
import { MemberViewModel } from '@nara.drama/approval';
import { Button, Icon, Tab } from 'semantic-ui-react';
import moment from 'moment';
import XLSX from 'xlsx';

import { SelectType } from 'shared/model';
import { SharedService } from 'shared/present';
import { alert, confirm, AlertModel, ConfirmModel, Pagination, SearchBox, SubActions, Loader } from 'shared/components';
import { LoaderService } from 'shared/components/Loader';
import { getPolyglotToAnyString } from 'shared/components/Polyglot';
import { addSelectTypeBoxAllOption } from 'shared/helper';

import { UserService } from 'user';
import ManagerListModalView from 'cube/cube/ui/view/ManagerListModal';
import { getCompanySelectOptions } from 'userworkspace/present/logic/userWorkspaceHelp';
import { UserWorkspaceService } from 'userworkspace';

import { UserGroupService } from '../../../index';
import UserGroupMemberExcelModel from '../../model/UserGroupMemberExcelModel';
import UserGroupMemberListView from '../view/UserGroupMemberListView';
import ExcelReadModal from './ExcelReadModal';
import UserGroupEmailExcelModel from '../../model/UserGroupEmailslModel';
import UserGroupExcelUploadFailureListModal from './UserGroupExcelUploadFailureListModal';

interface Props {
  cineroomId: string;
}

interface State {
  checked: boolean;
  excelUploadModalOpen: boolean;
  userGroupEmailExcelModel: UserGroupEmailExcelModel;
  invalidModalWin: boolean;
  invaiidMembers: any[];
  failedReasonText: string;
  userGroupEmailExcelFileName: string;
}

interface Injected {
  userGroupService: UserGroupService;
  sharedService: SharedService;
  userService: UserService;
  userWorkspaceService: UserWorkspaceService;
  loaderService: LoaderService;
}

@inject('userGroupService', 'sharedService', 'userService', 'userWorkspaceService', 'loaderService')
@observer
@reactAutobind
class UserGroupDetailMemberListContainer extends ReactComponent<Props, State, Injected> {
  //
  paginationKey = 'userGroupMember';

  constructor(props: Props) {
    //
    super(props);
    this.state = {
      checked: false,
      excelUploadModalOpen: false,
      userGroupEmailExcelModel: new UserGroupEmailExcelModel(),
      invalidModalWin: false,
      invaiidMembers: [],
      failedReasonText: '',
      userGroupEmailExcelFileName: '',
    };

    this.injected.userWorkspaceService.findAllWorkspaces();

    this.injected.userGroupService.clearUserGroupMemberQuery();
  }

  async findUserGroupMember() {
    //
    const { userService, userGroupService, sharedService } = this.injected;

    const sequences = [userGroupService.userGroup.sequence];

    await userGroupService.changeUserGroupMemberQueryProps('groupSequences', sequences);

    this.setState({ checked: false });

    const totalCount = await userService.findUserUserGroupMember(
      userGroupService.userGroupMemberQuery,
      sharedService.getPageModel(this.paginationKey)
    );

    await sharedService.setCount(this.paginationKey, totalCount);
  }

  async onClickExcelDownload(): Promise<string> {
    //
    const { userService, userGroupService } = this.injected;
    const { findAllUserUserGroupMemberForExcel } = userService;
    const { userGroup, userGroupMemberQuery } = userGroupService;

    await findAllUserUserGroupMemberForExcel(userGroupMemberQuery);

    const fileName = await this.excelDown(getPolyglotToAnyString(userGroup.name));
    return fileName;
  }

  async excelDown(name: string) {
    //
    const { userUserGroupMembersForExcel } = this.injected.userService;
    const wbList: UserGroupMemberExcelModel[] = [];

    userUserGroupMembersForExcel &&
      userUserGroupMembersForExcel.forEach((member) => {
        wbList.push(new UserGroupMemberExcelModel(member));
      });

    const userGroupExcel = XLSX.utils.json_to_sheet(wbList);
    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, userGroupExcel, 'UserGroups');

    const date = moment().format('YYYY-MM-DD_HH:mm:ss');
    const fileName = `${name}-?????? ??????.${date}.xlsx`;
    XLSX.writeFile(wb, fileName, { compression: true });
    return fileName;
  }

  onClickMultiDisAssign() {
    //
    const { userService, userGroupService } = this.injected;
    const checkedList = userService.userUserGroupMembers
      .filter((userGroupMember) => userGroupMember.checked)
      .map((userGroupMember) => userGroupMember.memberView.id);

    if (checkedList.length === 0) {
      alert(AlertModel.getRequiredChoiceAlert('????????? ?????????'));
      return;
    }

    confirm(
      ConfirmModel.getCustomConfirm(`"?????? ??????"`, '???????????????????', false, '??????', '??????', () => {
        userService.disAssignUserGroupUser(checkedList, [userGroupService.userGroup.sequence]);
        alert(AlertModel.getSaveSuccessAlert(this.findUserGroupMember));
      }),
      false
    );
  }

  onClickCheckAll(value: boolean) {
    //
    const { userService } = this.injected;
    const { userUserGroupMembers } = userService;

    this.setState({ checked: value });

    userUserGroupMembers &&
      userUserGroupMembers.forEach((userGroupMember, index) => {
        userService.changeUserUserGroupMembersProp(index, 'checked', value);
      });
  }

  onClickCheckOne(index: number, name: string, value: boolean) {
    //
    const { userService } = this.injected;

    userService.changeUserUserGroupMembersProp(index, name, value);

    // checkbox ????????? ALL Checkbox ????????? ????????? ALL Checkbox ?????? ????????? ?????? ??????
    if (
      userService.userUserGroupMembers.length ===
      userService.userUserGroupMembers.filter((userGroupMember) => userGroupMember.checked).length
    ) {
      this.setState({ checked: true });
    } else {
      this.setState({ checked: false });
    }
  }

  onClickAddMemberOk(member: MemberViewModel, memberList: MemberViewModel[]) {
    //
    const { userGroupService, userService } = this.injected;
    const userGroup = userGroupService.userGroup;

    const addIds: string[] = [];

    memberList &&
      memberList.forEach((member) => {
        addIds.push(member.id);
      });

    confirm(
      ConfirmModel.getCustomConfirm(
        '?????? ??????',
        `${addIds.length}?????? ???????????? "${getPolyglotToAnyString(userGroup.name)}" ??? ?????????????????????????`,
        false,
        '??????',
        '??????',
        () => {
          userService.assignUserGroupUser(addIds, [userGroup.sequence]);
          alert(AlertModel.getSaveSuccessAlert(this.findUserGroupMember));
        }
      ),
      false
    );
  }

  onChangeExcelModalOpen() {
    //
    const { excelUploadModalOpen } = this.state;
    if (excelUploadModalOpen) {
      this.setState({
        excelUploadModalOpen: false,
        userGroupEmailExcelModel: new UserGroupEmailExcelModel(),
        userGroupEmailExcelFileName: '',
      });
    } else {
      this.setState({ excelUploadModalOpen: true });
    }
  }

  onChangeFailureExcelModalOpen() {
    //
    const { invalidModalWin } = this.state;
    if (invalidModalWin) {
      this.setState({
        invalidModalWin: false,
        invaiidMembers: [],
        failedReasonText: '',
      });
    } else {
      this.setState({ invalidModalWin: true });
    }
  }

  uploadExcel(file: File) {
    //
    const { userGroupService } = this.injected;
    const fileReader = new FileReader();

    this.setState({ userGroupEmailExcelFileName: file.name });
    fileReader.onload = (e: any) => {
      let binary = '';
      const data = new Uint8Array(e.target.result);
      const length = data.byteLength;

      for (let i = 0; i < length; i++) {
        binary += String.fromCharCode(data[i]);
      }

      const workbook: any = XLSX.read(binary, { type: 'binary' });
      let members: any[] = [];

      workbook.SheetNames.forEach((item: any) => {
        const jsonArray = XLSX.utils.sheet_to_json(workbook.Sheets[item]);

        if (jsonArray.length === 0) {
          return;
        }

        members = jsonArray;
      });

      const targetEmails: string[] = [];

      members &&
        members.forEach((member, index) => {
          const email: string = member['?????????'];

          if (email) {
            targetEmails.push(email.trim());
          }
        });

      if (targetEmails?.length > 0) {
        const userGroupEmailExcelModel = this.state.userGroupEmailExcelModel;
        userGroupEmailExcelModel.emails = targetEmails;
        userGroupEmailExcelModel.userGroupSequences.sequences = [userGroupService.userGroup.sequence];
      }
    };

    fileReader.readAsArrayBuffer(file);
  }

  async onReadExcel() {
    const { userGroupService, loaderService } = this.injected;
    const userGroupEmailExcelModel = this.state.userGroupEmailExcelModel;

    loaderService.openPageLoader(true);

    if (!this.state.userGroupEmailExcelFileName) {
      alert(AlertModel.getRequiredChoiceAlert('?????? ??????'));
      loaderService.closeLoader(true);
      return;
    }

    if (userGroupEmailExcelModel?.emails?.length > 0) {
      const response = await userGroupService.assignUserGroupByEmail(userGroupEmailExcelModel);

      if (response?.failedEmails?.length > 0) {
        const failedList: any[] = [];
        const totalCount = response.requestCount;
        const successCount = response.successCount;
        const failedCount = response.failedEmails.length;

        response.failedEmails.forEach((failedEmail) => {
          failedList.push({ email: failedEmail, failedReason: '??????' });
        });

        this.setState({
          invalidModalWin: true,
          invaiidMembers: failedList,
          failedReasonText: `??? ${totalCount} ??? ??? ${successCount}??? ?????? / ${failedCount}?????? ?????? ????????????.`,
        });

        this.findUserGroupMember();
      } else if (response?.failedEmails?.length === 0) {
        alert(AlertModel.getSaveSuccessAlert(this.findUserGroupMember));
      } else {
        alert(AlertModel.getErrorAxios());
      }

      this.onChangeExcelModalOpen();
    } else {
      alert(AlertModel.getRequiredInputAlert('?????????'));
    }

    loaderService.closeLoader(true);
  }

  render() {
    //
    const { userGroupService, sharedService, userWorkspaceService } = this.injected;
    const { count, startNo } = sharedService.getPageModel(this.paginationKey);
    const { invalidModalWin, invaiidMembers, failedReasonText } = this.state;

    return (
      <Tab.Pane attached={false}>
        <SearchBox
          onSearch={this.findUserGroupMember}
          queryModel={userGroupService.userGroupMemberQuery}
          changeProps={userGroupService.changeUserGroupMemberQueryProps}
          name={this.paginationKey}
        >
          <SearchBox.Group name="????????????">
            <SearchBox.DatePicker
              startFieldName="period.startDateMoment"
              endFieldName="period.endDateMoment"
              searchButtons
              ago="a"
              isAllDate
            />
          </SearchBox.Group>
          {this.props.cineroomId === 'ne1-m2-c2' && (
            <SearchBox.Group name="????????????">
              <SearchBox.Select
                placeholder="??????"
                options={addSelectTypeBoxAllOption(getCompanySelectOptions(userWorkspaceService))}
                fieldName="companyCode"
              />
            </SearchBox.Group>
          )}

          <SearchBox.Query options={SelectType.searchUserGroupMember} searchWordDisabledValues={['', '??????']} />
        </SearchBox>

        <SubActions>
          <SubActions.Count number={count} text="??? ?????? ??????" />
          <SubActions.Right>
            <ExcelReadModal
              open={this.state.excelUploadModalOpen}
              onChangeOpen={this.onChangeExcelModalOpen}
              fileName={'????????????'}
              uploadFile={this.uploadExcel}
              onReadExcel={this.onReadExcel}
              targetText="?????? ????????? ??????????????? ???????????? ?????? ???????????????."
            />
            <UserGroupExcelUploadFailureListModal
              open={invalidModalWin}
              failedList={invaiidMembers}
              text={failedReasonText}
              onClosed={this.onChangeFailureExcelModalOpen}
            />
            <Button
              type="button"
              className="margin-right3"
              onClick={() => this.setState({ excelUploadModalOpen: true })}
            >
              ?????? ?????????
            </Button>
            <SubActions.ExcelButton download onClick={this.onClickExcelDownload} />
            {/*{!this.props.cineroomId.startsWith('ne1-m2') && (
              <SubActions.ExcelButton onClick={() => console.log('// TODO Excel Upload')} />
            )}*/}
            <ManagerListModalView
              handleOk={this.onClickAddMemberOk}
              buttonName="?????? ??????"
              multiSelect
              sequence={userGroupService.userGroup.sequence}
            />
            <Button primary type="button" onClick={this.onClickMultiDisAssign}>
              <Icon name="minus square outline" />
              ????????????
            </Button>
          </SubActions.Right>
        </SubActions>

        <Pagination name={this.paginationKey} onChange={this.findUserGroupMember}>
          <Loader>
            <UserGroupMemberListView
              userGroupMembers={this.injected.userService.userUserGroupMembers}
              startNo={startNo}
              checked={this.state.checked}
              onClickCheckAll={this.onClickCheckAll}
              onClickCheckOne={this.onClickCheckOne}
            />
          </Loader>
          <Pagination.Navigator />
        </Pagination>
      </Tab.Pane>
    );
  }
}

export default UserGroupDetailMemberListContainer;
