import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { inject, observer } from 'mobx-react';
import { Button, Container } from 'semantic-ui-react';
import XLSX from 'xlsx';

import { reactAlert, reactAutobind, ReactComponent } from '@nara.platform/accent';

import { SharedService } from 'shared/present';
import { PageModel, SelectType } from 'shared/model';
import {
  alert,
  AlertModel,
  confirm,
  ConfirmModel,
  Loader,
  PageTitle,
  Pagination,
  SubActions,
  RejectEmailModal,
} from 'shared/components';
import { getPolyglotToAnyString } from 'shared/components/Polyglot';
import { addSelectTypeBoxAllOption } from 'shared/helper';

import CubeService from '../../present/logic/CubeService';
import UserCubeService from '../../present/logic/UserCubeService';
import { UserCubeQueryModel } from '../../model/UserCubeQueryModel';
import { UserCubeWithIdentity } from '../../model/sdo/UserCubeWithIdentity';
import { learningManagementUrl } from '../../../../Routes';
import CreateApprovalManagementSearchBox from '../view/CreateApprovalManagementSearchBox';
import CreateApprovalManagementListView from '../view/CreateApprovalManagementListView';
import { UserCubeState } from '../../model/vo/UserCubeState';
import { UserCubeCreateXlsxModel } from '../../model/UserCubeCreateXlsxModel';

import { UserWorkspaceService } from '../../../../userworkspace';

interface Props extends RouteComponentProps<Params> {}

interface Params {
  cineroomId: string;
}

interface Injected {
  cubeService: CubeService;
  userCubeService: UserCubeService;
  sharedService: SharedService;
  userWorkspaceService: UserWorkspaceService;
}

interface States {}

@inject('cubeService', 'userCubeService', 'sharedService', 'userWorkspaceService')
@observer
@reactAutobind
class CreateApprovalManagementListContainerNew extends ReactComponent<Props, States, Injected> {
  //
  paginationKey = 'user-cube';

  componentDidMount() {
    //
    this.init();
  }

  async init() {
    const { userWorkspaceService } = this.injected;

    if (userWorkspaceService.userWorkspaceSelectUsId.length === 0) {
      await userWorkspaceService.findAllUserWorkspacesMap();
    }
  }

  async findAllApprovalContents() {
    const { sharedService, userCubeService } = this.injected;
    const { userCubeQuery } = userCubeService;
    const pageModel = sharedService.getPageModel(this.paginationKey);

    userCubeService.clearUserCube();

    const offsetElementList = await userCubeService.findUserCubeWithIdentitiesForAdmin(
      UserCubeQueryModel.asUserCubeAdminRdo(userCubeQuery, pageModel)
    );
    sharedService.setCount(this.paginationKey, offsetElementList.totalCount);

    await userCubeService.countUserCubesForAdmin(UserCubeQueryModel.asUserCubeAdminRdo(userCubeQuery, pageModel));
  }

  onChangeUserCubeQueryProps(name: string, value: any): void {
    //
    const { userCubeService } = this.injected;
    userCubeService.changeUserCubeQueryProp(name, value);
  }

  checkAll(isChecked: boolean) {
    //
    const { userCubeService } = this.injected;
    const { userCubesWithIdentity } = userCubeService;

    if (!isChecked) {
      userCubeService.setSelectedList(
        userCubesWithIdentity.filter((cube) => cube.userCube.state === UserCubeState.OpenApproval)
      );
    } else {
      userCubeService.setSelectedList([]);
    }
  }

  checkOne(index: number, userCube: UserCubeWithIdentity, value: any): void {
    //
    const { userCubeService } = this.injected;
    const { selectedList } = userCubeService;
    const targetList = [...selectedList];

    if (targetList.map((target) => target.cube.id).includes(userCube.cube.id)) {
      targetList.splice(targetList.map((target) => target.cube.id).indexOf(userCube.cube.id), 1);
    } else {
      targetList.push(userCube);
    }
    userCubeService.setSelectedList(targetList);
  }

  handleClickApprovalContentsRow(userCube: UserCubeWithIdentity) {
    //
    this.props.history.push(
      `/cineroom/${this.props.match.params.cineroomId}/${learningManagementUrl}/cubes/create-approve-management/approvalContents-detail/${userCube.cube.id}`
    );
  }

  async findAllApprovalContentsExcel() {
    //
    const { userCubeService } = this.injected;
    const { userCubeQuery } = userCubeService;

    await userCubeService.findUserCubeWithIdentitiesForAdmin(
      UserCubeQueryModel.asUserCubeAdminRdo(userCubeQuery, new PageModel(0, 99999))
    );

    const approvalContentsXlsxList: UserCubeCreateXlsxModel[] = [];
    userCubeService.userCubesWithIdentity.forEach((userCube, index) => {
      approvalContentsXlsxList.push(UserCubeWithIdentity.asCreateXLSX(userCube, index));
    });
    const approvalContentsExcel = XLSX.utils.json_to_sheet(approvalContentsXlsxList);
    const temp = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(temp, approvalContentsExcel, 'ApprovalContentsCreate');
    // const date = moment().format('YYYY-MM-DD HH:mm:ss');
    const fileName = `ApprovalContentsCreate.xlsx`;
    XLSX.writeFile(temp, fileName, { compression: true });

    await this.findAllApprovalContents();
    return fileName;
  }

  checkEmail() {
    const { selectedList } = this.injected.userCubeService;
    if (selectedList.length === 0) {
      // reactAlert 에러로 인한 주석처리
      reactAlert({ title: '알림', message: '학습자를 선택하세요.' });
      return false;
    } else {
      return true;
    }
  }

