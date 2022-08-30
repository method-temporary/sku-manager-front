import * as React from 'react';
import { Menu } from 'semantic-ui-react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { reactAutobind, ReactComponent } from '@nara.platform/accent';
import { patronInfo } from '@nara.platform/dock';
import {
  learningManagementUrl,
  serviceManagementUrl,
  userManagementUrl,
  displayManagementUrl,
  certificationManagementUrl,
  communityManagementUrl,
} from '../../../Routes';

import { SharedService } from '../../present';
import { inject, observer } from 'mobx-react';
import { isSuperManager } from '../logic/isSuperManager';
import { MenuAuthority } from './authority/MenuAuthority';

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
    //
    const splitIndex = `${process.env.NODE_ENV}` === 'development' ? 3 : 4;

    if (window.location.pathname.split('/')[splitIndex] === `${userManagementUrl}`) {
      this.setState({ activeItem: '회원 관리' });
      this.injected.sharedService.setHeaderActiveItem('회원 관리');
    }
    if (window.location.pathname.split('/')[splitIndex] === `${learningManagementUrl}`) {
      this.setState({ activeItem: 'Learning 관리' });
      this.injected.sharedService.setHeaderActiveItem('Learning 관리');
    }
    if (window.location.pathname.split('/')[splitIndex] === `${communityManagementUrl}`) {
      this.setState({ activeItem: 'Community 관리' });
      this.injected.sharedService.setHeaderActiveItem('Community 관리');
    }
    // if (window.location.pathname.split('/')[2] === `${contentsManagementUrl}`) this.setState({ activeItem: '콘텐츠 관리' });
    if (window.location.pathname.split('/')[splitIndex] === `${serviceManagementUrl}`) {
      this.setState({ activeItem: '서비스 관리' });
      this.injected.sharedService.setHeaderActiveItem('서비스 관리');
    }
    // if (window.location.pathname.split('/')[2] === `${systemManagementUrl}`) this.setState({ activeItem: '시스 관리' });
    if (window.location.pathname.split('/')[splitIndex] === `${displayManagementUrl}`) {
      this.setState({ activeItem: '전시 관리' });
      this.injected.sharedService.setHeaderActiveItem('전시 관리');
    }
    if (window.location.pathname.split('/')[splitIndex] === `${certificationManagementUrl}`) {
      this.setState({ activeItem: 'Certification 관리' });
      this.injected.sharedService.setHeaderActiveItem('Certification 관리');
    }
  }

  handleItemClick(e: any, { name }: any) {
    const { history } = this.props;

    this.setState({ activeItem: name });

    this.injected.sharedService.setHeaderActiveItem(name);

    const roles = patronInfo.getPatronRoles(patronInfo.getCineroomId());

    switch (name) {
      case '회원 관리':
        //window.location.href = `${baseUrl}cineroom/${this.props.match.params.cineroomId}/${userManagementUrl}/instructors/instructor-manager`;
        history.push(
          this.props.match.params.cineroomId === 'ne1-m2-c2'
            ? `/cineroom/${this.props.match.params.cineroomId}/${userManagementUrl}/instructors/instructor-list`
            : `/cineroom/${this.props.match.params.cineroomId}/${userManagementUrl}/user/user-list`
        );
        break;
      case 'Learning 관리':
        //window.location.href = `${baseUrl}cineroom/${this.props.match.params.cineroomId}/${learningManagementUrl}/cubes/cube-list`;
        history.push(`/cineroom/${this.props.match.params.cineroomId}/${learningManagementUrl}/cubes/cube-list`);
        break;
      case 'Community 관리':
        history.push(
          `/cineroom/${this.props.match.params.cineroomId}/${communityManagementUrl}/community/community-list`
        );
        break;
      // case '콘텐츠 관리':
      // window.location.href = `${baseUrl}${contentsManagementUrl}/cubes/`;
      // break;
      case '서비스 관리':
        //window.location.href = `${baseUrl}cineroom/${this.props.match.params.cineroomId}/${serviceManagementUrl}/boards/notice-list`;

        if (roles.includes('CompanyManager')) {
          history.push(`/cineroom/${this.props.match.params.cineroomId}/${serviceManagementUrl}/supports/qna-list`);
        } else {
          history.push(`/cineroom/${this.props.match.params.cineroomId}/${serviceManagementUrl}/boards/notice-list`);
        }
        break;
      // case '시스템 관리':
      // window.location.href = `${baseUrl}${systemManagementUrl}/cubes/`;
      // break;
      case '전시 관리':
        //alert('준비중');
        //window.location.href = `${baseUrl}cineroom/${this.props.match.params.cineroomId}/${displayManagementUrl}/display/arrange-list`;
        history.push(
          `/cineroom/${this.props.match.params.cineroomId}/${displayManagementUrl}/cardBundle/cardBundle-list`
        );
        break;
      case 'Certification 관리':
        //window.location.href = `${baseUrl}cineroom/${this.props.match.params.cineroomId}/${certificationManagementUrl}/badges/badge-list`;
        history.push(`/cineroom/${this.props.match.params.cineroomId}/${certificationManagementUrl}/badges/badge-list`);
        break;
      // case '통계':
      //   history.push(
      //     `/cineroom/${this.props.match.params.cineroomId}/${userManagementUrl}/learning-statistics/membership`
      //   );
      //   break;
    }
  }

  render() {
    // const { activeItem } = this.state;
    const { headerActiveItem } = this.injected.sharedService;
    const roles = patronInfo.getPatronRoles(patronInfo.getCineroomId());
    return (
      <Menu pointing secondary>
        {/*{roles.includes('CollegeManager') ? (*/}
        <Menu.Item name="회원 관리" active={headerActiveItem === '회원 관리'} onClick={this.handleItemClick} />
        {/*) : null}*/}
        <Menu.Item name="Learning 관리" active={headerActiveItem === 'Learning 관리'} onClick={this.handleItemClick} />

        {/* 20022-02 김민준 권한 변경  */}
        <MenuAuthority permissionAuth={{ isSuperManager: true, isCollegeManager: true, isCompanyManager: true }}>
          {/* {roles.includes('CollegeManager') || isSuperManager() ? ( */}
          <Menu.Item
            name="Community 관리"
            active={headerActiveItem === 'Community 관리'}
            onClick={this.handleItemClick}
          />
          {/* ) : null} */}
        </MenuAuthority>

        {/*<Menu.Item*/}
        {/*  name="콘텐츠 관리"*/}
        {/*  active={activeItem === '콘텐츠 관리'}*/}
        {/*  onClick={this.handleItemClick}*/}
        {/*/>*/}

        {/* 20022-02 김민준 권한 변경  */}
        <MenuAuthority permissionAuth={{ isSuperManager: true, isCollegeManager: true, isCompanyManager: true }}>
          {/* {roles.includes('CompanyManager') || roles.includes('CollegeManager') || isSuperManager() ? ( */}
          <Menu.Item name="서비스 관리" active={headerActiveItem === '서비스 관리'} onClick={this.handleItemClick} />
          {/* ) : null} */}
        </MenuAuthority>
        <MenuAuthority permissionAuth={{ isSuperManager: true, isCollegeManager: true, isCompanyManager: true }}>
          <Menu.Item name="전시 관리" active={headerActiveItem === '전시 관리'} onClick={this.handleItemClick} />
        </MenuAuthority>
        {/*{roles.includes('CollegeManager') ? (*/}
        <Menu.Item
          name="Certification 관리"
          active={headerActiveItem === 'Certification 관리'}
          onClick={this.handleItemClick}
        />
        {/*<Menu.Item name="통계" active={headerActiveItem === '통계'} onClick={this.handleItemClick} />*/}
        {/*) : null}*/}
        {/*<Menu.Item*/}
        {/*  name="시스템 관리"*/}
        {/*  active={activeItem === '시스템 관리'}*/}
        {/*  onClick={this.handleItemClick}*/}
        {/*/>*/}
      </Menu>
    );
  }
}
export default withRouter(MenuSection);
