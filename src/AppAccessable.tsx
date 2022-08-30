import React from 'react';
import { RoleConfirm } from 'shared/ui';
import { isLogined } from 'lib/common';

export function AppAccessable() {
  if (process.env.NODE_ENV !== 'development') {
    if (!isLogined()) {
      window.location.href = '/login';
    }
    if (!RoleConfirm.roleCheckInAllCineroom()) {
      window.location.href = '/suni-main';
    }
  }
  return null;
}
