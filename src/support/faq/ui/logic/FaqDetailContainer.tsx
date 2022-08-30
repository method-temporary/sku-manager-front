import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router';

import { Container } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { reactAutobind } from '@nara.platform/accent';
import PostService from '../../../../cube/board/post/present/logic/PostService';
import CategoryService from '../../../../cube/board/category/present/logic/CategoryService';
import { serviceManagementUrl } from '../../../../Routes';
import FaqDetailView from '../view/FaqDetailView';
import { LoaderService } from 'shared/components/Loader/present/logic/LoaderService';
import { Loader } from 'shared/components';

interface Props extends RouteComponentProps<{ cineroomId: string; postId: string }> {
  postService?: PostService;
  categoryService?: CategoryService;
}

interface States {
  alertWinOpen: boolean;
  confirmWinOpen: boolean;
  isBlankTarget: string;
}

@inject('postService', 'categoryService')
@observer
@reactAutobind
class FaqDetailContainer extends React.Component<Props, States> {
  //
  constructor(props: Props) {
    //
    super(props);
    this.state = {
      alertWinOpen: false,
      confirmWinOpen: false,
      isBlankTarget: '',
    };
  }

  componentDidMount() {
    //
    this.init();
  }

  init() {
    //
    const { postService, categoryService } = this.props;
    const { postId } = this.props.match.params;
    if (postService && categoryService) {
      postService.findPostByPostId(postId);
    }
  }

  routeToPostList() {
    //
    this.props.history.push(
      `/cineroom/${this.props.match.params.cineroomId}/${serviceManagementUrl}/supports/faq-list`
    );
  }

  routeToModifyFaq(postId: string) {
    //
    this.props.history.push(
      `/cineroom/${this.props.match.params.cineroomId}/${serviceManagementUrl}/supports/faq-modify/${postId}`
    );
  }

  handleOKConfirmWin() {
    //
    const { postService } = this.props;
    const { postId } = this.props.match.params;
    LoaderService.instance.openLoader(false);
    Promise.resolve()
      .then(() => postService && postService.changePostProps('deleted', String(true)))
      .then(() => postService && postService.modifyPost(postId, postService.post))
      .then(() => this.routeToPostList());
    LoaderService.instance.closeLoader(false);
  }

  handleCloseAlertWin() {
    //
    this.setState({
      alertWinOpen: false,
    });
  }

  handleCloseConfirmWin() {
    //
    this.setState({
      confirmWinOpen: false,
    });
  }

  handleDelete() {
    //
    this.setState({ confirmWinOpen: true });
  }

  render() {
    const { post } = this.props.postService || ({} as PostService);
    const { alertWinOpen, isBlankTarget, confirmWinOpen } = this.state;

    return (
      <Container fluid>
        <Loader>
          <FaqDetailView
            post={post}
            handleDelete={this.handleDelete}
            routeToModifyFaq={this.routeToModifyFaq}
            routeToPostList={this.routeToPostList}
            handleCloseAlertWin={this.handleCloseAlertWin}
            handleCloseConfirmWin={this.handleCloseConfirmWin}
            handleOKConfirmWin={this.handleOKConfirmWin}
            isBlankTarget={isBlankTarget}
            alertWinOpen={alertWinOpen}
            confirmWinOpen={confirmWinOpen}
          />
        </Loader>
      </Container>
    );
  }
}

export default withRouter(FaqDetailContainer);
