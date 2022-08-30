import { NameValueList } from 'shared/model';
import { PageElementModel } from '_data/arrange/pageElements/model';

export const getPageElementNameValues = (pageElement: PageElementModel): NameValueList => {
  return {
    nameValues: [
      {
        name: 'type',
        value: String(pageElement.type),
      },
      {
        name: 'position',
        value: String(pageElement.position),
      },
      {
        name: 'groupBasedAccessRule',
        value: JSON.stringify(pageElement.groupBasedAccessRule),
      },
    ],
  };
};
