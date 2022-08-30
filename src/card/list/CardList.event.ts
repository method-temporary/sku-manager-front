import XLSX from 'xlsx';
import { Language, setLangSupports, setPolyglotValues } from 'shared/components/Polyglot';
import { CardPolyglotUdo, getInitCardPolyglotUdo } from '_data/lecture/cards/model/CardPolyglotUdo';
import CardListStore from './CardList.store';

export const uploadCardBulkFile = (file: File) => {
  //
  const { setCardPolyglotUdos } = CardListStore.instance;
  const fileReader = new FileReader();

  fileReader.onload = (e: any) => {
    let binary = '';
    const data = new Uint8Array(e.target.result);
    const length = data.byteLength;
    for (let i = 0; i < length; i++) {
      binary += String.fromCharCode(data[i]);
    }
    const workbook: any = XLSX.read(binary, { type: 'binary' });
    let cards: any[] = [];

    const udos: CardPolyglotUdo[] = [];
    const jsonArray = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
    if (jsonArray.length === 0) {
      return;
    }
    cards = jsonArray;

    cards &&
      cards.forEach((card) => {
        const udo = getInitCardPolyglotUdo();
        const cardId = card['Card Id'];
        const defaultLanguage = card['기본언어'];
        const cardName = setPolyglotValues(card['Card 명 (국문)'], card['Card 명 (영문)'], card['Card名(中文)']);
        const tags = setPolyglotValues(card['Tag 정보 (국문)'], card['Tag 정보 (영문)'], card['Tag信息(中文)']);
        const simpleDescription = setPolyglotValues(
          card['Card 표시 문구 (국문)'],
          card['Card 표시 문구 (영문)'],
          card['Card显示文字(中文)']
        );
        const description = setPolyglotValues(
          card['Card 소개 (국문)'],
          card['Card 소개 (영문)'],
          card['Card介绍(中文)']
        );
        const reportName = setPolyglotValues(
          card['Report 명 (국문)'],
          card['Report 명 (영문)'],
          card['Report 명 (중문)']
        );
        const reportQuestion = setPolyglotValues(
          card['작성 가이드 (국문)'],
          card['작성 가이드 (영문)'],
          card['작성 가이드 (중문)']
        );

        //tag?
        udo.cardId = cardId;
        udo.name = cardName;
        udo.tags = tags;
        udo.simpleDescription = simpleDescription;

        udo.description = description;
        udo.reportName = reportName;
        udo.reportQuestion = reportQuestion;

        udo.langSupports = setLangSupports(
          cardName.getValue(Language.Ko),
          cardName.getValue(Language.En),
          cardName.getValue(Language.Zh),
          defaultLanguage
        );
        udos.push(udo);
      });
    setCardPolyglotUdos(udos);
  };
  fileReader.readAsArrayBuffer(file);
};
