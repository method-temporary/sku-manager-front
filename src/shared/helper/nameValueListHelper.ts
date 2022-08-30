import { NameValueList } from '@nara.platform/accent/src/share/domain/NameValueList';
import { NameValue } from '@nara.platform/accent/src/share/domain/NameValue';

export function getNameValueListFromMap(map: Map<string, string>): NameValueList {
  const nameValues: NameValue[] = [];

  map.forEach((value, key) => {
    nameValues.push({ name: key, value });
  });

  return { nameValues };
}
