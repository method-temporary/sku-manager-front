import { autorun } from 'mobx';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import CommunityStore from '../mobx/CommunityStore';
import { CommunityCourseMappingViewModel } from '../viewModel/CommunityCourseMappingViewModel';

interface Params {
  communityId: string;
}

type Value = CommunityCourseMappingViewModel[];

export function useCommunityCourseMappingViewModel(): [Value, string] {
  const { communityId } = useParams<Params>();
  const [value, setValue] = useState<Value>([]);

  useEffect(() => {
    return autorun(() => {
      setValue([...CommunityStore.instance.communityCourseMappingViewModel]);
    });
  }, []);

  useEffect(() => {
    CommunityStore.instance.requestCommunityCourseMappingViewModel(communityId);
  }, [communityId]);

  return [value, communityId];
}
