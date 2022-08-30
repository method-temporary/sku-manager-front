import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { reactAutobind } from '@nara.platform/accent';
import { RouteComponentProps, withRouter } from 'react-router';
import { Container, Form, Tab } from 'semantic-ui-react';
import CategoryService from '../../../../cube/board/category/present/logic/CategoryService';
import PostService from '../../../../cube/board/post/present/logic/PostService';
import CreateQnaCategoryContainer from './CreateQnaCategoryContainer';
import { SupportType } from '../../model/vo/SupportType';

const panes = [
  {
    menuItem: 'Q&A',
    render: () => (
      <Tab.Pane>
        <CreateQnaCategoryContainer supportType={SupportType.QNA} />
      </Tab.Pane>
    ),
  },
  // TODO 추후 개발 2021/09/10 박종유
  // {
  //   menuItem: 'FAQ',
  //   render: () => (
  //     <Tab.Pane>
  //       <CreateQnaCategoryContainer supportType={SupportType.FAQ} />
  //     </Tab.Pane>
  //   ),
  // },
];

interface Props extends RouteComponentProps {
  postService?: PostService;
  categoryService?: CategoryService;
}

@inject('postService', 'categoryService')
@observer
@reactAutobind
class CreateCategoryContainer extends React.Component<Props> {
  //
  componentDidMount() {}

  render() {
    return (
      <Container fluid>
        <Form>
          <Tab panes={panes} />
        </Form>
      </Container>
    );
  }
}

export default withRouter(CreateCategoryContainer);
