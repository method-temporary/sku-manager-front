import { useCallback, useEffect, useState } from 'react';
import { autorun } from 'mobx';
import { Moment } from 'moment';
import XLSX from 'xlsx';

import { PageModel, SelectTypeModel, SortFilterState } from 'shared/model';
import { SharedService } from 'shared/present';
import { SearchBoxService } from 'shared/components/SearchBox';
import { getPolyglotToAnyString } from 'shared/components/Polyglot';

import CubeApi from '../../../cube/cube/present/apiclient/CubeApi';
import { CollegeService } from '../../../college';
import { InstructorCube } from '../../../cube/cube/model/sdo/InstructorCube';
import { CubeCountModel } from '../../../personalcube/model/old/CubeCountModel';
import LectureStore from '../mobx/LectureStore';
import { LectureXlsxModel } from '../model/LectureXlsxModel';
import { LectureQueryModel } from '../model/LectureQueryModel';

export default interface LectureTemp {
  id?: number;
}

export function useLectureList(): [
  InstructorCube[],
  (name: string, value: string | number | Moment | undefined) => void,
  () => void,
  LectureQueryModel,
  // () => void,
  SharedService,
  CubeCountModel,
  any,
  () => Promise<string>,
  (id: string) => Promise<void>,
  SelectTypeModel[]
] {
  const lectureStore = LectureStore.instance;
  const sharedService = SharedService.instance;
  const cubeApi = CubeApi.instance;
  const paginationKey = 'instructor-cubes';

  const [value, setValue] = useState<InstructorCube[]>(lectureStore.lectureList);

  const [count, setCount] = useState<CubeCountModel>(lectureStore.selectedCubeCount);

  const [query, setQuery] = useState<LectureQueryModel>(lectureStore.selectedLectureQuery);

  const [searchBoxQueryModel, setSearchBoxQueryModel] = useState(SearchBoxService.instance.searchBoxQueryModel);

  const [channelSelect, setChannelSelect] = useState(CollegeService.instance.channelSelect);

  useEffect(() => {
    return autorun(() => {
      setValue([...lectureStore.lectureList]);
      setQuery({ ...lectureStore.selectedLectureQuery });
      setCount({ ...lectureStore.selectedCubeCount });
      setSearchBoxQueryModel({ ...SearchBoxService.instance.searchBoxQueryModel });
      setChannelSelect([...CollegeService.instance.channelSelect]);
    });
  }, [lectureStore]);

  // const clearLectureQuery = useCallback(() => {
  //   lectureStore.clearLectureQuery();
  // }, []);

  const requestFindAllLectureByQuery = useCallback(async (lectureQueryModel: LectureQueryModel) => {
    //
    const pageModel = sharedService.getPageModel(paginationKey);
    const instructorCubeList = await cubeApi.findInstructorCubesForAdmin(
      LectureQueryModel.asCubeInstructorAdminRdo(lectureQueryModel.instructorId, lectureQueryModel, pageModel)
    );

    sharedService.setCount(paginationKey, instructorCubeList.totalCount);
    lectureStore.setCubeCount(
      new CubeCountModel({
        totalCount: instructorCubeList.totalCount,
        totalLectureTime: instructorCubeList.totalLectureTime,
      })
    );
    lectureStore.setLectureList(instructorCubeList.results);
  }, []);

  const changeLectureQueryProps = useCallback((name: string, value: any) => {
    if (value === '전체') value = '';
    lectureStore.setLectureQuery(lectureStore.selectedLectureQuery, name, value);
  }, []);

  const searchQuery = useCallback(() => {
    requestFindAllLectureByQuery(lectureStore.selectedLectureQuery);
  }, []);

  async function findAllLectureExcel(): Promise<string> {
    //
    const offsetElementList = await cubeApi.findInstructorCubesForAdmin(
      LectureQueryModel.asCubeInstructorAdminRdo(
        query.instructorId,
        query,
        new PageModel(0, 9999, SortFilterState.TimeDesc)
      )
    );

    const lectureXlsxList: LectureXlsxModel[] = [];
    offsetElementList.results.forEach((instructorCube, index) => {
      lectureXlsxList.push(
        InstructorCube.asXLSX(
          instructorCube,
          index,
          findChannelName(instructorCube.collegeId),
          findChannelName(instructorCube.channelId)
        )
      );
    });

    const lectureExcel = XLSX.utils.json_to_sheet(lectureXlsxList);
    const temp = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(temp, lectureExcel, 'Lectures');
    const fileName = `lectures.xlsx`;
    XLSX.writeFile(temp, fileName, { compression: true });
    return fileName;
  }

  // function findCollegeName(collegeId: string): string | undefined {
  //   //
  //   const collegeService = CollegeService.instance;
  //   return collegeService.collegesMap.get(collegeId);
  // }

  function findChannelName(channelId: string): string | undefined {
    //
    const collegeService = CollegeService.instance;
    return collegeService.channelMap.get(channelId);
  }

  async function onChangeCollege(id: string): Promise<void> {
    //
    const { changePropsFn } = SearchBoxService.instance;
    const { findMainCollege } = CollegeService.instance;

    if (id === '') {
      changePropsFn('channelId', '');
    } else {
      await findMainCollege(id);

      const { mainCollege } = CollegeService.instance;
      const select: SelectTypeModel[] = [new SelectTypeModel()];

      mainCollege.channels.map((channel) =>
        select.push(new SelectTypeModel(channel.id, getPolyglotToAnyString(channel.name), channel.id))
      );
      CollegeService.instance.setChannelSelect(select);

      changePropsFn('channelId', '');
    }
  }

  return [
    value,
    changeLectureQueryProps,
    searchQuery,
    query,
    // clearLectureQuery,
    sharedService,
    count,
    searchBoxQueryModel,
    findAllLectureExcel,
    onChangeCollege,
    channelSelect,
  ];
}
