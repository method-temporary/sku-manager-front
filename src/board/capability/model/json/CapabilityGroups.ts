import Capabilities from './Capabilities';
import Skill from '../Skill';

export default interface capabilityGroups {
  id: string;
  name: string;
  capabilities: Capabilities[];
}
