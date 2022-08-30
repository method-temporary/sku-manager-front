import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { RouteComponentProps, withRouter } from 'react-router';
import { Breadcrumb, Container, Header } from 'semantic-ui-react';
import { Moment } from 'moment';
import XLSX from 'xlsx';

import { reactAutobind, ReactComponent } from '@nara.platform/accent';

import { SearchBox } from 'shared/ui';
import { SelectType } from 'shared/model';
import { SharedService } from 'shared/present';
import { Pagination, SubActions, Loader } from 'shared/components';

import { AplService } from '../../index';
import { UserService } from '../../../user';
import AplListView from '../view/AplListView';
import { AplListViewModel } from '../../model/AplListViewModel';
import { AplXlsxModel } from '../../model/AplXlsxModel';
import { CollegeService } from '../../../college';
import { learningManagementUrl } from '../../../Routes';

interface Props extends RouteComponentProps<{ cineroomId: string }> {
  handleAplListOk?: (commonTreeCode: string, commonTreeId: number) => void;
  handleAplListClear?: () => void;
}

interface injected {
  aplService: AplService;
  sharedService: SharedService;
  userService: UserService;
  collegeService: CollegeService;
}

@inject('aplService', 'sharedService', 'userService', 'collegeService')
@observer
@reactAutobind
class AplListContainer extends ReactComponent<Props, {}, injected> {
  //
  paginationKey = 'AplList';

  constructor(props: Props) {
    super(props);
    this.state = { pageIndex: 0 };
  }

  componentDidMount() {
    const { userService } = this.injected;
    if (userService) {
      userService.findUser();
    }
    this.init();
  }

  componentWillUnmount() {
    /*
    const { aplService } = this.injected;
    if (aplService) {
      aplService.clearAplQueryProps();
      //AplService.changeTreeActiveKey('');
    }
    */
  }

  init() {
    // const { aplService } = this.injected;
    // const aplSearchInit = aplService.aplSearchInit;
    //let currentPage = 0;
    //if (aplService) currentPage = aplService.aplQuery.currentPage;

    //if (aplSearchInit) {
    //this.onSetSearchMon(1);
    //}
    //aplService.changeAplSearchInit(true);
    this.findAllApls();
  }

  //Execl
  async findAllAplsExcel() {
    const { aplService, collegeService } = this.injected;
    const apls = await aplService!.findAllAplsForExcel();
    const { collegesMap, channelMap } = collegeService;

    const aplXlsxList: AplXlsxModel[] = [];

    apls?.forEach((apl, index) => {
      aplXlsxList.push(AplListViewModel.asXLSX(apl, index, collegesMap, channelMap));
    });
    const aplExcel = XLSX.utils.json_to_sheet(aplXlsxList);
    const temp = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(temp, aplExcel, '개인학습');

    // const date = moment().format('YYYY-MM-DD hh:mm:ss');
    const fileName = `개인학습 과정 승인관리.xlsx`;
    XLSX.writeFile(temp, fileName, { compression: true });
    return fileName;
  }

  //  조회
  findAllApls() {
    const { sharedService, aplService } = this.injected;

    const pageModel = sharedService.getPageModel(this.paginationKey);

    aplService.findAllAplsByQuery(pageModel).then((response) => {
      sharedService.setCount(this.paginationKey, response.totalCount);
    });
  }

  handleClickAplRow(aplId: string) {
    //
    const { aplService } = this.injected;
    if (aplService) {
      aplService.findApl(aplId).then((apl) => {
        const aplState = apl.state;
        this.props.history.push(
          `/cineroom/${
            this.props.match.params.cineroomId
            //}/${learningManagementUrl}/display/Apl-detail/${AplId.toString()}/${menuMain.state}/${menuMain.AplType}`
          }/${learningManagementUrl}/cubes/apl-approve-management/apl-detail/${aplId}/${aplState}`
        );
      });
    }
  }

  onChangeAplQueryProps(name: string, value: string | Moment | number) {
    const { aplService } = this.injected;
    if (aplService) aplService.changeAplQueryProps(name, value);
  }

  setAplCountForFind(name: string, value: string) {
    //
    const { aplService } = this.injected;
    if (aplService) {
      aplService.changeAplQueryProps(name, value);
      this.setState({ pageIndex: 0 });
    }

    this.findAllApls();
  }

  clearAplQueryProps() {
    //
    const { aplService } = this.injected;
    if (aplService) aplService.clearAplQueryProps();
  }

  render() {
    const { aplService, sharedService, collegeService } = this.injected;
    const { apls, aplQuery } = aplService;
    const result = apls.results;
    const { count, offset } = sharedService.getPageModel(this.paginationKey);
    const { collegesMap, channelMap } = collegeService;

    return (
      <>
        <Container fluid>
          <div>
            <Breadcrumb icon="right angle" sections={SelectType.addPersonalLearningSection} />
            <Header as="h2">개인학습과정</Header>
          </div>
          <SearchBox
            onSearch={this.findAllApls}
            onChangeQueryProps={this.onChangeAplQueryProps}
            onClearQueryProps={this.clearAplQueryProps}
            queryModel={aplQuery}
            searchWordOption={SelectType.aplOptions}
            defaultPeriod={2}
            collegeAndChannel
          />

          <Pagination name={this.paginationKey} onChange={this.findAllApls}>
            <SubActions>
              <SubActions.Left>
                <SubActions.Count number={count} />
              </SubActions.Left>

              <SubActions.Right>
                <Pagination.LimitSelect />
                <SubActions.ExcelButton download onClick={this.findAllAplsExcel} />
              </SubActions.Right>
            </SubActions>

            <Loader>
              <AplListView
                result={result}
                handleClickAplRow={this.handleClickAplRow}
                startNo={count - offset}
                aplService={aplService}
                collegesMap={collegesMap}
                channelMap={channelMap}
              />
            </Loader>

            <Pagination.Navigator />
          </Pagination>
        </Container>
      </>
    );
  }
}

export default withRouter(AplListContainer);
