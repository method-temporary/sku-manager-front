import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { RouteComponentProps, withRouter } from 'react-router';
import { Container, Pagination, Select } from 'semantic-ui-react';
import moment from 'moment';
import XLSX from 'xlsx';

import { reactAutobind, reactAlert, ReactComponent } from '@nara.platform/accent';

import { SelectType } from 'shared/model';
import { SharedService } from 'shared/present';
import { Loader, PageTitle, SubActions } from 'shared/components';
import { addSelectTypeBoxAllOption } from 'shared/helper';

import { learningManagementUrl } from '../../../Routes';
import { UserWorkspaceService } from '../../../userworkspace';
import { ApprovalCubeXlsxModel } from '../../model/ApprovalCubeXlsxModel';
import { ApprovalCubeModel } from '../../model/ApprovalCubeModel';
import ApprovalCubeService from '../../present/logic/ApprovalCubeService';
import ApprovalListView from '../view/ApprovalListView';
import ApprovalSearchBox from './ApprovalSearchBox';

interface Props extends RouteComponentProps<{ cineroomId: string }> {}

interface States {
  pageIndex: number;
}

interface Injected {
  approvalCubeService: ApprovalCubeService;
  sharedService: SharedService;
  userWorkspaceService: UserWorkspaceService;
}

@inject('approvalCubeService', 'sharedService', 'userWorkspaceService')
@observer
@reactAutobind
class ApprovalListContainer extends ReactComponent<Props, States, Injected> {
  //
  constructor(props: Props) {
    super(props);
    this.state = { pageIndex: 0 };
  }

  componentDidMount() {
    //
    this.init();
  }

  async init() {
    //
    const { approvalCubeService, userWorkspaceService } = this.injected;
    const currentPage = approvalCubeService.approvalQueryCube.currentPage;
    this.findAllApprovalCube(currentPage);
    if (userWorkspaceService.userWorkspaceSelectUsId.length === 0) {
      await userWorkspaceService.findAllUserWorkspacesMap();
    }
  }

  //조회
  findAllApprovalCube(page?: number) {
    const { sharedService, approvalCubeService } = this.injected;
    const { approvalQueryCube } = approvalCubeService!;

    //필수값 체크.
    const queryValidationResult = ApprovalCubeModel.isBlank(approvalQueryCube);
    if (queryValidationResult !== 'success') {
      reactAlert({ title: '안내', message: '검색어를 입력해주세요.' });
      return;
    }

    //조회.
    let offset = 0;
    if (page) {
      sharedService.setPage('approvalContents', page);
      offset = (page - 1) * approvalQueryCube.limit;
      approvalCubeService.changeApprovalCubeProps('currentPage', page);
    } else {
      sharedService.setPageMap('approvalContents', 0, approvalQueryCube.limit);
    }
    approvalCubeService.changeApprovalCubeProps('offset', offset);

    approvalCubeService.findApprovalCubesForSearch().then((offsetList) => {
      if (page) this.setState({ pageIndex: (page - 1) * approvalQueryCube.limit });
      sharedService.setCount('approvalContents', offsetList.totalCount);
    });
  }

  async onFindAllApprovalCubeExcel() {
    //
    const { approvalCubeService } = this.injected;

    const approvalCubes = await approvalCubeService!.findApprovalCubesForExcel();
    const ApprovalCubeXlxsList: ApprovalCubeXlsxModel[] = [];

    approvalCubes?.forEach((approvalCube, index) => {
      ApprovalCubeXlxsList.push(ApprovalCubeModel.asXLSX(approvalCube, index));
    });
    const courseExcel = XLSX.utils.json_to_sheet(ApprovalCubeXlxsList);
    const temp = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(temp, courseExcel, 'ApprovalCube');
    const fileName = 'ApprovalCubes_' + moment().format('YYYYMMDD') + '.xlsx';
    XLSX.writeFile(temp, fileName, { compression: true });
    return fileName;
  }

  //상세 조회.
  async onClickApprovalCubeRow(studentId: string) {
    //this.injected.history.push(`${approveManagementUrl}/paid-course/detail/${studentId}` );
    //console.log('===>', learningManagementUrl);
    this.props.history.push(
      `/cineroom/${this.props.match.params.cineroomId}/${learningManagementUrl}/approves/approve-management/paid-course/detail/${studentId}`
    );
  }

  onClearApprovalCubeQuery() {
    //
    const { approvalCubeService } = this.injected;
    approvalCubeService.clearApprovalCube();
  }

  setApprovalCubeCountForFind(name: string, value: any) {
    //
    const { approvalCubeService } = this.injected;
    approvalCubeService.changeApprovalCubeProps(name, value);
    this.setState({ pageIndex: 0 });
    this.findAllApprovalCube();
  }

  render() {
    const { approvalCubeService, userWorkspaceService } = this.injected;
    const { approvalCubeOffsetList, approvalQueryCube } = approvalCubeService;
    const totalCount = approvalCubeOffsetList.totalCount;
    const { pageMap } = this.injected.sharedService || ({} as SharedService);
    const { pageIndex } = this.state;

    return (
      <Container fluid>
        <PageTitle breadcrumb={SelectType.paidCourseSections} />
        <ApprovalSearchBox
          onSearch={this.findAllApprovalCube}
          onClearQueryProps={this.onClearApprovalCubeQuery}
          queryModel={approvalQueryCube}
          searchWordOption={SelectType.searchPartForApproves}
          approvalCubeService={approvalCubeService}
          companyOptions={addSelectTypeBoxAllOption(userWorkspaceService.userWorkspaceSelectUsId)}
        />

        <SubActions>
          <SubActions.Left>
            <SubActions.Count number={totalCount} />
          </SubActions.Left>
          <SubActions.Right>
            <Select
              className="ui small-border dropdown m0"
              value={approvalQueryCube.sortOrder}
              control={Select}
              options={SelectType.sortFilterForApproval}
              onChange={(e: any, data: any) => this.setApprovalCubeCountForFind('sortOrder', data.value)}
            />
            <Select
              className="ui small-border dropdown m0"
              defaultValue={SelectType.limit[0].value}
              control={Select}
              options={SelectType.limit}
              onChange={(e: any, data: any) => this.setApprovalCubeCountForFind('limit', data.value)}
            />
            <SubActions.ExcelButton download onClick={this.onFindAllApprovalCubeExcel} />
          </SubActions.Right>
        </SubActions>
        <Loader>
          <ApprovalListView
            approvalCubeService={this.injected.approvalCubeService!}
            totalCount={totalCount}
            handleClickCubeRow={this.onClickApprovalCubeRow}
            searchState={approvalQueryCube.proposalState}
            pageIndex={pageIndex}
          />
        </Loader>
        {totalCount === 0 ? null : (
          <>
            <div className="center">
              <Pagination
                activePage={pageMap.get('approvalContents') ? pageMap.get('approvalContents').page : 1}
                totalPages={pageMap.get('approvalContents') ? pageMap.get('approvalContents').totalPages : 1}
                onPageChange={(e, data) => this.findAllApprovalCube(data.activePage as number)}
              />
            </div>
          </>
        )}
      </Container>
    );
  }
}

export default withRouter(ApprovalListContainer);
