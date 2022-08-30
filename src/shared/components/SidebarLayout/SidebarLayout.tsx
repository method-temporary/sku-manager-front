import React, { ReactNode } from 'react';
import { reactAutobind, ReactComponent } from '@nara.platform/accent';
import { withRouter, RouteComponentProps } from 'react-router-dom';

import SidebarLayoutContext from './context/SidebarLayoutContext';
import { Header, Menu, Segment } from 'semantic-ui-react';

interface Props extends RouteComponentProps<Params> {
  children: ReactNode;
  header: ReactNode;
  baseUrl: string;
  render: ReactNode;
}

interface Params {
  cineroomId: string;
}

@reactAutobind
class SidebarLayout extends ReactComponent<Props> {
  //
  getContext() {
    //
    return {
      activeItem: this.getActiveItem(),
      onClickItem: this.onClickItem,
    };
  }

  getActiveItem(): string {
    //
    const { pathname } = this.props.location;
    const baseUrl = `${this.getBaseUrl()}/`;

    if (pathname.startsWith(baseUrl)) {
      return pathname.replace(baseUrl, '');
    }

    return '';
  }

  getBaseUrl(): string {
    //
    const { match, baseUrl } = this.props;

    return `/cineroom/${match.params.cineroomId}/${baseUrl}`;
  }

  onClickItem(url: string) {
    //
    const { history } = this.props;

    history.push(`${this.getBaseUrl()}/${url}`);
  }

  render() {
    //
    const { children, header, render } = this.props;

    return (
      <SidebarLayoutContext.Provider value={this.getContext()}>
        <div className="flex">
          <div className="m-lnb">
            <Segment basic>
              <Header as="h3">{header}</Header>
            </Segment>

            <Menu vertical>{children}</Menu>
          </div>

          {render}
        </div>
      </SidebarLayoutContext.Provider>
    );
  }
}

export default withRouter(SidebarLayout);
