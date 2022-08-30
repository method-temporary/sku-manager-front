import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { inject, observer } from 'mobx-react';
import { Button, Container } from 'semantic-ui-react';

import { patronInfo } from '@nara.platform/dock';
import { reactAutobind, ReactComponent } from '@nara.platform/accent';

import { SelectType, PageModel, SelectTypeModel } from 'shared/model';
import { SharedService } from 'shared/present';
import { alert, AlertModel, confirm, ConfirmModel, PageTitle, SubActions } from 'shared/components';
import { getPolyglotToAnyString } from 'shared/components/Polyglot';

import UserWorkspaceModel from '../../../userworkspace/model/UserWorkspaceModel';

import CollegeDisplayOrderUdo, { CollegeDisplayOrder } from '../../model/dto/CollegeDisplayOrderUdo';
import CollegeAdminService from '../../present/logic/CollegeAdminService';
import CollegeQueryModel from '../../model/dto/CollegeQueryModel';
import CollegeSearchBox from '../view/CollegeSearchBox';
import CollegeSequenceListView from '../view/CollegeSequenceListView';
import { UserWorkspaceService } from '../../../userworkspace';

interface Props extends RouteComponentProps<Params> {}

interface Params {}

interface States {}

interface Injected {
  collegeAdminService: CollegeAdminService;
  userWorkspaceService: UserWorkspaceService;
  sharedService: SharedService;
}

@inject('collegeAdminService', 'userWorkspaceService', 'sharedService')
@observer
@reactAutobind
class CollegeSequenceContainer extends ReactComponent<Props, States, Injected> {
  //
  paginationKey = 'college-sequence-list';

  componentDidMount() {
    //
    this.initialize();
  }

  componentWillUnmount() {
    //
    const { collegeAdminService } = this.injected;
    collegeAdminService.clearCollegeSequenceQuery();
  }

  async initialize(): Promise<void> {
    const cineroomId = patronInfo.getCineroomId();
    const { collegeAdminService, userWorkspaceService } = this.injected;

    collegeAdminService.clearCollegeSequenceQuery();
    collegeAdminService.changeCollegeSequenceQueryProps('userWorkspace', patronInfo.getCineroomId());

    if (cineroomId) {
      await userWorkspaceService.findUserWorkspaceById(cineroomId);
      collegeAdminService.changeCurrentUserWorkspace(userWorkspaceService.userWorkspace);

      if (userWorkspaceService.userWorkspace.hasChildren || userWorkspaceService.userWorkspace.id === 'ne1-m2-c2') {
        await this.superManagerInitialize();
      } else {
        await this.findCollegesByRdo();
      }
    }
  }

  async superManagerInitialize() {
    //
    const { userWorkspaceService, collegeAdminService } = this.injected;
    const userWorkspaceId = patronInfo.getCineroomId();

    const userWorkspaces: UserWorkspaceModel[] = [];

    if (userWorkspaceId) {
      if (userWorkspaceId === 'ne1-m2-c2') {
        userWorkspaces.push(collegeAdminService.currentUserWorkspace);
        userWorkspaces.push(
          ...(await userWorkspaceService.findAllWorkspaces()).filter((target) => target.id !== 'ne1-m2-c2')
        );
      } else {
        userWorkspaces.push(collegeAdminService.currentUserWorkspace);
        userWorkspaces.push(...(await userWorkspaceService.findUserWorkspacesByParentId(userWorkspaceId)));
      }
    }

    collegeAdminService.setWorkspaceOptions([
      ...userWorkspaces.map((target) => {
        return new SelectTypeModel(target.id, getPolyglotToAnyString(target.name), target.id);
      }),
    ]);
  }

  async findCollegesByRdo(): Promise<void> {
    //
    const { collegeAdminService, sharedService } = this.injected;
    const { collegeSequenceQuery } = collegeAdminService;
    const pageModel = new PageModel(0, 99999);
    const offsetElementList = await collegeAdminService.findByCollegeAdminRdo(
      CollegeQueryModel.asCollegeAdminRdoBySequence(collegeSequenceQuery, pageModel)
    );

    sharedService.setCount(this.paginationKey, offsetElementList.totalCount);
  }

  onChangeCollegeSequence(oldIndex: number, newIndex: number) {
    //
    const { collegeAdminService } = this.injected;
    collegeAdminService.changeCollegeSequence(oldIndex, newIndex);
  }

  async saveDisplayOrder() {
    //
    const { collegeAdminService } = this.injected;
    const { colleges } = collegeAdminService;

    confirm(
      ConfirmModel.getCustomConfirm(
        'College 순서 변경',
        '변경 내용을 저장 하시겠습니까?',
        false,
        '확인',
        '취소',
        async () => {
          await collegeAdminService.setUpDisplayOrders(
            new CollegeDisplayOrderUdo({
              collegeDisplayOrders: colleges.map((college) => new CollegeDisplayOrder(college.id)),
            })
          );
          alert(
            AlertModel.getCustomAlert(false, 'College 순서 변경', '저장되었습니다.', '확인', async () => {
              await this.findCollegesByRdo();
            })
          );
        }
      )
    );
  }

  onChangeCollegeQueryProps(name: string, value: any): void {
    //
    this.injected.collegeAdminService.changeCollegeSequenceQueryProps(name, value);
  }

  render() {
    //
    const rules = patronInfo.getPatronRoles(patronInfo.getCineroomId());
    const { collegeAdminService, sharedService } = this.injected;
    const { collegeSequenceQuery, colleges, currentUserWorkspace, workspaceOptions } = collegeAdminService;
    const { startNo } = sharedService.getPageModel(this.paginationKey);

    return (
      <Container fluid>
        <PageTitle breadcrumb={SelectType.collegeSequenceSections} />
        {rules.includes('SuperManager') || currentUserWorkspace.hasChildren ? (
          <CollegeSearchBox
            sequenceSearch
            findCollegesByRdo={this.findCollegesByRdo}
            changeCollegeQueryProps={this.onChangeCollegeQueryProps}
            currentUserWorkspace={currentUserWorkspace}
            userWorkspaceOptions={workspaceOptions}
            collegeQuery={collegeSequenceQuery}
            paginationKey={this.paginationKey}
          />
        ) : null}
        <CollegeSequenceListView
          changeCollegeSequence={this.onChangeCollegeSequence}
          colleges={colleges}
          startNo={startNo}
        />
        <SubActions form>
          <SubActions.Left>
            <Button onClick={this.findCollegesByRdo}>초기화</Button>
          </SubActions.Left>
          <SubActions.Right>
            <Button primary onClick={this.saveDisplayOrder}>
              저장
            </Button>
          </SubActions.Right>
        </SubActions>
      </Container>
    );
  }
}
export default withRouter(CollegeSequenceContainer);
