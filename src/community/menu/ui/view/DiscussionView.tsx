import React, { useCallback, useEffect, useState } from 'react';
import { Form, Input, Radio } from 'semantic-ui-react';
import ReactQuill from 'react-quill';

import { FileBox, PatronType, ValidationType } from '@nara.drama/depot';

import { SelectType } from 'shared/model';
import { DepotUtil } from 'shared/ui';

import RelatedUrl, { getEmptyRelatedUrl } from '../../model/RelatedUrl';
import { findMenuDiscussionFeedBack } from '../../api/MenuApi';
import { Row } from './MenuInputView';

import {
  ChangeName,
  ChangeDiscussionTopic,
  ChangeDiscussionFileBoxId,
  ChangeDiscussionContent,
  ChangeDiscussionRelatedUrlList,
  SetDiscussionRelatedUrlList,
  ChangeDiscussionPrivateComment,
  MinusDiscussionRelatedUrlList,
  ChangeHtml,
} from '../../service/useSelectedMenu';

interface DiscussionViewProps {
  name: string;
  changeName: ChangeName;
  detail?: boolean;
  courseSetInfoDescriptionQuillRef: any;
  discussionTopic: string;
  changeDiscussionTopic: ChangeDiscussionTopic;
  changeDiscussionFileBoxId: ChangeDiscussionFileBoxId;
  changeDiscussionContent: ChangeDiscussionContent;
  changeDiscussionRelatedUrlList: ChangeDiscussionRelatedUrlList;
  setDiscussionRelatedUrlList: SetDiscussionRelatedUrlList;
  changeDiscussionPrivateComment: ChangeDiscussionPrivateComment;
  minusDiscussionRelatedUrlList: MinusDiscussionRelatedUrlList;
  privateComment: boolean;
  fileBoxId?: string;
  content?: string;
  relatedUrlList?: RelatedUrl[];
  menuId: string;
  feedbackId?: string;
}

