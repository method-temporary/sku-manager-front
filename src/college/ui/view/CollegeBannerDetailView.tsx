import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { Form, Input, Radio, Select, Table } from 'semantic-ui-react';
import { observer } from 'mobx-react';

import { reactAutobind } from '@nara.platform/accent';

import { Polyglot } from 'shared/components';
import { Language, LangSupport } from 'shared/components/Polyglot';

import { CollegeBannerModel } from '../../model/CollegeBannerModel';

interface Props extends RouteComponentProps<{ cineroomId: string }> {
  collegeBanner: CollegeBannerModel;
  setCollege: () => void;
  uploadFile: (file: File, lang: Language, index: number) => void;
  deleteFile: (lang: Language, index: number) => void;
  resetImage: (index: number) => void;
  onChangeCollegeBannerViewType: () => void;
  onChangeCollegeBannerProps: (name: string, value: string | number | [LangSupport]) => void;
  onChangeCollegeBannerContentProps: (index: number, name: string, value: string | number) => void;
}

@observer
@reactAutobind
class CollegeBannerDetailView extends React.Component<Props> {
  render() {
    const {
      collegeBanner,
      setCollege,
      uploadFile,
      deleteFile,
      resetImage,
      onChangeCollegeBannerViewType,
      onChangeCollegeBannerProps,
      onChangeCollegeBannerContentProps,
    } = this.props;

    const nameCount = (collegeBanner && collegeBanner.title && collegeBanner.title.length) || 0;

    return (
      <>
        <Polyglot languages={collegeBanner.langSupports}>
          <Table celled>
            <colgroup>
              <col width="20%" />
              <col width="80%" />
            </colgroup>

            <Table.Header>
              <Table.Row>
                <Table.HeaderCell colSpan={2} className="title-header">
                  Banner 정보
                </Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              <Table.Row>
                <Table.Cell className="tb-header">
                  지원 언어 <span className="required">*</span>
                </Table.Cell>
                <Table.Cell>
                  <Polyglot.Languages onChangeProps={onChangeCollegeBannerProps} />
                </Table.Cell>
              </Table.Row>
              {/*<Table.Row>*/}
              {/*  <Table.Cell className="tb-header">*/}
              {/*    기본 언어 <span className="required">*</span>*/}
              {/*  </Table.Cell>*/}
              {/*  <Table.Cell>*/}
              {/*    <Polyglot.Default onChangeProps={onChangeCollegeBannerProps} />*/}
              {/*  </Table.Cell>*/}
              {/*</Table.Row>*/}
              <Table.Row>
                <Table.Cell className="tb-header">
                  Banner 명 <span className="required">*</span>
                </Table.Cell>
                <Table.Cell>
                  <div className={nameCount >= 50 ? 'ui right-top-count input error' : 'ui right-top-count input'}>
                    <span className="count">
                      <span className="now">{nameCount}</span>/<span className="max">50</span>
                    </span>
                    <Form.Field
                      control={Input}
                      width={16}
                      placeholder="등록하실 Banner의 명칭을 입력해주세요."
                      value={(collegeBanner && collegeBanner.title) || ''}
                      maxLength={50}
                      onChange={(e: any) => onChangeCollegeBannerProps('title', e.target.value)}
                    />
                  </div>
                </Table.Cell>
              </Table.Row>
              {/* <Table.Row>
                <Table.Cell className="tb-header">
                  형태 <span className="required">*</span>
                </Table.Cell>
                <Table.Cell>
                  <Form.Group>
                    <Form.Field
                      control={Radio}
                      label="1열"
                      value={1}
                      checked={
                        (collegeBanner && collegeBanner.viewType === '1') ||
                        !collegeBanner ||
                        collegeBanner.viewType === undefined ||
                        collegeBanner.viewType === ''
                      }
                      onChange={(e: any, data: any) => {
                        onChangeCollegeBannerProps('viewType', '1');
                        onChangeCollegeBannerViewType();
                      }}
                    />
                    <Form.Field
                      control={Radio}
                      label="2열"
                      value={2}
                      checked={collegeBanner && collegeBanner.viewType === '2'}
                      onChange={(e: any, data: any) => {
                        onChangeCollegeBannerProps('viewType', '2');
                        onChangeCollegeBannerViewType();
                      }}
                    />
                  </Form.Group>
                </Table.Cell>
              </Table.Row> */}
              <Table.Row>
                <Table.Cell className="tb-header">
                  College <span className="required">*</span>
                </Table.Cell>
                <Table.Cell>
                  <Form.Group>
                    <Form.Field
                      control={Select}
                      placeholder="Select"
                      options={setCollege()}
                      value={(collegeBanner && collegeBanner.collegeId) || ''}
                      onChange={(e: any, data: any) => {
                        onChangeCollegeBannerProps('collegeId', data.value);
                      }}
                    />
                  </Form.Group>
                </Table.Cell>
              </Table.Row>
              {collegeBanner.collegeBannerContents &&
                collegeBanner.collegeBannerContents.map((collegeBannerContent, index) => (
                  <>
                    <Table.Row>
                      <Table.Cell className="tb-header">{`Banner ${index + 1} Image`}</Table.Cell>
                      <Table.Cell>
                        <Polyglot.Image
                          languageStrings={collegeBannerContent.imageUrl}
                          uploadFile={(file: File, lang: Language) => uploadFile(file, lang, index)}
                          deleteFile={(lang: Language) => deleteFile(lang, index)}
                        />
                      </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell className="tb-header">Link 적용 여부</Table.Cell>
                      <Table.Cell>
                        <Form.Group>
                          <Form.Field
                            control={Radio}
                            label="Yes"
                            value={1}
                            checked={
                              (collegeBannerContent && collegeBannerContent.useLink === 1) ||
                              !collegeBannerContent ||
                              collegeBannerContent.useLink === undefined
                            }
                            onChange={(e: any, data: any) => {
                              onChangeCollegeBannerContentProps(index, 'useLink', 1);
                            }}
                          />
                          <Form.Field
                            control={Radio}
                            label="No"
                            value={2}
                            checked={collegeBannerContent && collegeBannerContent.useLink === 0}
                            onChange={(e: any, data: any) => onChangeCollegeBannerContentProps(index, 'useLink', 0)}
                          />
                        </Form.Group>
                      </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell className="tb-header">Banner Link</Table.Cell>
                      <Table.Cell>
                        <Polyglot.Input
                          languageStrings={collegeBannerContent.linkUrl}
                          name="linkUrl"
                          onChangeProps={(name: any, value: any) =>
                            onChangeCollegeBannerContentProps(index, name, value)
                          }
                          placeholder="https://"
                          readOnly={collegeBannerContent.useLink === 0}
                        />
                      </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell className="tb-header">공개 여부</Table.Cell>
                      <Table.Cell>
                        <Form.Group>
                          <Form.Field
                            control={Radio}
                            label="Yes"
                            value={1}
                            checked={
                              (collegeBannerContent && collegeBannerContent.visible === 1) ||
                              !collegeBannerContent ||
                              collegeBannerContent.visible === undefined
                            }
                            onChange={(e: any, data: any) => onChangeCollegeBannerContentProps(index, 'visible', 1)}
                          />
                          <Form.Field
                            control={Radio}
                            label="No"
                            value={2}
                            checked={collegeBannerContent && collegeBannerContent.visible === 0}
                            onChange={(e: any, data: any) => onChangeCollegeBannerContentProps(index, 'visible', 0)}
                          />
                        </Form.Group>
                      </Table.Cell>
                    </Table.Row>
                  </>
                ))}
            </Table.Body>
          </Table>
        </Polyglot>
      </>
    );
  }
}

export default withRouter(CollegeBannerDetailView);
