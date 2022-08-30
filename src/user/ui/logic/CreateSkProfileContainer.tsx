import React from 'react';
import { Container, Header } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { reactAutobind } from '@nara.platform/accent';
import { UserService } from '../../index';

interface Params {
  id: string;
}

interface Props extends RouteComponentProps<Params> {
  userService: UserService;
}

@inject('userService')
@reactAutobind
@observer
class CreateSkProfileContainer extends React.Component<Props> {
  // componentDidMount() {
  //   this.findPost();
  // }

  // findPost() {
  //   const { id } = this.props.match.params;
  //   this.props.postService.findPost(id);
  // }
  //
  // handleRemove() {
  //   const { id } = this.props.match.params;
  //   this.props.postService.removePost(id)
  //     .then(() => this.props.history.push('/posts'));
  // }

  render() {
    // const { post } = this.props.postService;

    return (
      <Container id="container">
        <div className="content">
          <Header as="h2">Post</Header>
        </div>
      </Container>
    );
  }
}

export default withRouter(CreateSkProfileContainer);