const DiscussionView: React.FC<DiscussionViewProps> = function DiscussionView({
  name,
  changeName,
  detail,
  discussionTopic,
  courseSetInfoDescriptionQuillRef,
  changeDiscussionTopic,
  changeDiscussionFileBoxId,
  changeDiscussionContent,
  changeDiscussionRelatedUrlList,
  setDiscussionRelatedUrlList,
  changeDiscussionPrivateComment,

  privateComment,
  fileBoxId,
  content,
  relatedUrlList,
  menuId,
  feedbackId,
  minusDiscussionRelatedUrlList,
}) {
  // 최초 조회시에만 중복 체크 패쓰
  const [checkBox, setCheckBox] = useState<boolean>(privateComment);
  useEffect(() => {
    if (feedbackId) {
      findMenuDiscussionFeedBack(feedbackId).then((datasFeedback) => {
        if (datasFeedback !== null) {
          setCheckBox(datasFeedback?.config.privateComment === undefined ? true : datasFeedback?.config.privateComment);
        }
      });
    }
  }, [feedbackId]);

  const setDiscussionContentTest = useCallback((html: any, delta: any, source: string, editor: any) => {
    if (source === 'user') {
      changeDiscussionContent(html === '<p><br></p>' ? '' : html);
    }
  }, []);

  const setDiscussionVisible = useCallback(
    (privateComment: boolean) => {
      setCheckBox(privateComment);
      changeDiscussionPrivateComment(privateComment);
    },
    [privateComment]
  );

  useEffect(() => {
    changeDiscussionPrivateComment(privateComment);
  }, [privateComment]);

  return (
    <>
      <Row title="메뉴명">
        <Input fluid placeholder="메뉴명을 입력해주세요." value={name} onChange={changeName} />
      </Row>
      <Row title="질문">
        <Input
          fluid
          placeholder="화면 상단에 노출될 질문을 입력해주세요."
          value={discussionTopic}
          maxLength={50}
          onChange={changeDiscussionTopic}
        />
      </Row>

      <Row title="상세 설명">
        <div>
          <ReactQuill
            ref={(el) => {
              courseSetInfoDescriptionQuillRef = el;
            }}
            modules={SelectType.modules}
            formats={SelectType.formats}
            onChange={setDiscussionContentTest}
            value={content || ''}
            placeholder="상세 설명을 입력해주세요."
          />
        </div>
      </Row>

      <Row title="관련 URL">
        {relatedUrlList &&
          relatedUrlList?.map((m, i) => {
            return (
              <>
                <Form.Field
                  control={Input}
                  fluid
                  placeholder="관련 URL 타이틀을 입력해주세요"
                  value={relatedUrlList[i].title}
                  onChange={(e: any) => changeDiscussionRelatedUrlList('title', i, e.target.value)}
                />

                {/* eslint-disable */}
                <Form.Field
                  control={Input}
                  style={{ margin: '5px 0' }}
                  maxLength={100}
                  fluid
                  action={
                    relatedUrlList.length === i + 1
                      ? {
                          icon: { name: 'plus', link: true },
                          onClick: () => setDiscussionRelatedUrlList([...relatedUrlList, getEmptyRelatedUrl()]),
                        }
                      : {
                          icon: { name: 'minus', link: true },
                          onClick: () =>
                            minusDiscussionRelatedUrlList(
                              relatedUrlList.filter((m, index) => {
                                if (index !== i) {
                                  return m;
                                }
                              })
                            ),
                        }
                  }
                  placeholder="https://"
                  value={relatedUrlList[i].url}
                  onChange={(e: any) => changeDiscussionRelatedUrlList('url', i, e.target.value)}
                />

                {/* eslint-enable */}
              </>
            );
          })}
      </Row>
      <Row title="관련 자료">
        <div className="lg-attach">
          <div className="attach-inner">
            <FileBox
              id={fileBoxId || ''}
              vaultKey={{ keyString: 'sku-depot', patronType: PatronType.Pavilion }}
              patronKey={{ keyString: 'sku-denizen', patronType: PatronType.Denizen }}
              validations={[{ type: ValidationType.Duplication, validator: DepotUtil.duplicationValidator }]}
              onChange={changeDiscussionFileBoxId}
              options={{ readonly: detail }}
            />
            <ol className="info-text-gray" style={{ textAlign: 'left' }}>
              - DOC, PDF, EXL, JPEG, PNG 파일을 등록하실 수 있습니다.
            </ol>
            <ol className="info-text-gray" style={{ textAlign: 'left' }}>
              - 최대 10MB 용량의 파일을 등록하실 수 있습니다.
            </ol>
            {/* <div>
                    {
                      filesMap && filesMap.get('reference')
                      && filesMap.get('reference').map((foundedFile: DepotFileViewModel, index: number) => (
                        <p key={index}><a onClick={() => depot.downloadDepotFile(foundedFile.id)}>{foundedFile.name}</a></p>
                      )) || '-'
                    }
                  </div> */}
          </div>
        </div>
      </Row>

      <Row title="의견 공개">
        <div
          style={{
            flexDirection: 'row',
            display: 'flex',
            paddingBottom: '1em',
            alignItems: 'center',
          }}
        >
          <div style={{ paddingRight: '1em' }}>
            <Form.Field
              control={Radio}
              label="공개"
              checked={checkBox === false}
              onChange={(e: any) => setDiscussionVisible(false)}
            />
          </div>
          <div style={{ paddingRight: '1em' }}>
            <Form.Field
              control={Radio}
              label="비공개"
              checked={checkBox === true}
              onChange={(e: any) => setDiscussionVisible(true)}
            />
          </div>
        </div>
        <div style={{ paddingLeft: '2em' }}>
          <ul>
            <li> 의견이 비공개 처리되어 학습자간 공유되지 않으며, 작성한 본인과 관리자만 확인할 수 있습니다. </li>
          </ul>
        </div>
      </Row>
    </>
  );
};

export default DiscussionView;
