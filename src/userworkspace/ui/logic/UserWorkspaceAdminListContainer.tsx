import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { Button, Container } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';

import { MemberViewModel } from '@nara.drama/approval';
import { reactAutobind, ReactComponent } from '@nara.platform/accent';

import { CineroomManagerRoleUdo } from 'shared/model';
import { SharedService } from 'shared/present';
import { alert, AlertModel, confirm, ConfirmModel, Pagination, SubActions, Loader } from 'shared/components';
import { SearchBoxService } from 'shared/components/SearchBox';

import UserWorkspaceAdminSearchBox from '../view/UserWorkspaceAdminSearchBox';
import UserWorkspaceAdminListView from '../view/UserWorkspaceAdminListView';
import UserWorkspaceService from '../../present/logic/UserWorkspaceService';
import ManagerListModalView from '../../../cube/cube/ui/view/ManagerListModal';

interface Props extends RouteComponentProps<Params> {}

interface Params {
  userWorkspaceId: string;
  cineroomId: string;
}

interface Injected {
  userWorkspaceService: UserWorkspaceService;
  searchBoxService: SearchBoxService;
  sharedService: SharedService;
}

interface States {}

@inject('userWorkspaceService', 'searchBoxService', 'sharedService')
@observer
@reactAutobind
class UserWorkspaceAdminListContainer extends ReactComponent<Props, States, Injected> {
  //
  paginationKey = 'userWorkspace-manager';

  componentDidMount() {}

  onChangeUserWorkspaceManagerQueryModel(name: string, value: any): void {
    //
    const { userWorkspaceService } = this.injected;
    userWorkspaceService.changeUserWorkspaceManagerQueryProps(name, value);
  }

  async findManagerIdentitiesByCineroomId(): Promise<void> {
    //
    const { userWorkspaceService, sharedService } = this.injected;
    const { userWorkspaceManagerQueryModel } = userWorkspaceService;
    const { userWorkspaceId } = this.props.match.params;
    const pageModel = sharedService.getPageModel(this.paginationKey);

    userWorkspaceService.clearSelectedAudienceIdentityIds();

    const offsetElementList = await userWorkspaceService.findManagerIdentitiesByCineroomId(
      userWorkspaceId,
      userWorkspaceManagerQueryModel.searchPart === '성명' ? userWorkspaceManagerQueryModel.searchWord : '',
      userWorkspaceManagerQueryModel.searchPart === 'Email' ? userWorkspaceManagerQueryModel.searchWord : '',
      pageModel.offset,
      pageModel.limit
    );

    sharedService.setCount(this.paginationKey, offsetElementList.totalCount);
  }

  onClickCheckBox(id: string, checked?: boolean): void {
    //
    const { userWorkspaceService } = this.injected;
    const { selectedAudienceIdentityIds } = userWorkspaceService;
    const targets = [...selectedAudienceIdentityIds];

    if (id === 'All') {
      //
      if (checked) {
        userWorkspaceService.clearSelectedAudienceIdentityIds();
      } else {
        userWorkspaceService.setSelectedAudienceIdentityIds(
          userWorkspaceService.audienceIdentities.map((target) => target.citizenId)
        );
      }
    } else {
      if (checked) {
        targets.splice(targets.indexOf(id), 1);
        userWorkspaceService.setSelectedAudienceIdentityIds(targets);
      } else {
        userWorkspaceService.setSelectedAudienceIdentityIds([...targets, id]);
      }
    }
  }

  async assignCineroomManagerRole(member: MemberViewModel): Promise<void> {
    const { userWorkspaceService } = this.injected;
    const { userWorkspaceId } = this.props.match.params;

    confirm(
      ConfirmModel.getCustomConfirm('관리자 추가', '추가 하시겠습니까?', false, '확인', '취소', async () => {
        const cineroomManagerRoleUdo = new CineroomManagerRoleUdo();
        cineroomManagerRoleUdo.citizenIds = [member.id];
        cineroomManagerRoleUdo.cineroomId = userWorkspaceId;
        await userWorkspaceService.assignCineroomManagerRole(cineroomManagerRoleUdo);

        alert(
          AlertModel.getCustomAlert(false, '관리자 추가', '추가 되었습니다.', '확인', async () => {
            await this.findManagerIdentitiesByCineroomId();
          })
        );
      })
    );
  }

  async cancelCineroomManagerRole(): Promise<void> {
    //
    const { userWorkspaceService } = this.injected;
    const { selectedAudienceIdentityIds } = userWorkspaceService;
    const { userWorkspaceId } = this.props.match.params;

    confirm(
      ConfirmModel.getCustomConfirm('관리자 삭제', '삭제 하시겠습니까?', false, '확인', '취소', async () => {
        const cineroomManagerRoleUdo = new CineroomManagerRoleUdo();
        cineroomManagerRoleUdo.citizenIds = selectedAudienceIdentityIds;
        cineroomManagerRoleUdo.cineroomId = userWorkspaceId;
        await userWorkspaceService.cancelCineroomManagerRole(cineroomManagerRoleUdo);

        alert(
          AlertModel.getCustomAlert(false, '관리자 삭제', '삭제 되었습니다.', '확인', async () => {
            await this.findManagerIdentitiesByCineroomId();
          })
        );
      })
    );
  }

  render() {
    //
    const { userWorkspaceService, searchBoxService, sharedService } = this.injected;
    const { searchBoxQueryModel } = searchBoxService;
    const { count, startNo } = sharedService.getPageModel(this.paginationKey);

    const { userWorkspaceManagerQueryModel, audienceIdentities, selectedAudienceIdentityIds, userWorkspace } =
      userWorkspaceService;

    return (
      <Container fluid>
        <UserWorkspaceAdminSearchBox
          onSearch={this.findManagerIdentitiesByCineroomId}
          changeProps={this.onChangeUserWorkspaceManagerQueryModel}
          paginationKey={this.paginationKey}
          queryModel={userWorkspaceManagerQueryModel}
          searchBoxQueryModel={searchBoxQueryModel}
        />
        <Pagination name={this.paginationKey} onChange={this.findManagerIdentitiesByCineroomId}>
          <SubActions>
            <SubActions.Left>
              <SubActions.Count number={count} text="명 승인자 등록" />
            </SubActions.Left>
            <SubActions.Right>
              <Button onClick={() => this.cancelCineroomManagerRole()}>삭제</Button>
              <ManagerListModalView
                handleOk={(member) => this.assignCineroomManagerRole(member)}
                buttonName="추가"
                multiSelect={false}
                companyCode={userWorkspace.usid}
              />
            </SubActions.Right>
          </SubActions>

          <Loader>
            <UserWorkspaceAdminListView
              onClickCheckBox={this.onClickCheckBox}
              audienceIdentities={audienceIdentities}
              selectedAudienceIdentityIds={selectedAudienceIdentityIds}
              startNo={startNo}
            />
          </Loader>
          <Pagination.Navigator />
        </Pagination>
      </Container>
    );
  }
}

export default withRouter(UserWorkspaceAdminListContainer);
