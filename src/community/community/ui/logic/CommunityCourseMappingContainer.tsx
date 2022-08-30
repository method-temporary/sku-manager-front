import React from 'react';
import { useCommunityCourseMappingViewModel } from 'community/community/service/useCommunityCourseMappingViewModel';
import { CommunityCourseMappingView } from '../view/CommunityCourseMappingView';

export function CommunityCourseMappingContainer() {
  const [
    communityCourseMappingViewModel,
    communityId,
  ] = useCommunityCourseMappingViewModel();
  return (
    <CommunityCourseMappingView
      communityCourseMappingViewModel={communityCourseMappingViewModel}
      communityId={communityId}
    />
  );
}
