import { NaOffsetElementList } from 'shared/model';
import {
  findAllCapability,
  findCapability,
  findAllCapabilityExcel,
  existsCapability,
  findCapabilityNames,
  findCapabilityGroups,
  findCapabilityModal,
  findAllSkill,
} from '../api/capabilityApi';
import { setList } from '../store/CapabilityListStore';

import { getSearchBox } from '../store/SearchBoxStore';
import { getEmptySearchBox } from '../model/SearchBox';
import CapabilityCdo from '../model/CapabilityCdo';
import CapabilityGroup from '../model/CapabilityGroup';
import Skill from '../model/Skill';
import { setCapability } from '../store/CapabilityStore';
import { setCapabilityGroup } from '../store/CapabilityGroupStore';

export function requestFindAllCapability() {
  findAllCapability(getSearchBox() || getEmptySearchBox()).then((capabilities) => setList({ ...capabilities }));
}

export function requestfindCapabilityGroups(capabilityGroupId?: string) {
  if (capabilityGroupId === undefined) {
    capabilityGroupId = '';
  }

  return findCapabilityGroups(capabilityGroupId);
}

export function requestFindAllCapabilityModal() {
  // return findAllCapability(searchBox);
  //TODO : 데이터 조회 API 분리
  // return findCapabilityModal(capabilityGroupId);

  findCapabilityModal(getSearchBox() || getEmptySearchBox()).then((capabilities) => setCapability(capabilities));
}

export function requestFindSkills() {
  return findAllSkill(getSearchBox() || getEmptySearchBox());
}

export function requestFindCapability(skillId: string) {
  return findCapability(skillId);
}

export function requestFindCapabilityNames(capabilityName: string) {
  return findCapabilityNames(capabilityName);
}

export function requestExistsCapability(capabilityCdo: CapabilityCdo) {
  return existsCapability(capabilityCdo);
}

// export function requestExistsCapability(skillCdo: SkillCdo) {
//   return existsCapability(skillCdo);
// }

export function requestFindAllCapabilityExcel(): Promise<NaOffsetElementList<Skill>> {
  return findAllCapabilityExcel(getSearchBox() || getEmptySearchBox());
}

export function selectField(search?: boolean): any {
  const fieldSelect: any = [];
  if (search) {
    fieldSelect.push({ key: 'All', text: '전체', value: '전체' });
  }
  requestfindCapabilityGroups().then((capabilityGroups: CapabilityGroup[]) => {
    setCapabilityGroup(capabilityGroups);

    capabilityGroups.map((capabilityGroup, index) => {
      fieldSelect.push({
        key: index + 1,
        text: capabilityGroup.name,
        value: capabilityGroup.id,
      });
    });
  });
  return fieldSelect;
}
