import { observer } from 'mobx-react';
import { Button, Modal, PaginationProps } from 'semantic-ui-react';
import React, { useCallback, useEffect } from 'react';
import CourseraCourseListModalStore from './CourseraCourseListModal.store';
import { CourseListTable } from '../../components/CourseListTable';
import { useFindContentProviderContents } from '../../CoursePage.hooks';
import { MediaService } from '../../../media';
import { getCourseraUrlParamsConverter } from './CourseraCourseModalUtil';
import { Pagination } from '../../../../shared/ui';
import { CourseraSearchBox } from '../components/CourseraSearchBox';

interface Props {
  modalTitle: string;
  contentProviderId: string;
}

export const CourseraCourseListModal = observer((props: Props) => {
  //
  const { modalTitle, contentProviderId } = props;
  const { isOpen, title, offset, params, selectedContentId } = CourseraCourseListModalStore.instance;
  const { setIsOpenCourseraCourseListModal, setTitle, setOffset, setParams, setSelectedContentId } =
    CourseraCourseListModalStore.instance;
  const { changeMediaProps } = MediaService.instance;
  const { data, isLoading } = useFindContentProviderContents(params);

  const totalPages = () => {
    if (data === undefined) {
      return 0;
    }

    return Math.ceil(data.totalCount / 10);
  };

  useEffect(() => {
    //
    setParams(contentProviderId);
  }, [contentProviderId]);

  const onChangeTitle = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  }, []);

  const onClickSearch = useCallback(() => {
    setParams(contentProviderId);
  }, [setParams, contentProviderId]);

  const onChangeOffset = (_: React.MouseEvent, data: PaginationProps) => {
    setOffset(data.activePage as number);
    setParams(contentProviderId);
  };

  const onClickRadio = (contentId: string) => {
    //
    setSelectedContentId(contentId);
  };

  const onClose = () => {
    setIsOpenCourseraCourseListModal(false);
  };

  const onClickOk = () => {
    //
    const selectedContent = data?.results.find((content) => content.id === selectedContentId);

    if (selectedContent) {
      const url = getCourseraUrlParamsConverter(selectedContent.linkMediaUrl);
      changeMediaProps('mediaContents.contentProviderContentId', selectedContentId);
      changeMediaProps('mediaContents.contentsProvider.url', url);
    }
    setIsOpenCourseraCourseListModal(false);
  };

  return (
    <Modal size="large" open={isOpen} className="base w1000 inner-scroll" onClose={onClose}>
      <Modal.Header>{modalTitle}</Modal.Header>
      <Modal.Content>
        <CourseraSearchBox title={title} onChangeTitle={onChangeTitle} onClickSearch={onClickSearch} />
        <div className="scrolling-80vh">
          <div className="content-wrap1">
            <CourseListTable
              contentProviderContents={(data && data.results) || []}
              selectedContentId={selectedContentId}
              onClickRadio={onClickRadio}
            />
          </div>
        </div>
        <Pagination offset={offset} totalPages={totalPages()} onPageChange={onChangeOffset} />
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={onClose}>취소</Button>
        <Button onClick={onClickOk}>확인</Button>
      </Modal.Actions>
    </Modal>
  );
});
