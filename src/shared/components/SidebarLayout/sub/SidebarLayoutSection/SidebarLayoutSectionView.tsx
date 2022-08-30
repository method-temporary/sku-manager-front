import React from 'react';
import { reactAutobind, ReactComponent } from '@nara.platform/accent';
import { Menu } from 'semantic-ui-react';

interface Props {
  children: React.ReactNode;
  header?: React.ReactNode;
}

@reactAutobind
class SidebarLayoutSectionView extends ReactComponent<Props> {
  //

  render() {
    //
    const { children, header } = this.props;

    return (
      <Menu.Item>
        {header && <Menu.Header>{header}</Menu.Header>}

        <Menu.Menu>{children}</Menu.Menu>
      </Menu.Item>
    );
  }
}

export default SidebarLayoutSectionView;
