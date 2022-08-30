import { useEffect } from 'react';
import { CardService } from 'card';
import { requestLectureTestList } from 'exam/service/requestLectureTestList';

export function useRequestCardTestList() {
  const { cardContentsQuery } = CardService.instance;

  useEffect(() => {
    if (cardContentsQuery === undefined) {
      return;
    }

    const paperIds = cardContentsQuery.tests.map((t) => t.paperId);
    if (paperIds.length > 0) {
      requestLectureTestList(paperIds);
    }
  }, [cardContentsQuery]);
}
