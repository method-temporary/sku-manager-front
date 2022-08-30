import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import { inject, observer } from 'mobx-react';
import { reactAutobind } from '@nara.platform/accent';
import { Container, Pagination } from 'semantic-ui-react';
import { PostService } from '../../../index';
import { SharedService } from 'shared/present';
import NoticeListView from '../view/NoticeListView';
import { serviceManagementUrl } from '../../../../../Routes';
import AlertWinForSearchBox from './AlertWinForSearchBox';
import { PostQueryModel } from '../../../post/model/PostQueryModel';

interface Props extends RouteComponentProps<{ cineroomId: string }> {
  postService?: PostService;
  sharedService?: SharedService;
}

interface States {
  pageIndex: number;
  mode: string;
  alertWinForSearchBoxOpen: boolean;
}

@inject('postService', 'sharedService')
@observer
@reactAutobind
class NoticeListContainer extends React.Component<Props, States> {
  //
  constructor(props: Props) {
    super(props);
    this.state = {
      pageIndex: 0,
      mode: 'search',
      alertWinForSearchBoxOpen: false,
    };
  }

  componentDidMount() {
    this.init();
  }

  componentWillUnmount() {
    const { postService } = this.props;
    if (postService === undefined) {
      return;
    }
    postService.clearPostQuery();
  }

  init() {
    //
    if (this.state.mode === 'default') {
      this.findNoticesByDefault();
    } else if (this.state.mode === 'search') {
      this.findNoticesBySearch();
    }
  }

  routeToCreatePost() {
    //
    this.props.history.push(
      `/cineroom/${this.props.match.params.cineroomId}/${serviceManagementUrl}/boards/notice-create/`
    );
  }

  routeToNoticeList() {
    //
    this.props.history.push(
      `/cineroom/${this.props.match.params.cineroomId}/${serviceManagementUrl}/boards/notice-list/`
    );
  }

  handleClickPostRow(postId: string) {
    //
    this.props.history.push(
      `/cineroom/${this.props.match.params.cineroomId}/${serviceManagementUrl}/boards/notice-detail/${postId}`
    );
  }

  onChangePostQueryProps(name: string, value: any) {
    //
    const { postService } = this.props;
    postService!.changePostQueryProps(name, value);
  }

  onSearchPostsBySearchBox(page?: number) {
    //
    const { postService } = this.props;
    if (postService) {
      const postQueryObject = PostQueryModel.isBlank(postService.postQuery);
      if (postQueryObject === 'success') {
        this.setState({ mode: 'search' });
        this.findNoticesBySearch(page);
        return;
      }
      if (postQueryObject !== 'success') {
        this.setState({ alertWinForSearchBoxOpen: true });
      }
    }
  }

  findNoticesByDefault(page?: number) {
    const { sharedService, postService } = this.props;
    if (sharedService && postService) {
      let offset = 0;
      const limit = 20;
      if (page) {
        sharedService.setPage('notice', page);
        offset = (page - 1) * limit;
      } else {
        sharedService.setPageMap('notice', 0, limit);
      }

      postService
        .findNoticesByBoardIdAndDefaultPeriod('NTC', offset, limit)
        .then(() => {
          if (page) this.setState({ pageIndex: (page - 1) * limit });
        })
        .then(() => {
          sharedService.setCount('notice', postService.notices ? postService.notices.totalCount : 0);
        });
    }
  }

  findNoticesBySearch(page?: number) {
    const { sharedService, postService } = this.props;
    if (sharedService && postService) {
      let offset = 0;
      if (page) {
        sharedService.setPage('notice', page);
        offset = (page - 1) * postService.postQuery.limit;
      } else {
        sharedService.setPageMap('notice', 0, postService.postQuery.limit);
      }

      postService.changePostQueryProps('offset', offset);

      postService
        .findNoticesForAdminByQuery('NTC')
        .then(() => {
          if (page) this.setState({ pageIndex: (page - 1) * 20 });
        })
        .then(() => sharedService.setCount('notice', postService.notices.totalCount));
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
    const { postService } = this.props;
    postService!.clearPostQuery();
  }

  render() {
    const { notices, postQuery } = this.props.postService!;
    const result = notices.results;
    const totalCount = notices.totalCount;
    const { pageMap } = this.props.sharedService!;
    const { pageIndex, mode, alertWinForSearchBoxOpen } = this.state;
    return (
      <Container fluid>
        <NoticeListView
          postQuery={postQuery}
          onChangePostQueryProps={this.onChangePostQueryProps}
          onClearPostQueryProps={this.onClearPostQueryProps}
          result={result}
          totalCount={totalCount}
          routeToCreatePost={this.routeToCreatePost}
          handleClickPostRow={this.handleClickPostRow}
          onSearchPostsBySearchBox={this.onSearchPostsBySearchBox}
          state={mode}
          pageIndex={pageIndex}
        />

        {(this.state.mode === 'default' && (
          <div className="center">
            <Pagination
              activePage={pageMap.get('notice') ? pageMap.get('notice').page : 1}
              totalPages={pageMap.get('notice') ? pageMap.get('notice').totalPages : 1}
              onPageChange={(e, data) => this.findNoticesByDefault(data.activePage as number)}
            />
          </div>
        )) ||
          (this.state.mode === 'search' && notices && notices.results.length !== 0 && (
            <div className="center">
              <Pagination
                activePage={pageMap.get('notice') ? pageMap.get('notice').page : 1}
                totalPages={pageMap.get('notice') ? pageMap.get('notice').totalPages : 1}
                onPageChange={(e, data) => this.findNoticesBySearch(data.activePage as number)}
              />
            </div>
          ))}
        <AlertWinForSearchBox handleClose={this.handleCloseAlertForSearchBoxWin} open={alertWinForSearchBoxOpen} />
      </Container>
    );
  }
}

export default withRouter(NoticeListContainer);
