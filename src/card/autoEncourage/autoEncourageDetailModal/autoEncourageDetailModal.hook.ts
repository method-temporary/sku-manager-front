import { useMutation } from 'react-query';
import {
  findFailedSmsRsltRdoByEventIds,
  findSentSmsAndFailedCountByEventIds,
} from '_data/pigeon/sentSms/api/sentSmsApi';
import { findUsersByDenizenIds } from '_data/user/users/api/usersApi';

export function useFindFailedSmsRsltRdoByEventIdsMutate() {
  return useMutation((eventIds: string[]) => {
    return findFailedSmsRsltRdoByEventIds(eventIds);
  });
}

export function useFindSentSmsAndFailedCountByEventIds() {
  return useMutation((eventIds: string[]) => {
    return findSentSmsAndFailedCountByEventIds(eventIds);
  });
}

export function useFindUsersByDenizenIdsMutate() {
  return useMutation((denizenIds: string[]) => findUsersByDenizenIds(denizenIds));
}
