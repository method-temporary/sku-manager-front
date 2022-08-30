import { patronInfo } from '@nara.platform/dock';
import { find } from 'lodash';

let maybeSuperManager: boolean;

export function isSuperManager() {
  if (maybeSuperManager !== undefined) {
    return maybeSuperManager;
  }
  const cinerooms = patronInfo.getCinerooms();
  const mySUNICineroom = 'ne1-m2-c2';

  if (Array.isArray(cinerooms) && cinerooms.length > 0) {
    const findCineRoom = find(cinerooms, { id: mySUNICineroom });
    if (findCineRoom !== undefined) {
      maybeSuperManager = findCineRoom.roles.includes('SuperManager');
      return maybeSuperManager;
    }
  }
  return false;
}
