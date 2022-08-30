import { MediaType } from '_data/cube/model/material';

export interface CubePanoptoModel {
  cubeId: string;
  mediaType: MediaType;
  panoptoSessionId: string;
}
