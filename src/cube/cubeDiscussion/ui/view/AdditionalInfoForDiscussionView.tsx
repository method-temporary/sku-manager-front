import * as React from 'react';
import { Button, Form, Input, Table, Radio } from 'semantic-ui-react';
import { observer } from 'mobx-react';

import { reactAutobind } from '@nara.platform/accent';

import { CubeType } from 'shared/model';

import { CubeDiscussionModel } from '../../model/CubeDiscussionModel';

interface Props {
  handleOnChangeCubeDiscussionProps: (name: string, value: string | boolean) => void;
  // onChangeCubeDiscussionCountProps: (name: string, value: string) => void;
  // onChangeCubeDiscussionContentProps: (name: string, value: string) => void;
  onClickAddRelatedUrl: () => void;
  onClickRemoveRelatedUrl: (index: number) => void;
  cubeDiscussion: CubeDiscussionModel;
  // getFileBoxIdForCubeDiscussion: (fileBoxId: string) => void;
  cubeType?: string;
  readonly?: boolean;
}

interface States {}

@observer
@reactAutobind
class AdditionalInfoForDiscussionView extends React.Component<Props, States> {
  //

  //기타안내 ReactQuill 객체
  cubeDiscussionContentQuillRef: any = null;

  render() {
    const {
      handleOnChangeCubeDiscussionProps,
      // onChangeCubeDiscussionCountProps,
      // onChangeCubeDiscussionContentProps,
      onClickAddRelatedUrl,
      onClickRemoveRelatedUrl,
      cubeDiscussion,
      // getFileBoxIdForCubeDiscussion,
      cubeType,
      readonly,
    } = this.props;

    return (
      <Table celled>
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
          {/* <Table.Row>
            <Table.Cell className="tb-header">
              내용<span className="required">*</span>
            </Table.Cell>
            <Table.Cell className="pop-editor">
              <HtmlEditor
                quillRef={(el) => {
                  this.cubeDiscussionContentQuillRef = el;
                }}
                modules={SelectType.modules}
                formats={SelectType.formats}
                placeholder="Talk 하고자 하는 상세 내용을 입력해주세요."
                onChange={(html) =>
                  onChangeCubeDiscussionContentProps('content', html === '<p><br></p>' ? '' : html)
                }
                value={cubeDiscussion ? cubeDiscussion.content : ''}
                readOnly={readonly}
              />
            </Table.Cell>
          </Table.Row> */}
          <Table.Row>
            <Table.Cell className="tb-header">
              관련 URL
              {cubeType === CubeType.WebPage || cubeType === CubeType.Experiential || cubeType === CubeType.Cohort ? (
                <span className="required">*</span>
              ) : null}
            </Table.Cell>
            <Table.Cell>
              {cubeDiscussion && cubeDiscussion.relatedUrlList.length > 0
                ? cubeDiscussion.relatedUrlList.map((relatedUrl, index) => (
                    <div className="margin-bottom10" key={index}>
                      <Form.Field
                        control={Input}
                        disabled={readonly}
                        fluid
                        className="margin-bottom5"
                        placeholder="관련 URL 타이틀을 입력해주세요"
                        value={relatedUrl.title}
                        onChange={(e: any, data: any) =>
                          handleOnChangeCubeDiscussionProps(`relatedUrlList[${index}].title`, data.value)
                        }
                      />

                      <Form.Field
                        control={Input}
                        disabled={readonly}
                        maxLength={100}
                        fluid
                        className="action-height37"
                        action={
                          cubeDiscussion.relatedUrlList.length === index + 1 ? (
                            <>
                              <Button className="icon" onClick={() => onClickAddRelatedUrl()}>
                                <i className="plus link icon" />
                              </Button>
                              <Button className="icon" onClick={() => onClickAddRelatedUrl()} disabled={index === 0}>
                                <i className="minus link icon" />
                              </Button>
                            </>
                          ) : (
                            {
                              icon: { name: 'minus', link: true },
                              onClick: () => onClickRemoveRelatedUrl(index),
                            }
                          )
                        }
                        placeholder="https://"
                        value={relatedUrl.url}
                        onChange={(e: any, data: any) =>
                          handleOnChangeCubeDiscussionProps(`relatedUrlList[${index}].url`, data.value)
                        }
                      />
                    </div>
                  ))
                : '-'}
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell className="tb-header">노출 범위 설정</Table.Cell>
            <Table.Cell>
              {readonly ? (
                <p>{!cubeDiscussion.privateComment ? '모든 학습자' : '본인+과정 담당자'}</p>
              ) : (
                <Form.Group>
                  <Form.Field
                    control={Radio}
                    label="모든 학습자"
                    checked={cubeDiscussion && !cubeDiscussion.privateComment}
                    onChange={(e: any, data: any) =>
                      // console.log('자동이수')
                      handleOnChangeCubeDiscussionProps('privateComment', !cubeDiscussion.privateComment)
                    }
                  />
                  <Form.Field
                    control={Radio}
                    label="본인+과정 담당자"
                    checked={cubeDiscussion && cubeDiscussion.privateComment}
                    onChange={(e: any, data: any) =>
                      // console.log('수동이수')
                      handleOnChangeCubeDiscussionProps('privateComment', !cubeDiscussion.privateComment)
                    }
                  />
                </Form.Group>
              )}
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell className="tb-header">댓글 익명 설정</Table.Cell>
            <Table.Cell>
              {readonly ? (
                <p>{cubeDiscussion?.anonymous ? 'Yes' : 'No'}</p>
              ) : (
                <Form.Group>
                  <Form.Field
                    control={Radio}
                    label="Yes"
                    checked={cubeDiscussion && cubeDiscussion.anonymous}
                    onChange={(e: any, data: any) =>
                      // console.log('자동이수')
                      handleOnChangeCubeDiscussionProps('anonymous', !cubeDiscussion.anonymous)
                    }
                  />
                  <Form.Field
                    control={Radio}
                    label="No"
                    checked={cubeDiscussion && !cubeDiscussion.anonymous}
                    onChange={(e: any, data: any) =>
                      // console.log('자동이수')
                      handleOnChangeCubeDiscussionProps('anonymous', !cubeDiscussion.anonymous)
                    }
                  />
                </Form.Group>
              )}
            </Table.Cell>
          </Table.Row>
          {/* <Table.Row>
          <Table.Cell className="tb-header">
            관련자료 {cubeType === CubeType.Documents ? <span className="required">*</span> : null}
          </Table.Cell>
          <Table.Cell>
            <FileBox
              options={{ readonly }}
              id={(cubeDiscussion && cubeDiscussion.depotId) || ''}
              // id={(cubeDiscussion && cubeDiscussion.description) || ''}
              vaultKey={{ keyString: 'sku-depot', patronType: PatronType.Pavilion }}
              patronKey={{ keyString: 'sku-denizen', patronType: PatronType.Denizen }}
              validations={[{ type: ValidationType.Duplication, validator: DepotUtil.duplicationValidator }]}
              onChange={getFileBoxIdForCubeDiscussion}
            />
            <p className="info-text-gray">- DOC,PDF,EXL 파일을 등록하실 수 있습니다.</p>
            <p className="info-text-gray">- 최대 10MB 용량의 파일을 등록하실 수 있습니다.</p>
          </Table.Cell>
        </Table.Row> */}
        </Table.Body>
      </Table>
    );
  }
}

export default AdditionalInfoForDiscussionView;
