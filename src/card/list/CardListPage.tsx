import * as React from 'react';
import { observer } from 'mobx-react';
import { Container, PaginationProps } from 'semantic-ui-react';

import { Pagination } from 'shared/ui';
import { PolyglotExcelUploadFailedListModal, PolyglotExcelUploadModal } from 'shared/components/Polyglot';
import { DimmerLoader, PageTitle } from 'shared/components';

import CardListStore from './CardList.store';
import { useFindCardRdo, useModifyPolyglotsForAdmin } from './CardList.hook';
import { uploadCardBulkFile } from './CardList.event';

import { cardBreadcrumb } from '../shared/utiles';
import CardSearchBox from './components/CardSearchBox';
import CardSubActions from './components/CardSubActions';
import CardList from './components/CardList';
import TempSearchBoxService from '../../shared/components/TempSearchBox/logic/TempSearchBoxService';

const CardListPage = observer(() => {
  //
  const {
    cardRdo,
    offset,
    limit,
    excelReadModalWin,
    invalidModalWin,
    fileName,
    failedIds,
    cardPolyglotUdos,
    loadingText,
    setOffset,
    setCardRdo,
    setIsLoading,
    setExcelReadModalWin,
    setInvalidModalWin,
    setFileName,
    setLoadingText,
    setCardRdoForPage,
  } = CardListStore.instance;

  const mutation = useModifyPolyglotsForAdmin();

  const { data, isLoading: findCardLoading, refetch } = useFindCardRdo(cardRdo);

  const totalPages = () => {
    if (data === undefined) {
      return 0;
    }

    return Math.ceil(data.totalCount / limit);
  };

  const onPageChange = (_: React.MouseEvent, data: PaginationProps) => {
    //
    const { isSearch } = TempSearchBoxService.instance;
    const offset = data.activePage as number;
    setOffset(offset);
    setCardRdoForPage(isSearch);
  };

  const onChangeOpen = () => {
    //
    setExcelReadModalWin(!excelReadModalWin);
  };

  const onUploadFile = (file: File) => {
    //
    setFileName(file.name);
    uploadCardBulkFile(file);
  };

  const onReadExcel = async () => {
    //
    setIsLoading(true);
    setExcelReadModalWin(false);

    /* eslint-disable no-await-in-loop */
    for (const udo of cardPolyglotUdos) {
      //
      try {
        await mutation.mutateAsync(udo);
      } catch (error) {
        //
      }
    }

    setLoadingText('Loading...');
    setInvalidModalWin(true);
    setFileName('');
    setIsLoading(false);
  };

  const onInvalidModalClose = () => {
    //
    setInvalidModalWin(false);
    setCardRdo();
  };

  const onSearch = () => {
    //
    setOffset(1);
    setCardRdo();
    refetch();
  };

  return (
    <Container>
      <PageTitle breadcrumb={cardBreadcrumb} />
      <CardSearchBox onSearch={onSearch} />
      <CardSubActions onChangeOpen={onChangeOpen} setIsLoading={setIsLoading} />

      <DimmerLoader active={findCardLoading} loadingContents={loadingText}>
        <CardList cards={data?.results || []} startNo={(data?.totalCount || 0) - (offset - 1) * limit} />
      </DimmerLoader>
      <Pagination offset={offset} totalPages={totalPages()} onPageChange={onPageChange} />
      <PolyglotExcelUploadModal
        open={excelReadModalWin}
        onChangeOpen={onChangeOpen}
        fileName={fileName}
        uploadFile={onUploadFile}
        onReadExcel={onReadExcel}
        resourceFileName="Card_Polyglot_Templete.xlsx"
      />
      <PolyglotExcelUploadFailedListModal
        open={invalidModalWin}
        failedList={failedIds}
        onClosed={onInvalidModalClose}
      />
    </Container>
  );
});

export default CardListPage;
