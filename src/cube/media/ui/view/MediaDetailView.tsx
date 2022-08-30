import * as React from 'react';
import { Form, Table } from 'semantic-ui-react';
import { observer } from 'mobx-react';
import { reactAutobind } from '@nara.platform/accent';
import { MediaType } from '../../model/old/MediaType';
import { MediaModel } from '../../model/MediaModel';

interface Props {
  media: MediaModel;
  goToVideo: (url: string) => void;
  structureType?: string;
}

@observer
@reactAutobind
class MediaDetailView extends React.Component<Props> {
  //
  render() {
    const { media, goToVideo, structureType } = this.props;
    if (structureType === 'onlyRow') {
      return (
        <Table.Row>
          <Table.Cell className="tb-header">교육자료</Table.Cell>
          <Table.Cell>
            {media && media.mediaType === MediaType.LinkMedia ? (
              <Form.Field>{(media && media.mediaContents && media.mediaContents.linkMediaUrl) || '-'}</Form.Field>
            ) : (
              ''
            )}

            {(media &&
              media.mediaContents &&
              media.mediaContents.internalMedias &&
              media.mediaContents.internalMedias.length &&
              media.mediaContents.internalMedias.map((internalMedia, idx) => (
                <Form.Field key={idx}>
                  <p>
                    <a onClick={() => goToVideo(internalMedia.viewUrl)}>
                      {internalMedia.name} | {internalMedia.folderName}
                    </a>
                  </p>
                </Form.Field>
              ))) ||
              ''}

            {media && media.mediaType === MediaType.ContentsProviderMedia ? (
              <Table celled>
                <colgroup>
                  <col width="30%" />
                  <col width="50%" />
                  <col width="20%" />
                </colgroup>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell textAlign="center">cp사</Table.HeaderCell>
                    <Table.HeaderCell textAlign="center">교육자료</Table.HeaderCell>
                    <Table.HeaderCell textAlign="center">컨텐츠만료일</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  <Table.Row>
                    <Table.Cell textAlign="center">
                      {(media &&
                        media.mediaContents &&
                        media.mediaContents.contentsProvider &&
                        media.mediaContents.contentsProvider &&
                        media.mediaContents.contentsProvider.contentsProviderType &&
                        media.mediaContents.contentsProvider.contentsProviderType.name) ||
                        '-'}
                    </Table.Cell>
                    <Table.Cell textAlign="center">
                      {(media &&
                        media.mediaContents &&
                        media.mediaContents.contentsProvider &&
                        media.mediaContents.contentsProvider.url) ||
                        '-'}
                    </Table.Cell>
                    <Table.Cell textAlign="center">
                      {(media &&
                        media.mediaContents &&
                        media.mediaContents.contentsProvider &&
                        media.mediaContents.contentsProvider.expiryDateDot != String('2100.12.30') &&
                        media.mediaContents.contentsProvider.expiryDateDot) ||
                        '기간 무제한'}
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table>
            ) : (
              ''
            )}
          </Table.Cell>
        </Table.Row>
      );
    } else {
      return (
        <Table celled key={3}>
          <colgroup>
            <col width="20%" />
            <col width="80%" />
          </colgroup>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell colSpan={2} className="title-header">
                부가 정보
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.Cell className="tb-header">교육자료</Table.Cell>
              <Table.Cell>
                {media && media.mediaType === MediaType.LinkMedia ? (
                  <Form.Field>{(media && media.mediaContents && media.mediaContents.linkMediaUrl) || '-'}</Form.Field>
                ) : (
                  ''
                )}

                {(media &&
                  media.mediaContents &&
                  media.mediaContents.internalMedias &&
                  media.mediaContents.internalMedias.length &&
                  media.mediaContents.internalMedias.map((internalMedia, idx) => (
                    <Form.Field key={idx}>
                      <p>
                        <a onClick={() => goToVideo(internalMedia.viewUrl)}>
                          {internalMedia.name} | {internalMedia.folderName}
                        </a>
                      </p>
                    </Form.Field>
                  ))) ||
                  ''}

                {media && media.mediaType === MediaType.ContentsProviderMedia ? (
                  <Table celled>
                    <colgroup>
                      <col width="30%" />
                      <col width="50%" />
                      <col width="20%" />
                    </colgroup>
                    <Table.Header>
                      <Table.Row>
                        <Table.HeaderCell textAlign="center">cp사</Table.HeaderCell>
                        <Table.HeaderCell textAlign="center">교육자료</Table.HeaderCell>
                        <Table.HeaderCell textAlign="center">컨텐츠만료일</Table.HeaderCell>
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      <Table.Row>
                        <Table.Cell textAlign="center">
                          {(media &&
                            media.mediaContents &&
                            media.mediaContents.contentsProvider &&
                            media.mediaContents.contentsProvider &&
                            media.mediaContents.contentsProvider.contentsProviderType &&
                            media.mediaContents.contentsProvider.contentsProviderType.name) ||
                            '-'}
                        </Table.Cell>
                        <Table.Cell textAlign="center">
                          {(media &&
                            media.mediaContents &&
                            media.mediaContents.contentsProvider &&
                            media.mediaContents.contentsProvider.url) ||
                            '-'}
                        </Table.Cell>
                        <Table.Cell textAlign="center">
                          {(media &&
                            media.mediaContents &&
                            media.mediaContents.contentsProvider &&
                            media.mediaContents.contentsProvider.expiryDateDot != String('2100.12.30') &&
                            media.mediaContents.contentsProvider.expiryDateDot) ||
                            '기간 무제한'}
                        </Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  </Table>
                ) : (
                  ''
                )}
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      );
    }
  }
}

export default MediaDetailView;
