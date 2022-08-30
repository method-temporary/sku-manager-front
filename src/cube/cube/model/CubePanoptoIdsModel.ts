import { MediaType } from 'cubetype';

export interface CubePanoptoModel {
  cubeId: string;
  mediaType: MediaType;
  panoptoSessionId: string;
}
