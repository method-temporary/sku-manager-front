import Capability from './Capability';
import moment from 'moment';
import CapabilityGroups from './json/CapabilityGroups';
import CapabilityGroup from './CapabilityGroup';
import Skills from './json/Skills';
import Capabilities from './json/Capabilities';

export default interface Skill {
  id: string;
  name: string;
  capability: Capability;
  synonymTag: string;
  creatorName: string;
  modifierName: string;
  createdTime: number;
  modifiedTime: number;
}

export interface SkillExcel {
  No: string;
  역량군: string;
  역량명: string;
  skill: string;
  유사어: string;
  등록일: string;
  생성자: string;
  수정일: string;
  수정자: string;
}

function timeToDateString(time: number) {
  return moment(time).format('YYYY.MM.DD');
}

export function convertToExcel(skill: Skill[]): SkillExcel[] {
  let no = 1;
  return skill.map(({ id, name, capability, synonymTag, creatorName, modifierName, createdTime, modifiedTime }) => {
    return {
      No: `${no++}`,
      역량군: capability.capabilityGroup.name,
      역량명: capability.name,
      skill: name,
      유사어: synonymTag,
      등록일: timeToDateString(createdTime),
      생성자: creatorName,
      수정일: modifiedTime ? timeToDateString(modifiedTime) : '',
      수정자: modifierName && modifierName,
    };
  });
}

export function convertToSkillList(capabilityGroups: CapabilityGroups[]): Skill[] {
  const skills: Skill[] = [];
  let skill: Skill;
  capabilityGroups.forEach((capabilityGroups) => {
    skill.capability.capabilityGroup.id = capabilityGroups.id;
    skill.capability.capabilityGroup.name = capabilityGroups.name;
    capabilityGroups.capabilities.forEach((cp) => {
      skill.capability.id = cp.id;
      skill.capability.name = cp.name;
      cp.skills.forEach((s) => {
        skill.id = s.id;
        skill.name = s.name;
        skill.synonymTag = s.synonymTag;
      });
    });
    skills.push(skill);
  });

  return skills;
}

export function convertToSkill(capabilityGroups: CapabilityGroups, capabilities: Capabilities, skill: Skills): Skill {
  // const capability: Capability;
  // const capabilityGroup: CapabilityGroup;

  const capabilityGroup = {
    id: capabilityGroups.id,
    name: capabilityGroups.name,
  };

  const capability = {
    id: capabilities.id,
    name: capabilities.name,
    capabilityGroup,
  };

  return {
    id: skill.id,
    name: skill.name,
    capability,
    synonymTag: skill.synonymTag,
    creatorName: '',
    modifierName: '',
    createdTime: 0,
    modifiedTime: 0,
  };
}
