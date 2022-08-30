import * as React from 'react';
import { Container } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { RouteComponentProps, withRouter } from 'react-router';

import { patronInfo } from '@nara.platform/dock';
import { reactAutobind, ReactComponent } from '@nara.platform/accent';

import { SelectType, SelectTypeModel } from 'shared/model';
import { SharedService } from 'shared/present';
import { PageTitle, Pagination, SubActions } from 'shared/components';
import { getPolyglotToAnyString } from 'shared/components/Polyglot';

import { UserWorkspaceService } from '../../../userworkspace';
import UserWorkspaceModel from '../../../userworkspace/model/UserWorkspaceModel';
import { serviceManagementUrl } from '../../../Routes';

import CollegeAdminService from '../../present/logic/CollegeAdminService';
import CollegeQueryModel from '../../model/dto/CollegeQueryModel';
import CollegeSearchBox from '../view/CollegeSearchBox';
import CollegeListView from '../view/CollegeListView';
import { isSuperManager } from 'shared/ui';

interface Props extends RouteComponentProps<Params> {}

interface Params {
  cineroomId: string;
}

interface States {}

interface Injected {
  userWorkspaceService: UserWorkspaceService;
  collegeAdminService: CollegeAdminService;
  sharedService: SharedService;
}

@inject('userWorkspaceService', 'collegeAdminService', 'sharedService')
@observer
@reactAutobind
class CollegeListContainer extends ReactComponent<Props, States, Injected> {
  //
  paginationKey = 'college-list';

  componentDidMount() {
    //
    this.initialize();
  }

  componentWillUnmount() {
    //
    const { collegeAdminService } = this.injected;
    collegeAdminService.clearCollegeQuery();
  }

  async initialize(): Promise<void> {
    const cineroomId = patronInfo.getCineroomId();
    const { collegeAdminService, userWorkspaceService } = this.injected;

    collegeAdminService.clearCollegeQuery();

    if (cineroomId) {
      await userWorkspaceService.findUserWorkspaceById(cineroomId);
      collegeAdminService.changeCurrentUserWorkspace(userWorkspaceService.userWorkspace);

      if (userWorkspaceService.userWorkspace.hasChildren || userWorkspaceService.userWorkspace.id === 'ne1-m2-c2') {
        await this.superManagerInitialize();
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
        userWorkspaces.push(
          ...(await userWorkspaceService.findAllWorkspaces()).filter((target) => target.id !== 'ne1-m2-c2')
        );
      } else {
        userWorkspaces.push(collegeAdminService.currentUserWorkspace);
        userWorkspaces.push(...(await userWorkspaceService.findUserWorkspacesByParentId(userWorkspaceId)));
      }
    }

    collegeAdminService.setWorkspaceOptions([
      new SelectTypeModel('', '전체', 'All'),
      ...userWorkspaces.map((target) => {
        return new SelectTypeModel(target.id, getPolyglotToAnyString(target.name), target.id);
      }),
    ]);
  }

  async findUserWorkspaces(): Promise<void> {
    const { userWorkspaceService } = this.injected;
    await userWorkspaceService.findAllWorkspaces();
  }

  async findCollegesByRdo(): Promise<void> {
    //
    const { collegeAdminService, sharedService } = this.injected;
    const { collegeQuery } = collegeAdminService;
    const pageModel = sharedService.getPageModel(this.paginationKey);
    const cineroomId = patronInfo.getCineroomId();
    const collegeAdminRdo = CollegeQueryModel.asCollegeAdminRdo(collegeQuery, pageModel);

    const offsetElementList = await collegeAdminService.findByCollegeAdminRdo(collegeAdminRdo);

    sharedService.setCount(this.paginationKey, offsetElementList.totalCount);
  }

  onChangeCollegeQueryProps(name: string, value: any): void {
    //
    this.injected.collegeAdminService.changeCollegeQueryProps(name, value);
  }

  routeToCollegeCreatePage(): void {
    //
    this.props.history.push(
      `/cineroom/${this.props.match.params.cineroomId}/${serviceManagementUrl}/college/college-create`
    );
  }

  routeToCollegeDetailPage(id: string): void {
    this.props.history.push(
      `/cineroom/${this.props.match.params.cineroomId}/${serviceManagementUrl}/college/college-detail/${id}`
    );
  }

  makeUserWorkspaceOptions(): SelectTypeModel[] {
    //
    const { userWorkspaceService } = this.injected;

    const selectTypes: SelectTypeModel[] = [new SelectTypeModel('', '전체', 'All')];
    selectTypes.push(
      ...userWorkspaceService.userWorkspaces.map((userWorkspace) => {
        return new SelectTypeModel(userWorkspace.id, getPolyglotToAnyString(userWorkspace.name), userWorkspace.id);
      })
    );

    return selectTypes;
  }

  getUserWorkspaceName(id: string): string {
    //
    const { userWorkspaceService } = this.injected;
    const cineroomName = userWorkspaceService.userWorkspaceMap.get(id);
    return cineroomName ? cineroomName : '';
  }

  render() {
    //
    const { collegeAdminService, sharedService } = this.injected;
    const { collegeQuery, colleges, workspaceOptions, currentUserWorkspace } = collegeAdminService;
    const { count, startNo } = sharedService.getPageModel(this.paginationKey);

    return (
      <Container fluid>
        <PageTitle breadcrumb={SelectType.collegeSections} />
        <CollegeSearchBox
          findCollegesByRdo={this.findCollegesByRdo}
          changeCollegeQueryProps={this.onChangeCollegeQueryProps}
          currentUserWorkspace={currentUserWorkspace}
          userWorkspaceOptions={workspaceOptions}
          collegeQuery={collegeQuery}
          paginationKey={this.paginationKey}
        />
        <SubActions>
          <SubActions.Left>
            <SubActions.Count number={count} text="개" />
          </SubActions.Left>
          <SubActions.Right>
            {isSuperManager() && <SubActions.CreateButton onClick={this.routeToCollegeCreatePage} />}
          </SubActions.Right>
        </SubActions>
        <Pagination name={this.paginationKey} onChange={this.findCollegesByRdo}>
          <CollegeListView
            getUserWorkspaceName={this.getUserWorkspaceName}
            routeToCollegeDetailPage={this.routeToCollegeDetailPage}
            colleges={colleges}
            startNo={startNo}
          />
          <Pagination.Navigator />
        </Pagination>
      </Container>
    );
  }
}

export default withRouter(CollegeListContainer);
