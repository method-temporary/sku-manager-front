import { queryKeys } from 'query/queryKeys';
import { useQuery } from 'react-query';
import { findAutoEncourageById } from '_data/lecture/autoEncourage/api/autoEncourageApi';
import { findEnableRepresentativeNumber } from '_data/support/api/supportApi';
import { findByRepresentativeNumberRdo } from '_data/support/model/FindByRepresentativeNumberRdo';
import { findUser } from '_data/user/users/api/usersApi';

export const useFindUser = () => {
  return useQuery(queryKeys.findUser, findUser);
};

export const initRepresentativeNumberParams = {
  enabled: true,
  limit: 99999,
  name: '',
  offset: 0,
  phone: '',
  registrantName: '',
};

export const useFindEnableRepresentativeNumber = (params: findByRepresentativeNumberRdo) => {
  return useQuery(queryKeys.findEnableRepresentativeNumber(params), () => findEnableRepresentativeNumber(params));
};

export const useFindAutoEncourageById = (id: string) => {
  return useQuery(queryKeys.findAutoEncourageById(id), () => findAutoEncourageById(id), {
    cacheTime: 0,
    enabled: id !== '',
  });
};
