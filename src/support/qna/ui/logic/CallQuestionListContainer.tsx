import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter, RouteComponentProps } from 'react-router';
import { Container, Pagination } from 'semantic-ui-react';
import XLSX from 'xlsx';

import { reactAutobind, ReactComponent } from '@nara.platform/accent';

import { SelectTypeModel } from 'shared/model';
import { SharedService } from 'shared/present';
import { getPolyglotToAnyString } from 'shared/components/Polyglot';

import { serviceManagementUrl } from 'Routes';
import PostService from 'cube/board/post/present/logic/PostService';
import CategoryService from 'cube/board/category/present/logic/CategoryService';
import { PostQueryModel } from 'cube/board/post/model/PostQueryModel';
import AlertWinForSearchBox from 'cube/board/board/ui/logic/AlertWinForSearchBox';
import { PostListViewXlsxModel } from 'cube/board/post/model/PostListViewXlsxModel';
import { PostModel } from 'cube/board/post/model/PostModel';
import { UserWorkspaceService } from 'userworkspace';
import CallQuestionListView from '../view/CallQuestionListView';

interface Props extends RouteComponentProps<{ cineroomId: string }> {}

interface States {
  pageIndex: number;
  mode: string;
  alertWinForSearchBoxOpen: boolean;
}

interface Injected {
  postService: PostService;
  userWorkspaceService: UserWorkspaceService;
  categoryService: CategoryService;
  sharedService: SharedService;
}

@inject('postService', 'categoryService', 'sharedService', 'userWorkspaceService')
@observer
@reactAutobind
class CallQuestionListContainer extends ReactComponent<Props, States, Injected> {
  //
  constructor(props: Props) {
    super(props);
    this.state = {
      pageIndex: 0,
      mode: 'default',
      alertWinForSearchBoxOpen: false,
    };
  }

  componentDidMount() {
    //
    this.init();
  }

  componentWillUnmount() {
    const { postService } = this.injected;
    postService.clearPostQuery();
  }

  async init() {
    const { postService, categoryService, userWorkspaceService } = this.injected;
    if (postService) {
      if (this.state.mode === 'default') {
        this.findCallsByDefault();
      } else if (this.state.mode === 'search') {
        this.findCallsBySearch();
      }
    }

    if (userWorkspaceService.userWorkspaceSelectUsId) {
      await userWorkspaceService.findAllUserWorkspacesMap();
    }
    categoryService.findCategoriesByBoardId('QNA');
  }

  routeToCreatePost() {
    //
    this.props.history.push(
      `/cineroom/${this.props.match.params.cineroomId}/${serviceManagementUrl}/boards/call-question-detail/create`
    );
  }

  getCategoryOptions() {
    //
    const { categories } = this.injected.categoryService;
    const list: SelectTypeModel[] = [new SelectTypeModel('All', '전체', 'All')];
    if (categories && categories.length) {
      categories?.forEach((category, index) => {
        list.push(
          new SelectTypeModel(
            String(index + 1),
            getPolyglotToAnyString(category.name),
            getPolyglotToAnyString(category.name)
          )
        );
      });
    }
    return list;
  }

  getCompanyOptions() {
    //
    const { userWorkspaceSelectUsId } = this.injected.userWorkspaceService;
    return [new SelectTypeModel('All', '전체', 'All'), ...userWorkspaceSelectUsId];
  }

  handleClickPostRow(postId: string) {
    //
    this.props.history.push(
      `/cineroom/${this.props.match.params.cineroomId}/${serviceManagementUrl}/boards/call-question-detail/${postId}`
    );
  }

  onChangePostQueryProps(name: string, value: string | number) {
    //
    const { postService } = this.injected;
    postService!.changePostQueryProps(name, value);
  }

  onSearchPostsBySearchBox(page?: number) {
    //
    const { postService } = this.injected;
    if (postService) {
      const postQueryObject = PostQueryModel.isBlank(postService.postQuery);
      if (postQueryObject === 'success' && postService.postQuery) {
        this.setState({ mode: 'search' });
        this.findCallsBySearch(page);
        return;
      }
      if (postQueryObject !== 'success') {
        this.setState({ alertWinForSearchBoxOpen: true });
      }
    }
  }

