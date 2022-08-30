import { useState, useCallback, useEffect } from 'react';
import { autorun } from 'mobx';
import { Moment } from 'moment';

import { NaOffsetElementList } from 'shared/model';
import { SharedService } from 'shared/present';
import { responseToNaOffsetElementList } from 'shared/helper';

import Field from '../../field/model/Field';
import Board from '../model/Board';
import BoardStore from '../mobx/BoardStore';
import { BoardQueryModel } from '../model/BoardQueryModel';
import { findCommunities, findAllBoardByQuery } from '../api/BoardApi';

export default interface BoardTemp {
  id?: number;
}

export function useBoardList(): [
  NaOffsetElementList<Board>,
  (offset: number) => void,
  number,
  (next: number) => void,
  (name: string, value: string | number | Moment | undefined) => void,
  () => void,
  BoardQueryModel,
  () => void,
  (selectFields: Field[]) => any,
  SharedService
] {
  const boardStore = BoardStore.instance;
  const sharedService = SharedService.instance;

  const [valule, setValue] = useState<NaOffsetElementList<Board>>(boardStore.boardList);
  const [limit, setLimit] = useState<number>(20);

  const [query, setQuery] = useState<BoardQueryModel>(boardStore.selectedBoardQuery);

  useEffect(() => {
    searchQuery();
    return autorun(() => {
      setValue({ ...boardStore.boardList });
      setQuery({ ...boardStore.selectedBoardQuery });
    });
  }, [boardStore]);

  const requestBoardList = useCallback((page: number = 0) => {
    findCommunities(limit, page).then((response) => {
      const next = responseToNaOffsetElementList<Board>(response);
      boardStore.setBoardList(next);
    });
  }, []);

  const clearBoardQuery = useCallback(() => {
    boardStore.clearBoardQuery();
  }, []);

  const requestFindAllBoardByQuery = useCallback((boardQueryModel: BoardQueryModel) => {
    if (sharedService) {
      if (boardQueryModel.page) {
        changeBoardQueryProps('offset', (boardQueryModel.page - 1) * boardQueryModel.limit);
        changeBoardQueryProps('pageIndex', (boardQueryModel.page - 1) * boardQueryModel.limit);
        sharedService.setPage('board', boardQueryModel.page);
      } else {
        sharedService.setPageMap('board', 0, boardQueryModel.limit);
      }
    }

    findAllBoardByQuery(BoardQueryModel.asBoardRdo(boardQueryModel)).then((response) => {
      const next = responseToNaOffsetElementList<Board>(response);
      //sharedService.setState({ pageIndex: (page - 1) * 20 });
      next.limit = boardQueryModel.limit;
      next.offset = boardQueryModel.offset;
      sharedService.setCount('board', next.totalCount);
      boardStore.setBoardList(next);
    });
  }, []);

  const selectField = useCallback((selectFields: Field[]) => {
    const fieldSelect: any = [];
    if (selectFields) {
      fieldSelect.push({ key: 'All', text: '전체', value: '전체' });
      selectFields.map((field, index) => {
        fieldSelect.push({
          key: index + 1,
          text: field.title,
          value: field.id,
        });
      });
    }

    return fieldSelect;
  }, []);

  // todo Excel BackEnd 개발 후 진행

  // const findAllCoursePlanExcel() {
  //   //
  //   const coursePlans = await this.coursePlanApi.findAllCoursePlanExcel(
  //     CoursePlanQueryModel.asCoursePlanRdo(this.coursePlanQuery)
  //   );
  //   runInAction(() => (this.coursePlanForExcel = coursePlans));
  //   return coursePlans;
  // }

  // const onFindAllCoursePlanExcel = useCallback(() => {
  //   const { coursePlanService } = this.props;
  //   coursePlanService!
  //     .findAllCoursePlanExcel()
  //     .then((board: CoursePlanModel[]) => {
  //       const courseXlxsList: CoursePlanXlsxModel[] = [];
  //       board.map((courses, index) => {
  //         courseXlxsList.push(CoursePlanModel.asXLSX(courses, index));
  //       });
  //       const courseExcel = XLSX.utils.json_to_sheet(courseXlxsList);
  //       const temp = XLSX.utils.book_new();

  //       XLSX.utils.book_append_sheet(temp, courseExcel, 'Course');

  //       XLSX.writeFile(temp, 'courses.xlsx');
  //     });
  // }, []);

  const changeBoardQueryProps = useCallback((name: string, value: string | Moment | number | undefined) => {
    if (value === '전체') value = '';

    boardStore.setBoardQuery(boardStore.selectedBoardQuery, name, value);
  }, []);

  const changeLimit = useCallback((next: number) => {
    setLimit(next);
    requestBoardList();
  }, []);

  const searchQuery = useCallback(() => {
    requestFindAllBoardByQuery(boardStore.selectedBoardQuery);
  }, []);

  return [
    valule,
    requestBoardList,
    limit,
    changeLimit,
    changeBoardQueryProps,
    searchQuery,
    query,
    clearBoardQuery,
    selectField,
    sharedService,
  ];
}
