import { LabelContent } from "./LabelContent";

export interface Label {
  content: LabelContent,
  i18nResourcePathId: string,
  id: string,
  memo: string,
  name: string,
}