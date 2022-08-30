import { useQuery, useMutation } from 'react-query';
import { queryKeys } from 'query/queryKeys';
import { findCubePanoptoIds } from '_data/cube/panoptoByQdo/api/cubePanoptoApi';
import { findIconGroups, findIcons, thumbnailUpload } from '_data/imagesUpload/api/imagesUploadApi';
import { CardIconType } from '_data/imagesUpload/model/CardIconType';

// 썸네일 Set key 값 부르는 hook
export function useFindIconGroups(iconType: CardIconType) {
  return useQuery(queryKeys.findIconGroups(iconType), () => findIconGroups(iconType));
}

// 썸네일 Set 개별 이미지 목록 부르는 hook
export function useFindIcons(groupId: string) {
  return useQuery(queryKeys.findIcons(groupId), () => findIcons(groupId), {
    enabled: groupId !== '' && groupId !== 'panopto',
  });
}

export function useFindCubePanoptoIdsMutation() {
  return useMutation((cubeIds: string[]) => findCubePanoptoIds(cubeIds));
}

export function useThumbnailUploadMutation() {
  return useMutation((formData: FormData) => thumbnailUpload(formData));
}
