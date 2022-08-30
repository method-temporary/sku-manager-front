import * as React from 'react';
import { Header, Menu, Segment } from 'semantic-ui-react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { reactAutobind } from '@nara.platform/accent';
import { baseUrl, displayManagementUrl } from '../../../../Routes';

interface Props extends RouteComponentProps<{ cineroomId: string }> {}
@reactAutobind
class ArrangeSideBar extends React.Component<Props> {
  //
  state = { activeItem: '' };
  handleItemClick(name: string, url: string) {
    this.setState({ activeItem: name });
    window.location.href = url;
  }

  render() {
    const { activeItem } = this.state;
    const serviceUrl = `${baseUrl}cineroom/${this.props.match.params.cineroomId}/${displayManagementUrl}`;

    return (
      <div className="m-lnb">
        <Segment basic>
          <Header as="h3">Main 전시관리</Header>
        </Segment>
        <Menu vertical>
          <Menu.Item>
            <Menu.Header>Main 전시관리</Menu.Header>
            <Menu.Menu>
              <Menu.Item
                name="required-arrange"
                value="required-arrange"
                active={activeItem === 'required-arrange'}
                onClick={() => this.handleItemClick('required-arrange', serviceUrl + `/arrange/required-arrange-list`)}
              >
                권장과정 편성
              </Menu.Item>
              <Menu.Item
                name="popular-arrange"
                value="popular-arrange"
                active={activeItem === 'popular-arrange'}
                onClick={() => this.handleItemClick('popular-arrange', serviceUrl + `/arrange/popular-arrange-list`)}
              >
                인기과정 편성
              </Menu.Item>
              <Menu.Item
                name="new-arrange"
                value="new-arrange"
                active={activeItem === 'new-arrange'}
                onClick={() => this.handleItemClick('new-arrange', serviceUrl + `/arrange/new-arrange-list`)}
              >
                신규과정 편성
              </Menu.Item>
            </Menu.Menu>
          </Menu.Item>

          <Menu.Item>
            <Menu.Header>Banner 관리</Menu.Header>
            <Menu.Menu>
              <Menu.Item
                name="banner-list"
                value="banner-list"
                active={activeItem === 'banner-list'}
                onClick={() => this.handleItemClick('banner-list', serviceUrl + `/banners/banner-list`)}
              >
                Banner 등록관리
              </Menu.Item>
              <Menu.Item
                name="banner-arrange"
                value="banner-arrange"
                active={activeItem === 'banner-arrange'}
                onClick={() => this.handleItemClick('banner-arrange', serviceUrl + `/banners/bannerBundle-list`)}
              >
                Banner 편성관리
              </Menu.Item>
            </Menu.Menu>
          </Menu.Item>
        </Menu>
      </div>
    );
  }
}

export default withRouter(ArrangeSideBar);
