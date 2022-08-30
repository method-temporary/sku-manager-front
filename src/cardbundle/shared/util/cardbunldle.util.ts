import { GroupBasedAccessRule, NameValueList, PolyglotModel, PatronKey } from 'shared/model';
import { DEFAULT_LANGUAGE, LangSupport, langSupportCdo } from 'shared/components/Polyglot';
import { EnumUtil } from 'shared/ui';
import { CardBundleModel, CardBundleCdo } from '_data/arrange/cardBundles/model';
import { CardBundleType } from '_data/arrange/cardBundles/model/vo';
import { CardBundleFormModel } from '../../present/logic/CardBundleFormModel';

export const getInitCardBundleFormModel = (): CardBundleFormModel => ({
  cardIds: [],
  description: new PolyglotModel(),
  displayOrder: 0,
  displayText: new PolyglotModel(),
  enabled: true,
  groupBasedAccessRule: new GroupBasedAccessRule(),
  imageUrl: new PolyglotModel(),
  langSupports: [DEFAULT_LANGUAGE],
  learningTime: 0,
  likeFeedbackId: '',
  modifiedTime: 0,
  modifierName: new PolyglotModel(),
  name: new PolyglotModel(),
  type: CardBundleType.Normal,
  id: '',
  checked: false,
  patronKey: new PatronKey(),
});

export const fromCardBundleFormModel = (cardBundle: CardBundleModel): CardBundleFormModel => {
  //
  const cardBundleForm = getInitCardBundleFormModel();
  const type = EnumUtil.getEnumValue(CardBundleType, cardBundle.type).get(cardBundle.type);
  const name = new PolyglotModel(cardBundle.name);
  const displayText = new PolyglotModel(cardBundle.displayText);
  const modifierName = new PolyglotModel(cardBundle.modifierName);
  const langSupports = cardBundle.langSupports && cardBundle.langSupports.map((target) => new LangSupport(target));
  const imageUrl = type === CardBundleType.HotTopic ? new PolyglotModel(cardBundle.imageUrl) : new PolyglotModel();
  const description = new PolyglotModel(cardBundle.description);
  const displayOrder = type === CardBundleType.HotTopic ? cardBundle.displayOrder : 0;

  return {
    ...cardBundleForm,
    ...cardBundle,
    name,
    displayText,
    modifierName,
    langSupports,
    imageUrl,
    description,
    displayOrder,
  };
};

export const getCardBundleCdo = (cardBundleForm: CardBundleFormModel): CardBundleCdo => ({
  name: cardBundleForm.name,
  displayText: cardBundleForm.displayText,
  enabled: cardBundleForm.enabled,
  imageUrl: cardBundleForm.imageUrl,
  description: cardBundleForm.description,
  type: cardBundleForm.type,
  displayOrder: cardBundleForm.displayOrder,

  cardIds: cardBundleForm.cardIds,
  learningTime: cardBundleForm.learningTime,
  groupBasedAccessRule: cardBundleForm.groupBasedAccessRule,
  langSupports: langSupportCdo(cardBundleForm.langSupports),
});

export const getCardBundleNameValueList = (cardBundle: CardBundleModel): NameValueList => {
  //
  const nameValues = [
    {
      name: 'name',
      value: JSON.stringify(cardBundle.name),
    },
    {
      name: 'displayText',
      value: JSON.stringify(cardBundle.displayText),
    },
    {
      name: 'enabled',
      value: JSON.stringify(cardBundle.enabled),
    },
    {
      name: 'imageUrl',
      value: cardBundle.type === CardBundleType.HotTopic ? JSON.stringify(cardBundle.imageUrl) : '',
    },
    {
      name: 'description',
      value: JSON.stringify(cardBundle.description),
    },
    {
      name: 'type',
      value: cardBundle.type,
    },
    {
      name: 'cardIds',
      value: JSON.stringify(cardBundle.cardIds),
    },
    {
      name: 'groupBasedAccessRule',
      value: JSON.stringify(cardBundle.groupBasedAccessRule),
    },
    {
      name: 'learningTime',
      value: cardBundle.learningTime.toString(),
    },
  ];
  if (cardBundle.type === CardBundleType.HotTopic) {
    nameValues.push({ name: 'displayOrder', value: cardBundle.displayOrder.toString() });
  }

  return { nameValues };
};
