import React from 'react';
import { observer } from 'mobx-react';
import { Accordion, Button, Checkbox, Form, Table } from 'semantic-ui-react';

import { alert, AlertModel, FormTable, Modal, Polyglot } from 'shared/components';
import { getPolyglotToAnyString, isDefaultPolyglotBlank, LangSupport } from 'shared/components/Polyglot';
import { uuidv4 } from 'shared/helper';

import ChapterModalStore from './ChapterModal.store';

import ChapterModalChapterList from './components/ChapterModalChapterList';
import { LearningContentWithOptional } from '../../model/learningContentWithOptional';

interface Props {
  //
  langSupports: LangSupport[];
  learningContents: LearningContentWithOptional[];
  onCancel?: () => void;
  onOk?: (learningContents: LearningContentWithOptional[]) => void;
}

const ChapterModal = observer(({ langSupports, learningContents, onCancel, onOk }: Props) => {
  //
  const {
    isAddChapter,
    addChapterName,
    addChapterDescription,
    chapters,
    contents,
    setIsAddChapter,
    setAddChapterName,
    setAddChapterDescription,
    setChapters,
    setContents,
    addChapterReset,
    reset,
  } = ChapterModalStore.instance;

  const onMount = () => {
    //
    reset();

    const nextChapters: LearningContentWithOptional[] = [];
    const nextContents: LearningContentWithOptional[] = [];

    learningContents.forEach((learningContent) => {
      if (learningContent.learningContentType === 'Chapter') {
        const children = learningContent.children;
        const nextChildren: LearningContentWithOptional[] = [];

        if (children) {
          //
          children.forEach((childrenLearningContent) => {
            nextChildren.push({
              ...childrenLearningContent,
              inChapter: true,
              selected: false,
            } as LearningContentWithOptional);

            nextContents.push({
              ...childrenLearningContent,
              inChapter: true,
              selected: false,
            } as LearningContentWithOptional);
          });
        }

        nextChapters.push({
          ...learningContent,
          children: nextChildren,
          chapter: true,
          inChapter: false,
          selected: false,
        } as LearningContentWithOptional);
      } else {
        nextContents.push({ ...learningContent, inChapter: false, selected: false } as LearningContentWithOptional);
      }
    });

    setChapters(nextChapters);
    setContents(nextContents);
  };

  const onClickAddChapter = () => {
    //
    if (isDefaultPolyglotBlank(langSupports, addChapterName)) {
      //
      alert(AlertModel.getRequiredInputAlert('Chapter 명'));
      return;
    }

    const newChapter = {
      chapter: true,
      selected: false,
      inChapter: false,
      parentId: '',
      name: addChapterName,
      learningContentType: 'Chapter',
      contentDetailType: '',
      description: addChapterDescription,
      contentId: uuidv4(),
      enrollmentRequired: false,
    } as LearningContentWithOptional;

    setChapters([...chapters, newChapter]);
    addChapterReset();
  };

  const onClickAllContents = () => {
    //
    setContents(contents.map((content) => (content.inChapter ? content : { ...content, selected: true })));
  };

  const onClickCheckContents = (index: number, checked: boolean) => {
    //
    setContents(contents.map((content, idx) => (idx === index ? { ...content, selected: checked } : content)));
  };

  const onClickCancel = (_: React.MouseEvent<HTMLButtonElement>, close: () => void) => {
    //
    reset();
    onCancel && onCancel();
    close();
  };

  const onClickOk = (_: React.MouseEvent<HTMLButtonElement>, close: () => void) => {
    //
    const nonChildren = chapters.filter(
      (content) => !content.children || (content.children && content.children && content.children.length === 0)
    );

    if (nonChildren.length > 0) {
      alert(
        AlertModel.getCustomAlert(
          true,
          '챕터 관리 안내',
          '컨텐츠가 빈 챕터가 있습니다. 편입 또는 챕터 삭제 후 확인을 눌러 주세요.',
          '확인'
        )
      );
      return;
    }

    const resultLearningContents = [...chapters];
    const nonInChapterContents = contents.filter((content) => !content.inChapter);

    resultLearningContents.push(...nonInChapterContents);

    onOk && onOk(resultLearningContents as LearningContentWithOptional[]);

    onClickCancel(_, close);
  };

  return (
    <>
      <Polyglot languages={langSupports}>
        <Modal
          size="large"
          onMount={onMount}
          trigger={
            <Button floated="right" type="button">
              Chapter
            </Button>
          }
        >
          <Modal.Header>Chapter 관리</Modal.Header>
          <Modal.Content>
            <Table celled>
              <colgroup>
                <col width="50%" />
                <col width="50%" />
              </colgroup>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>
                    <span>Cube / Talk {contents.length}개 등록되어 있습니다.</span>
                  </Table.HeaderCell>
                  <Table.HeaderCell>
                    <span className="vertical-sub">Chapter</span>
                    <Button primary size="mini" floated="right" onClick={() => setIsAddChapter(true)}>
                      Chapter 추가
                    </Button>
                  </Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                <Table.Row>
                  <Table.Cell className="vertical-top">
                    <div className="scrolling-60vh">
                      <FormTable
                        title={
                          <>
                            <span className="vertical-sub">Cube / Talk명</span>
                            <Button
                              floated="right"
                              type="button"
                              size="mini"
                              disabled={chapters.length === 0}
                              onClick={onClickAllContents}
                            >
                              전체선택
                            </Button>
                          </>
                        }
                      >
                        <Table.Row>
                          <Table.Cell colSpan={2}>
                            {contents.map((contents, index) => (
                              <Form.Field
                                key={index}
                                className="checkbox-group"
                                control={Checkbox}
                                label={getPolyglotToAnyString(contents.name)}
                                disabled={contents.inChapter}
                                checked={contents.selected || contents.inChapter}
                                onClick={(e: any, data: any) =>
                                  !contents.inChapter && onClickCheckContents(index, data.checked)
                                }
                              />
                            ))}
                          </Table.Cell>
                        </Table.Row>
                      </FormTable>
                    </div>
                  </Table.Cell>
                  <Table.Cell className="vertical-top">
                    <span className="span-information">Cube / Talk 미선택 시 Chapter가 저장되지 않습니다.</span>
                    <div className="scrolling-60vh">
                      {isAddChapter && (
                        <Table>
                          <Table.Body>
                            <Table.Row>
                              <Table.Cell className="no-bottom-line">
                                <Polyglot.Input
                                  name="addChapterName"
                                  languageStrings={addChapterName}
                                  onChangeProps={(_, value) => setAddChapterName(value)}
                                  className="height32 width-100-per"
                                  placeholder="Chapter명을 입력해주세요 (최대 50자)"
                                  maxLength="50"
                                  onKeyUp={(e: any) => e.keyCode === 13 && onClickAddChapter()}
                                />
                              </Table.Cell>
                            </Table.Row>
                            <Table.Row>
                              <Table.Cell className="pop-editor no-bottom-line">
                                <Polyglot.Editor
                                  name="addChapterDescription"
                                  languageStrings={addChapterDescription}
                                  onChangeProps={(_, value) => setAddChapterDescription(value)}
                                  placeholder="Chapter 소개를 입력해주세요. (1,000자까지 입력가능)"
                                />
                              </Table.Cell>
                            </Table.Row>
                            <Table.Row>
                              <Table.Cell>
                                <Button size="medium" type="Button" onClick={addChapterReset}>
                                  취소
                                </Button>
                                <Button size="medium" type="Button" onClick={onClickAddChapter}>
                                  확인
                                </Button>
                                <span className="span-information">확인 버튼을 누르면 Chapter가 생성됩니다.</span>
                              </Table.Cell>
                            </Table.Row>
                          </Table.Body>
                        </Table>
                      )}
                      <Accordion fluid>
                        <div className="table-css fluid">
                          {chapters.map((chapter, index) => (
                            <ChapterModalChapterList chapter={chapter} index={index} />
                          ))}
                        </div>
                      </Accordion>
                    </div>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
          </Modal.Content>
          <Modal.Actions>
            <Modal.CloseButton onClickWithClose={onClickCancel}>Cancel</Modal.CloseButton>
            <Modal.CloseButton onClickWithClose={onClickOk}>OK</Modal.CloseButton>
          </Modal.Actions>
        </Modal>
      </Polyglot>
    </>
  );
});

export default ChapterModal;
