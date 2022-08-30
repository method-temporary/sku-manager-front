import { find } from 'lodash';
import React from 'react';

import { patronInfo } from '@nara.platform/dock';

import MenuAuthorityModel from './MenuAuthorityModel';

interface MenuAuthorityProps {
  permissionAuth: MenuAuthorityModel;
  children?: React.ReactNode;
}

export function MenuAuthority({ permissionAuth, children }: MenuAuthorityProps) {
  //
  // 메뉴는 모두 OR 을 기준으로 합니다.

  const isSuperManager = () => {
    //
    const cinerooms = patronInfo.getCinerooms();
    const mySUNICineroom = 'ne1-m2-c2';
    let result = false;

    if (Array.isArray(cinerooms) && cinerooms.length > 0) {
      const findCineRoom = find(cinerooms, { id: mySUNICineroom });
      if (findCineRoom !== undefined) {
        result = findCineRoom.roles.includes('SuperManager');
      }
    }
    return result;
  };

  const isCompanyManager = () => {
    //
    const roles = patronInfo.getPatronRoles(patronInfo.getCineroomId());

    return roles.includes('CompanyManager');
  };

  const isCollegeManager = () => {
    //
    const roles = patronInfo.getPatronRoles(patronInfo.getCineroomId());

    return roles.includes('CollegeManager');
  };

  const hasEtcAuth = (authName: string) => {
    //
    const roles = patronInfo.getPatronRoles(patronInfo.getCineroomId());

    return roles.includes(authName);
  };

  const permisionCheck = () => {
    //
    let result = false;

    let checkTarget = permissionAuth.isSuperManager;
    result = (checkTarget !== undefined && checkTarget && isSuperManager()) || result;

    checkTarget = permissionAuth.isCompanyManager;
    result = (checkTarget !== undefined && checkTarget && isCompanyManager()) || result;

    checkTarget = permissionAuth.isCollegeManager;
    result = (checkTarget !== undefined && checkTarget && isCollegeManager()) || result;
    permissionAuth.etcAuth &&
      permissionAuth.etcAuth.length > 0 &&
      permissionAuth.etcAuth.map((etcAuth) => {
        result = (etcAuth.value && hasEtcAuth(etcAuth.authName) && true) || result;
      });

    return result;
  };

  return <>{permisionCheck() ? children : null}</>;
}
