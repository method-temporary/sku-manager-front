export interface LabelTree {
  key: string;
  label: string;
  name: string; // tree 메뉴에 보이는 이름
  memo: string;
  nodes: LabelNode[];
  isOpen: boolean;
}

export interface LabelNode {
  key: string;
  label: string;
  name: string; // tree 메뉴에 보이는 이름
  content: {
    en: string;
    ko: string;
    zh: string;
  };
  memo: string;
  i18nResourcePathId: string;
}
