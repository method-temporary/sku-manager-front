import { NameValueList } from '../../../shared/model';

export const getRejectedParams = (cardId: string, remark: string) => {
  //
  const nameValues = new NameValueList();

  nameValues.nameValues.push({ name: 'remark', value: remark });

  return {
    cardId,
    nameValues,
  };
};
