import { observer } from 'mobx-react';
import { Button, Modal, PaginationProps } from 'semantic-ui-react';
import { CourseListTable } from '../../components/CourseListTable';
import React, { useCallback, useEffect } from 'react';
import { useFindContentProviderContents } from '../../CoursePage.hooks';
import LinkedInCourseListModalStore from './LinkedInCourseListModal.store';
import { LinkedInURNInput } from '../components/LinkedInURNInput';
import { MediaService } from '../../../media';
import { useFindLinkedInContentByUrn, useRegisterLinkedInContentByUrn } from './LinkedInCourseListModal.hooks';
import { LinkedInContentListTable } from './components/LinkedInContentsListTable';
import { LinkedInPagination } from '../components/LinkedInPagination';
import { LinkedInSearchBox } from '../components/CourseSearchBox';

interface Props {
  modalTitle: string;
  contentProviderId: string;
}

export const LinkedInCourseListModal = observer((props: Props) => {
  //
  const { modalTitle, contentProviderId } = props;
  const { isOpen, title, offset, cpContentsParams, contentProviderContentsParams, selectedContentId } =
    LinkedInCourseListModalStore.instance;
  const {
    setIsOpenLinkedInCourseListModal,
    setTitle,
    setOffset,
    setContentProviderContentsParams,
    setSelectedContentId,
  } = LinkedInCourseListModalStore.instance;
  const { changeMediaProps } = MediaService.instance;

  const { data: contentProviderContents, isLoading: contentProviderLoading } =
    useFindContentProviderContents(contentProviderContentsParams);
  const { data: cpContents, isLoading: cpContentsLoading } = useFindLinkedInContentByUrn(cpContentsParams.urn);
  const { mutate: registerLinkedInContentByUrn } = useRegisterLinkedInContentByUrn();

  const totalPages = () => {
    if (contentProviderContents === undefined) {
      return 0;
    }

    return Math.ceil(contentProviderContents.totalCount / 10);
  };

  useEffect(() => {
    //
    setContentProviderContentsParams(contentProviderId);
  }, [contentProviderId]);

  const onChangeTitle = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  }, []);

  const onClickSearch = useCallback(() => {
    setContentProviderContentsParams(contentProviderId);
  }, [setContentProviderContentsParams, contentProviderId]);

  const onChangeOffset = (_: React.MouseEvent, data: PaginationProps) => {
    setOffset(data.activePage as number);
    setContentProviderContentsParams(contentProviderId);
  };

  const onClickRadio = (contentId: string) => {
    //
    setSelectedContentId(contentId);
  };

  const onClickOK = async () => {
    const selectedContent = contentProviderContents?.results.find((content) => content.id === selectedContentId);
    if (selectedContent) {
      const url = `${selectedContent.linkMediaUrl}`;
      changeMediaProps('mediaContents.contentProviderContentId', selectedContentId);
      changeMediaProps('mediaContents.contentsProvider.url', url);
    } else if (cpContents?.usid === selectedContentId) {
      const url = `${cpContents.linkMediaUrl}`;
      await registerLinkedInContentByUrn(cpContents.usid);
      changeMediaProps('mediaContents.contentProviderContentId', selectedContentId);
      changeMediaProps('mediaContents.contentsProvider.url', url);
    }
    setIsOpenLinkedInCourseListModal(false);
  };

  const onClose = () => {
    setIsOpenLinkedInCourseListModal(false);
  };

  return (
    <Modal size="large" open={isOpen} onClose={onClose} className="base w1000 inner-scroll">
      <Modal.Header>{modalTitle}</Modal.Header>
      <Modal.Content>
        <>
          <LinkedInSearchBox title={title} onChangeTitle={onChangeTitle} onClickSearch={onClickSearch} />
          {!contentProviderContents || (contentProviderContents.results.length <= 0 && <LinkedInURNInput />) || null}
          <div className="scrolling-80vh">
            <div className="content-wrap1">
              {(contentProviderContents &&
                contentProviderContents.results &&
                contentProviderContents.results.length > 0 && (
                  <CourseListTable
                    contentProviderContents={(contentProviderContents && contentProviderContents.results) || []}
                    selectedContentId={selectedContentId}
                    onClickRadio={onClickRadio}
                  />
                )) || (
                <LinkedInContentListTable
                  cpContents={cpContents}
                  selectedContentId={selectedContentId}
                  onClickRadio={onClickRadio}
                />
              )}
            </div>
          </div>
          <LinkedInPagination offset={offset} totalPages={totalPages()} onPageChange={onChangeOffset} />
        </>
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={onClose}>취소</Button>
        <Button onClick={onClickOK}>확인</Button>
      </Modal.Actions>
    </Modal>
  );
});
