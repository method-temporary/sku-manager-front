import { NameValueList } from '@nara.platform/accent';

export default interface MenuTransaction {
  appendIds: string[];
  modifieds: Map<string, NameValueList>;
  removeds: string[];
}

export function getEmptyMenuTransaction(): MenuTransaction {
  return {
    appendIds: [],
    modifieds: new Map(),
    removeds: []
  }
}