import React from 'react';
import { observer } from 'mobx-react';
import { Accordion, Button, Checkbox, Form, Icon, Table } from 'semantic-ui-react';

import { PolyglotModel } from 'shared/model';
import { AlertModel, confirm, ConfirmModel, Polyglot } from 'shared/components';
import { getPolyglotToAnyString, isDefaultPolyglotBlank } from 'shared/components/Polyglot';

import CardCreateStore from '../../../../../CardCreate.store';
import ChapterModalStore from '../ChapterModal.store';
import { LearningContentWithOptional } from '../../../model/learningContentWithOptional';

interface Props {
  //
  index: number;
  chapter: LearningContentWithOptional;
}

const ChapterModalChapterList = observer(({ index, chapter }: Props) => {
  //
  const {
    activeIndex,
    chapters,
    contents,
    updateChapterName,
    updateChapterDescription,
    isUpdateChapterIndex,
    setActiveIndex,
    setChapters,
    setContents,
    setUpdateChapterName,
    setUpdateChapterDescription,
    setIsUpdateChapterIndex,
    updateChapterReset,
    onClickChapterInContents,
  } = ChapterModalStore.instance;
  const { langSupports } = CardCreateStore.instance;

  const onClickChapterOutContents = (all?: boolean) => {
    //
    const childs: LearningContentWithOptional[] = chapter.children || [];

    const deleteIds: string[] = [];
    const nextChildren: LearningContentWithOptional[] = [];

    childs &&
      childs.forEach((child) => {
        if (child.selected) {
          deleteIds.push(child.contentId);
        } else {
          all && deleteIds.push(child.contentId);
          nextChildren.push(child);
        }
      });

    setChapters(
      chapters.map((chapter, idx) =>
        idx === index ? ({ ...chapter, children: nextChildren } as LearningContentWithOptional) : chapter
      )
    );

    setContents(
      contents.map((content) =>
        deleteIds.includes(content.contentId)
          ? ({
              ...content,
              inChapter: false,
              parentId: '',
            } as LearningContentWithOptional)
          : content
      )
    );
  };

  const onClickAccordion = () => {
    //
    if (isUpdateChapterIndex > -1) {
      return;
    }

    setActiveIndex(activeIndex === index ? -1 : index);
  };

  const onClickDeleteChapter = (e: any) => {
    //
    e.stopPropagation();

    if (chapter.children && chapter.children.length > 0) {
      confirm(
        ConfirmModel.getCustomConfirm(
          '삭제 안내',
          '챕터를 삭제하면 편입된 큐브는 모수 취소됩니다. 삭제 하시겠습니까?',
          true,
          '삭제',
          '취소',
          () => {
            onClickChapterOutContents(true);
            removeChapter();
          }
        )
      );
    } else {
      removeChapter();
    }
  };

  const removeChapter = () => {
    //
    setChapters(chapters.filter((_, idx) => idx !== index).map((chapter) => chapter));
  };

  const onClickModify = (e: any) => {
    //
    e.stopPropagation();

    setIsUpdateChapterIndex(index);
    setUpdateChapterName(chapter.name);
    setUpdateChapterDescription(chapter.description || new PolyglotModel());
  };

  const onClickCancelChapterUpdate = () => {
    //
    updateChapterReset();
  };

  const onClickModifyChapter = (e: any) => {
    //
    e.stopPropagation();

    if (isDefaultPolyglotBlank(langSupports, updateChapterName)) {
      //
      alert(AlertModel.getRequiredInputAlert('Chapter 명'));
      return;
    }

    setChapters(
      chapters.map((chapter, idx) => {
        //
        if (idx === index) {
          //
          return {
            ...chapter,
            name: updateChapterName,
            description: updateChapterDescription,
          };
        } else {
          //
          return chapter;
        }
      })
    );

    updateChapterReset();
  };

  const onClickCheckContents = (childrenIndex: number, checked: boolean) => {
    //
    // index => chapter index
    // childrenIndex => 선택한 Cube 의 index

    const nextChildren = chapter.children
      ? chapter.children.map((content: LearningContentWithOptional, contentIndex: number) =>
          childrenIndex === contentIndex ? ({ ...content, selected: checked } as LearningContentWithOptional) : content
        )
      : [];

    setChapters(
      chapters.map((chapter, idx) =>
        idx === index ? ({ ...chapter, children: nextChildren } as LearningContentWithOptional) : chapter
      )
    );
  };

  return (
    <div>
      {isUpdateChapterIndex !== index && (
        <div className="cell v-top ">
          <>
            <p>
              <Button icon="angle left" size="mini" basic onClick={() => onClickChapterOutContents()} />
            </p>
            <p>
              <Button icon="angle right" size="mini" basic onClick={() => onClickChapterInContents(chapter, index)} />
            </p>
          </>
        </div>
      )}
      <div className="cell vtop no-line width-100-per">
        <Accordion.Title active={activeIndex === index} index={index} onClick={onClickAccordion}>
          <Table celled>
            <Table.Body>
              <Table.Row>
                <Table.Cell className="no-bottom-line" colSpan={2}>
                  {isUpdateChapterIndex === index ? (
                    <Polyglot.Input
                      name="chapterName"
                      languageStrings={updateChapterName}
                      onChangeProps={(name: any, value: any) => setUpdateChapterName(value)}
                      placeholder="Chapter명을 입력해주세요 (최대 50자)"
                    />
                  ) : (
                    <>
                      <span className="vertical-sub">
                        <Icon name="dropdown" />
                        {`${getPolyglotToAnyString(chapter.name)} (${chapter.children ? chapter.children.length : 0})`}
                      </span>

                      <div className="inline-important floated-right">
                        <Button size="mini" floated="right" onClick={(e: any) => onClickDeleteChapter(e)}>
                          Delete
                        </Button>
                        <Button size="mini" floated="right" onClick={(e: any) => onClickModify(e)}>
                          Edit
                        </Button>
                      </div>
                    </>
                  )}
                </Table.Cell>
              </Table.Row>
              {isUpdateChapterIndex === index && (
                <Table.Row>
                  <Table.Cell className="pop-editor no-bottom-line">
                    <div onClick={(e: any) => e.stopPropagation()}>
                      <Polyglot.Editor
                        name="chapterDescription"
                        languageStrings={updateChapterDescription}
                        onChangeProps={(_, value) => setUpdateChapterDescription(value)}
                        maxLength={1000}
                        // readOnly={!(isUpdateChapterIndex === index)}
                      />
                    </div>
                  </Table.Cell>
                </Table.Row>
              )}
              {isUpdateChapterIndex === index && (
                <Table.Row>
                  <Table.Cell className="no-bottom-line">
                    <Button size="tiny" onClick={(e: any) => onClickCancelChapterUpdate()}>
                      취소
                    </Button>
                    <Button size="tiny" onClick={(e: any) => onClickModifyChapter(e)}>
                      변경
                    </Button>
                  </Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table>
        </Accordion.Title>
        <Accordion.Content active={activeIndex === index}>
          <Table celled>
            <Table.Body>
              <Table.Row>
                <Table.Cell className="scrolling-30vh">
                  {chapter.children && chapter.children.length > 0 ? (
                    chapter.children.map((content, childrenIndex) => (
                      <Form.Field
                        key={childrenIndex}
                        className="checkbox-group"
                        control={Checkbox}
                        label={getPolyglotToAnyString(content.name)}
                        checked={content.selected}
                        onClick={(e: any, data: any) => onClickCheckContents(childrenIndex, data.checked)}
                      />
                    ))
                  ) : (
                    <>Cube / Talk를 선택해 주세요.</>
                  )}
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        </Accordion.Content>
      </div>
    </div>
  );
});

export default ChapterModalChapterList;
