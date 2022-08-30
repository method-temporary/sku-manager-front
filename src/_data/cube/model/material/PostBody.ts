import { PatronKey } from '@nara.platform/accent';

export interface PostBody {
  contents: string;
  fileBoxId: string;
  id: string;
  patronKey: PatronKey;
}
