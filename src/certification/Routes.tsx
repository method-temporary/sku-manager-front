import React from 'react';
import { RouteComponentProps, Switch, Route } from 'react-router-dom';
import { CertificateManagerSideBarLayout } from 'shared/ui';
import {
  BadgeCreateContainer,
  BadgeDetailContainer,
  BadgeListContainer,
  BadgeApprovalListContainer,
  BadgeApprovalDetailContainer,
  BadgeApproverManagementListContainer,
  BadgeArrangeManagementListContainer,
  BadgeOrderListContainer,
} from './index';
import { BadgeCategoryManagementContainer, CreateBadgeCategoryManagementContainer } from './badge/category';

class Routes extends React.PureComponent<RouteComponentProps> {
  render() {
    const { match } = this.props;

    return (
      <Switch>
        <Route
          path={`${match.path}`}
          component={({ match }: any) => (
            <CertificateManagerSideBarLayout>
              {/* Badge 분야 관리 */}
              <Route
                exact
                path={`${match.path}/badgeCategory/badge-category-list`}
                component={BadgeCategoryManagementContainer}
              />
              <Route
                exact
                path={`${match.path}/badgeCategory/badge-category-create`}
                component={CreateBadgeCategoryManagementContainer}
              />
              <Route
                exact
                path={`${match.path}/badgeCategory/badge-category-create/:badgeCategoryId`}
                component={CreateBadgeCategoryManagementContainer}
              />

              {/* Badge 관리 */}
              <Route exact path={`${match.path}/badges/badge-list`} component={BadgeListContainer} />
              <Route exact path={`${match.path}/badges/badge-create`} component={BadgeCreateContainer} />
              <Route exact path={`${match.path}/badges/badge-modify/:badgeId`} component={BadgeCreateContainer} />
              <Route exact path={`${match.path}/badges/badge-detail/:badgeId`} component={BadgeDetailContainer} />

              {/* Badge 승인 관리 */}
              <Route exact path={`${match.path}/badge-approval/approval-list`} component={BadgeApprovalListContainer} />
              <Route
                exact
                path={`${match.path}/badge-approval/approval-detail/:badgeId`}
                component={BadgeApprovalDetailContainer}
              />

              {/* Badge 승인자 관리 */}
              <Route
                exact
                path={`${match.path}/badge-approver-management/approver-list`}
                component={BadgeApproverManagementListContainer}
              />
              <Route
                exact
                path={`${match.path}/badge-arrange-management/arrange-list`}
                component={BadgeArrangeManagementListContainer}
              />
              <Route
                exact
                path={`${match.path}/badge-arrange-management/order-list`}
                component={BadgeOrderListContainer}
              />
            </CertificateManagerSideBarLayout>
          )}
        />
      </Switch>
    );
  }
}

export default Routes;
