import * as React from 'react';
import { reactAutobind, ReactComponent } from '@nara.platform/accent';

import { SidebarLayout } from '../../../components';
import { translationManagementUrl } from '../../../../Routes';

@reactAutobind
class TranslationSideBarLayout extends ReactComponent {
  //
  render() {
    const { children } = this.props;
    return (
      <SidebarLayout header="Translation 관리" baseUrl={translationManagementUrl} render={children}>
        <SidebarLayout.Section header="과정관리">
          <SidebarLayout.Item text="Cube 관리" url="cubes/cube-list" activeUrl="cubes/cube" />
          <SidebarLayout.Item text="Card 관리" url="cards/card-list" activeUrl="cards/card" />
        </SidebarLayout.Section>
      </SidebarLayout>
    );
  }
}

export default TranslationSideBarLayout;
