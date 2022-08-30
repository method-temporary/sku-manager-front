import React from 'react';
import { RouteComponentProps, Switch, Route } from 'react-router-dom';
import { SupportSideBarLayout } from 'shared/ui';
import { CreateCategoryContainer } from 'support/category/index';
import { FaqListContainer, FaqDetailContainer, FaqCreateContainer, FaqModifyContainer } from 'support/faq/index';
import { QuestionOperatorListContainer } from './operator';
import { QnaListContainer, CreateQnaContainer } from './qna';

class Routes extends React.PureComponent<RouteComponentProps> {
  render() {
    const { match } = this.props;

    return (
      <Switch>
        <Route
          path={`${match.path}`}
          component={({ match }: any) => (
            <SupportSideBarLayout>
              <Route exact path={`${match.path}/category-list`} component={CreateCategoryContainer} />
              <Route exact path={`${match.path}/operator-list`} component={QuestionOperatorListContainer} />
              <Route exact path={`${match.path}/qna-list`} component={QnaListContainer} />
              <Route exact path={`${match.path}/qna-create`} component={CreateQnaContainer} />
              <Route exact path={`${match.path}/qna-detail/:qnaId`} component={CreateQnaContainer} />
              <Route exact path={`${match.path}/faq-list`} component={FaqListContainer} />
              <Route exact path={`${match.path}/faq-create`} component={FaqCreateContainer} />
              <Route exact path={`${match.path}/faq-detail/:postId`} component={FaqDetailContainer} />
              <Route exact path={`${match.path}/faq-modify/:postId`} component={FaqModifyContainer} />
            </SupportSideBarLayout>
          )}
        />
      </Switch>
    );
  }
}

export default Routes;