  findCallsByDefault(page?: number) {
    const { sharedService, postService } = this.injected;
    if (sharedService && postService) {
      let offset = 0;
      const limit = 20;
      if (page) {
        this.setState({ pageIndex: (page - 1) * limit });
        sharedService.setPage('call', page);
        offset = (page - 1) * limit;
      } else {
        sharedService.setPageMap('call', 0, limit);
      }
      postService.findCallsByBoardIdAndDefaultPeriod('CALL', offset, limit).then(() => {
        sharedService.setCount('call', postService.calls.totalCount);
      });
    }
  }

  findCallsBySearch(page?: number) {
    const { sharedService, postService } = this.injected;
    if (sharedService && postService) {
      let offset = 0;
      if (page) {
        sharedService.setPage('call', page);
        offset = (page - 1) * postService.postQuery.limit;
      } else {
        sharedService.setPageMap('call', 0, postService.postQuery.limit);
      }

      postService.changePostQueryProps('offset', offset);

      postService
        .findCallsForAdminByQuery('CALL')
        .then(() => {
          if (page) this.setState({ pageIndex: (page - 1) * 20 });
        })
        .then(() => sharedService.setCount('call', postService.calls.totalCount));
    }
  }

  handleCloseAlertForSearchBoxWin() {
    //
    this.setState({
      alertWinForSearchBoxOpen: false,
    });
  }

  onClearPostQueryProps() {
    //
    const { postService } = this.injected;
    postService!.clearPostQuery();
  }

  async findAllCallQuestionExcel() {
    const fileName = `calls.xlsx`;
    const { postService } = this.injected;
    await postService!.findAllCallForExcel().then((calls: any[]) => {
      const callXlsxList: PostListViewXlsxModel[] = [];
      calls.map((cube, index) => {
        callXlsxList.push(PostModel.asXLSX(cube, index));
      });
      const callExcel = XLSX.utils.json_to_sheet(callXlsxList);
      const temp = XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(temp, callExcel, 'qnas');
      XLSX.writeFile(temp, fileName, { compression: true });
    });
    return fileName;
  }

  render() {
    //
    const { postService, sharedService } = this.injected;

    const { calls, postQuery } = postService;
    const result = calls.results;
    const totalCount = calls.totalCount;
    const { pageMap } = sharedService;
    const { pageIndex, mode } = this.state;
    const { alertWinForSearchBoxOpen } = this.state;
    return (
      <Container fluid>
        <CallQuestionListView
          postQuery={postQuery}
          onChangePostQueryProps={this.onChangePostQueryProps}
          onClearPostQuery={this.onClearPostQueryProps}
          categoryOptions={this.getCategoryOptions()}
          result={result}
          totalCount={totalCount}
          routeToCreatePost={this.routeToCreatePost}
          handleClickPostRow={this.handleClickPostRow}
          onSearchPostsBySearchBox={this.onSearchPostsBySearchBox}
          pageIndex={pageIndex}
          state={mode}
          companyOptions={this.getCompanyOptions()}
          findAllCallQuestionExcel={this.findAllCallQuestionExcel}
        />
        {(this.state.mode === 'default' && (
          <div className="center">
            <Pagination
              activePage={pageMap.get('call') ? pageMap.get('call').page : 1}
              totalPages={pageMap.get('call') ? pageMap.get('call').totalPages : 1}
              onPageChange={(e, data) => this.findCallsByDefault(data.activePage as number)}
            />
          </div>
        )) ||
          (this.state.mode === 'search' && calls && calls.results.length !== 0 && (
            <div className="center">
              <Pagination
                activePage={pageMap.get('call') ? pageMap.get('call').page : 1}
                totalPages={pageMap.get('call') ? pageMap.get('call').totalPages : 1}
                onPageChange={(e, data) => this.findCallsBySearch(data.activePage as number)}
              />
            </div>
          ))}
        <AlertWinForSearchBox handleClose={this.handleCloseAlertForSearchBoxWin} open={alertWinForSearchBoxOpen} />
      </Container>
    );
  }
}

export default withRouter(CallQuestionListContainer);
