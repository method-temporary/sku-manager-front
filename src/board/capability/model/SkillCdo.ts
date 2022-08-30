import Capability from './Capability';

export default interface SkillCdo {
  id: string;
  name: string;
  capability: Capability;
  synonymTag: string;
  creatorName: string;
  modifierName: string;
}