  async onClickRejectCube() {
    //
    // confirm(
    //   ConfirmModel.getCustomConfirm(
    //     'Cube 반려',
    //     '등록된 Cube 정보에 대해 반려하시겠습니까',
    //     false,
    //     '반려',
    //     '취소',
    //     () => {
    //       this.handleReject(
    //         this.injected.userCubeService.selectedList.map((target) => target.userCube.id),
    //         this.injected.userCubeService.cubeRequestCdo.remark
    //       );
    //     },
    //     () => {}
    //   )
    // );
    await this.handleReject(
      this.injected.userCubeService.selectedList.map((target) => target.userCube.id),
      this.injected.userCubeService.cubeRequestCdo.remark
    );
  }

  async handleReject(ids: string[], remark: string) {
    const { userCubeService } = this.injected;
    await userCubeService.rejectUserCubes(ids, remark);
    // alert(
    //   AlertModel.getCustomAlert(true, '반려', '반려되었습니다.', '확인', () => {
    //     this.findAllApprovalContents();
    //   })
    // );
    await this.findAllApprovalContents();
  }

  onChangeCubeRequestProps(name: string, value: string) {
    //
    this.injected.userCubeService.changeCubeRequestProps(name, value);
  }

  onClickApproveCube() {
    //
    confirm(
      ConfirmModel.getCustomConfirm(
        'Cube 승인',
        '등록된 Cube 정보에 대해 승인하시겠습니까',
        false,
        '승인',
        '취소',
        () => {
          this.handleSave(this.injected.userCubeService.selectedList.map((target) => target.userCube.id));
        },
        () => {}
      )
    );
    // const message = '등록된 Cube 정보에 대해 승인하시겠습니까?';
    // this.setState({
    //   alertMessage: message,
    //   alertWinOpen: true,
    //   alertTitle: 'Cube 승인',
    //   alertIcon: 'circle',
    //   alertType: 'approval',
    // });
  }

  async handleSave(ids: string[]) {
    //
    const { userCubeService } = this.injected;

    await userCubeService.openUserCubes(ids);
    alert(
      AlertModel.getCustomAlert(true, '승인', '승인되었습니다.', '확인', () => {
        this.findAllApprovalContents();
      })
    );
  }

  handleCloseAlertWin() {
    //
    this.setState({
      alertWinOpen: false,
    });
  }

  render() {
    //
    const { userWorkspaceService, userCubeService } = this.injected;
    const { userCubeQuery, userCubeCounts, userCubesWithIdentity, selectedList } = userCubeService;
    const { count, startNo } = this.injected.sharedService.getPageModel(this.paginationKey);

    const companyOptions = addSelectTypeBoxAllOption(userWorkspaceService.userWorkspaceSelectUsId);

    const selectedEmailList = selectedList.map((target) => target.userIdentity.email);
    const selectedNameList = selectedList.map((target) => getPolyglotToAnyString(target.userIdentity.name) || '');
    const selectedCubeTitles = selectedList.map((target) => getPolyglotToAnyString(target.cube.name));

    return (
      <Container fluid>
        <PageTitle breadcrumb={SelectType.createApproveSections} />
        <CreateApprovalManagementSearchBox
          changeProps={this.onChangeUserCubeQueryProps}
          onSearch={this.findAllApprovalContents}
          name={this.paginationKey}
          companyOptions={companyOptions}
          queryModel={userCubeQuery}
        />

        <Pagination name={this.paginationKey} onChange={this.findAllApprovalContents}>
          <SubActions>
            <SubActions.Left>
              {(userCubeCounts && (
                <span>
                  전체 <strong>{count}</strong>개 등록
                  <span className="dash">|</span>
                  <strong>{userCubeCounts.opened}</strong>개 승인
                  <span className="dash">/</span>
                  <strong>{userCubeCounts.openApproval}</strong>개 승인 대기 중<span className="dash">/</span>
                  <strong>{userCubeCounts.rejected}</strong>개 반려
                </span>
              )) ||
                ''}
            </SubActions.Left>
            <SubActions.Right>
              <Pagination.LimitSelect allViewable />
              <SubActions.ExcelButton download onClick={this.findAllApprovalContentsExcel} />
              {/*<CompanionModal*/}
              {/*  handleOk={this.onClickRejectCube}*/}
              {/*  changeSomethingProps={this.onChangeCubeRequestProps}*/}
              {/*  cubeRequestCdo={cubeRequestCdo}*/}
              {/*  buttonText="일괄반려"*/}
              {/*/>*/}
              <RejectEmailModal
                onShow={this.checkEmail}
                onClickReject={this.onClickRejectCube}
                onChangeRemark={this.onChangeCubeRequestProps}
                emailList={selectedEmailList}
                nameList={selectedNameList}
                cubeTitles={selectedCubeTitles}
                type={SelectType.mailOptions[6].value}
                buttonText="일괄반려"
                isApprovalRoleOwner
              />
              <Button onClick={this.onClickApproveCube}>일괄승인</Button>
            </SubActions.Right>
          </SubActions>

          <Loader>
            <CreateApprovalManagementListView
              checkAll={this.checkAll}
              checkOne={this.checkOne}
              routeToDetail={this.handleClickApprovalContentsRow}
              userCubes={userCubesWithIdentity}
              selectedList={selectedList}
              startNo={startNo}
            />
          </Loader>
          <Pagination.Navigator />
        </Pagination>
      </Container>
    );
  }
}

export default withRouter(CreateApprovalManagementListContainerNew);
