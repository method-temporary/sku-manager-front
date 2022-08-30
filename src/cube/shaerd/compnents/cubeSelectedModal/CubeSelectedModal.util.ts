import { SelectTypeModel } from '../../../../shared/model';
import { ContentsProviderService } from '../../../../college';
import { getPolyglotToAnyString } from '../../../../shared/components/Polyglot';
import { CardWithAccessRuleResult } from '../../../../_data/lecture/cards/model/CardWithAccessRuleResult';
import CardSelectModalStore from '../../../../card/shared/components/cardSelectModal/CardSelectModal.store';
import { CubeWithReactiveModel } from '../../../cube';
import CubeSelectedModalStore from './CubeSelectedModal.store';

export const getContentsProviderOptions = () => {
  //
  const selectContentsProviderType: SelectTypeModel[] = [];
  const { contentsProviders } = ContentsProviderService.instance;
  selectContentsProviderType.push({
    key: '0',
    text: '전체',
    value: '',
  });
  contentsProviders.forEach((contentsProvider, index) => {
    selectContentsProviderType.push({
      key: contentsProvider.id,
      text: getPolyglotToAnyString(contentsProvider.name),
      value: contentsProvider.id,
    });
  });

  return selectContentsProviderType;
};

/**
 * 선택된 Cube 인지 여부 판단
 * @param cubeId
 * @return boolean
 */
export const isChecked = (cubeId: string): boolean => {
  //
  const { selectedCubes } = CubeSelectedModalStore.instance;

  const selectedCube = selectedCubes.find((selectedCube) => selectedCube.cubeId === cubeId);

  return !!selectedCube;
};

/**
 * Cube 선택, 선택 해제 Event 함수
 * @param selectedCube
 * @param checked
 */
export const onSelectedCube = (selectedCube: CubeWithReactiveModel, checked: boolean) => {
  //
  const { selectedCubes, setSelectedCubes } = CubeSelectedModalStore.instance;

  let next: CubeWithReactiveModel[] = [...selectedCubes];

  if (checked) {
    // 현재 선택된 리스트에서 Cube 추가
    next.push(selectedCube);
  } else {
    // 현재 리스트에서 선택한 Cube 만 삭제
    next = next
      .filter((cubeWithReactiveModel) => cubeWithReactiveModel.cubeId !== selectedCube.cubeId)
      .map((cardWithAccessRuleResult) => cardWithAccessRuleResult);
  }

  setSelectedCubes(next);
};
