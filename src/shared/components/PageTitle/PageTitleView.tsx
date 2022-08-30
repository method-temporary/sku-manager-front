import React from 'react';
import { reactAutobind } from '@nara.platform/accent';
import { observer } from 'mobx-react';

import { Breadcrumb, Header } from 'semantic-ui-react';

interface Props {
  breadcrumb: BreadcrumbSection[];
  children?: React.ReactNode;
}

interface BreadcrumbSection {
  key: string;
  content: string;
  link?: boolean;
  active?: boolean;
  [key: string]: any;
}

@observer
@reactAutobind
class PageTitleView extends React.Component<Props> {
  //
  static defaultProps = {};

  getLastBreadcrumbSection(): string {
    //
    const { breadcrumb } = this.props;

    return breadcrumb[breadcrumb.length - 1].content;
  }

  render() {
    //
    const { breadcrumb, children } = this.props;

    return (
      <div>
        <Breadcrumb icon="right angle" sections={breadcrumb} />
        <Header as="h2">{children || this.getLastBreadcrumbSection()}</Header>
      </div>
    );
  }
}

export default PageTitleView;
