import React from 'react';
import { reactAutobind, ReactComponent } from '@nara.platform/accent';
import { withRouter, RouteComponentProps } from 'react-router-dom';

import { Menu } from 'semantic-ui-react';
import SidebarLayoutContext from '../../context/SidebarLayoutContext';

interface Props extends RouteComponentProps {
  text: string;
  url: string;
  activeUrl?: string;
}

@reactAutobind
class SidebarLayoutItemView extends ReactComponent<Props> {
  //
  static contextType = SidebarLayoutContext;

  context!: React.ContextType<typeof SidebarLayoutContext>;

  render() {
    //
    const { text, url, activeUrl } = this.props;
    const { activeItem, onClickItem } = this.context;

    return (
      // <Menu.Item name={url} active={activeItem === url} onClick={() => onClickItem(`${url}`)}>
      <Menu.Item name={url} active={activeItem.startsWith(activeUrl || url)} onClick={() => onClickItem(`${url}`)}>
        {text}
      </Menu.Item>
    );
  }
}

export default withRouter(SidebarLayoutItemView);
