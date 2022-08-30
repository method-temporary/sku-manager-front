import { useQuery } from 'react-query';

import { findAllColleges, findColleges } from '_data/college/colleges/api';
import { findCollegeForCineroomId } from '_data/college/api/CollegeApi';
import { queryKeys } from '../query/queryKeys';
import { useCallback } from 'react';
import { getPolyglotToAnyString } from 'shared/components/Polyglot';

export const useFindColleges = () => {
  return useQuery(queryKeys.findColleges, findColleges, {
    refetchOnWindowFocus: false,
  });
};

export const useFindCollegesForCineroomId = () => {
  return useQuery(queryKeys.findCollegeForCineroomId, findCollegeForCineroomId, {
    refetchOnWindowFocus: false,
  });
};

export const useFindAllColleges = () => {
  return useQuery(queryKeys.findAllColleges, findAllColleges, {
    refetchOnWindowFocus: false,
  });
};

export const useCollegeUtils = () => {
  const { data: colleges = [] } = useFindAllColleges();

  const getCollege = useCallback(
    (collegeId: string) => {
      return colleges.find((college) => college.id === collegeId);
    },
    [colleges]
  );

  const getCollegeName = useCallback(
    (collegeId: string) => {
      const foundCollege = getCollege(collegeId);
      return foundCollege ? getPolyglotToAnyString(foundCollege.name) : '';
    },
    [colleges, getCollege]
  );

  const getChannel = useCallback(
    (channelId: string) => {
      const channels = colleges.flatMap((college) => college.channels);
      return channels.find((channel) => channel.id === channelId);
    },
    [colleges]
  );

  const getChannelName = useCallback(
    (channelId: string) => {
      const foundChannel = getChannel(channelId);
      return foundChannel ? getPolyglotToAnyString(foundChannel.name) : '';
    },
    [colleges, getChannel]
  );

  return {
    getCollege,
    getCollegeName,
    getChannel,
    getChannelName,
  };
};
