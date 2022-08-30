import * as React from 'react';
import { Menu } from 'semantic-ui-react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { reactAutobind, ReactComponent } from '@nara.platform/accent';
import { translationManagementUrl } from '../../../../Routes';

import { SharedService } from '../../../present';
import { inject, observer } from 'mobx-react';

interface Props extends RouteComponentProps<{ cineroomId: string }> {}

interface States {
  activeItem: string;
}

interface Injected {
  sharedService: SharedService;
}

@inject('sharedService')
@observer
@reactAutobind
class MenuSection extends ReactComponent<Props, States, Injected> {
  constructor(props: Props) {
    super(props);
    this.state = { activeItem: '' };
  }

  componentDidMount() {
    this.activateItem();
  }

  activateItem() {
    const splitIndex = `${process.env.NODE_ENV}` === 'development' ? 3 : 4;
    if (window.location.pathname.split('/')[splitIndex] === `${translationManagementUrl}`) {
      this.setState({ activeItem: 'Translation 관리' });
      this.injected.sharedService.setHeaderActiveItem('Translation 관리');
    }
  }

  handleItemClick(e: any, { name }: any) {
    const { history } = this.props;
    this.setState({ activeItem: name });
    this.injected.sharedService.setHeaderActiveItem(name);
    switch (name) {
      case 'Translation 관리':
        history.push(`/cineroom/${this.props.match.params.cineroomId}/${translationManagementUrl}/cubes/cube-list`);
        break;
    }
  }

  render() {
    const { headerActiveItem } = this.injected.sharedService;
    return (
      <Menu pointing secondary>
        <Menu.Item name="Translation 관리" active={headerActiveItem === 'Translation 관리'} onClick={this.handleItemClick} />
      </Menu>
    );
  }
}
export default withRouter(MenuSection);
