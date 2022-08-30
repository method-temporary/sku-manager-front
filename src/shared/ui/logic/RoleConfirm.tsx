import { patronInfo } from '@nara.platform/dock';
import { isSuperManager } from './isSuperManager';

const RoleConfirm = {
  getRoleByCurrentCineroom() {
    const cinerooms = patronInfo.getCinerooms();
    const cineroomId = patronInfo.getCineroomId();
    let role = '';
    if (Array.isArray(cinerooms) && cinerooms.length > 0) {
      cinerooms?.forEach((cineroomWorkspace) => {
        if (cineroomWorkspace.id === cineroomId) role = cineroomWorkspace.roles[1];
      });
    }
    if (role === 'CompanyManager') return 'CompanyManager';
    if (role === 'CollegeManager') return 'CollegeManager';
    if (role === 'SuperManager') return 'SuperManager';
    return 'User';
  },

  roleCheckInAllCineroom() {
    if (isSuperManager()) {
      return true;
    }

    const cinerooms = patronInfo.getCinerooms();
    if (Array.isArray(cinerooms) && cinerooms.length > 0) {
      const roles = cinerooms
        .map((cineroom) => cineroom.roles)
        // .filter((roles) => roles.length > 1)
        .reduce((prev, curr) => prev.concat(curr));
      if (roles.includes('CompanyManager') || roles.includes('CollegeManager') || roles.includes('Translator')) {
        return true;
      }
      return false;
    }
    return false;
  },
};
export default RoleConfirm;
