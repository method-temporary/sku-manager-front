import React from 'react';
import { observer } from 'mobx-react';
import { Accordion, Button, Icon, Form, Checkbox, Table } from 'semantic-ui-react';

import { reactAutobind } from '@nara.platform/accent';

import { PolyglotModel } from 'shared/model';
import { AlertModel, confirm, ConfirmModel, Polyglot } from 'shared/components';
import { getPolyglotToAnyString, isDefaultPolyglotBlank } from 'shared/components/Polyglot';

import { CardService } from '../../index';

import { LearningContentModel } from '../../../../_data/lecture/cards/model/vo/LearningContentModel';

interface Props {
  //
  chapter: LearningContentModel;
  chapterName: PolyglotModel;
  chapterDescription: PolyglotModel;
  index: number;
  activeIndex: number;
  cardService: CardService;
  onClickAccordion: (e: any, titleProps: any) => void;
}

interface State {
  //
  isUpdatable: boolean;
}

@observer
@reactAutobind
class ChapterContainer extends React.Component<Props, State> {
  //
  chapterDescriptionQuillRef: any = null;

  state: State = {
    isUpdatable: false,
  };

  onClickModify(e: any) {
    //
    e.stopPropagation();

    this.setState({ isUpdatable: true });
  }

  onChangeChapterName(name: string, value: any, config: { index: number }) {
    //
    this.props.cardService.changeChapterNames(config.index, value);
  }

  onChangeChapterDescription(name: string, value: any) {
    //
    const { index } = this.props;
    this.props.cardService.changeChapterDescriptions(index, value);
  }

  onClickCancelChapterUpdate(e: any) {
    //
    e.stopPropagation();

    const { index, cardService, chapter } = this.props;

    this.setState({ isUpdatable: false });

    cardService.changeChapterNames(index, chapter.name);
    cardService.changeChapterDescriptions(index, chapter.description);
  }

  onClickModifyChapter(e: any, index: number) {
    //
    e.stopPropagation();

    const { cardService, chapterName, chapterDescription } = this.props;

    if (isDefaultPolyglotBlank(cardService.cardQuery.langSupports, chapterName)) {
      //
      alert(AlertModel.getRequiredInputAlert('Chapter 명'));
      return;
    }

    cardService.changeChaptersProps(index, 'name', chapterName);
    cardService.changeChaptersProps(index, 'description', chapterDescription);
    this.setState({ isUpdatable: false });
  }

  onClickDeleteChapter(e: any, index: number) {
    //
    e.stopPropagation();

    const { cardService } = this.props;

    const chapter = cardService.chapters[index];

    if (chapter.children && chapter.children.length > 0) {
      confirm(
        ConfirmModel.getCustomConfirm(
          '삭제 안내',
          '챕터를 삭제하면 편입된 큐브는 모수 취소됩니다. 삭제 하시겠습니까?',
          true,
          '삭제',
          '취소',
          () => {
            this.onClickChapterOutContents(true);
            this.props.cardService.removeChapter(index);
          }
        )
      );
    } else {
      this.props.cardService.removeChapter(index);
    }
  }

  onClickChapterInContents() {
    //
    const { cardService, index } = this.props;

    const insertContents: LearningContentModel[] =
      cardService.chapters && cardService.chapters[index] && cardService.chapters[index].children
        ? [...cardService.chapters[index].children]
        : [];
    const otherContents: LearningContentModel[] = [];

    cardService.learningContents &&
      cardService.learningContents.forEach((content) => {
        if (content.selected) {
          insertContents.push({ ...content, selected: false });
          otherContents.push({ ...content, selected: false, inChapter: true });
        } else {
          otherContents.push({ ...content });
        }
      });

    cardService.changeChaptersProps(index, 'children', insertContents);
    cardService.setLearningContents(otherContents);
  }

  onClickChapterOutContents(all?: boolean) {
    //
    const { cardService, index } = this.props;

    const chapter =
      cardService.chapters && cardService.chapters[index] && cardService.chapters[index].children
        ? [...cardService.chapters[index].children]
        : [];

    const deleteIds: string[] = [];
    const deleteContents: LearningContentModel[] = [];

    chapter &&
      chapter.forEach((content) => {
        if (content.selected) {
          deleteIds.push(content.contentId);
        } else {
          all && deleteIds.push(content.contentId);
          deleteContents.push({ ...content });
        }
      });

    cardService.changeChaptersProps(index, 'children', deleteContents);

    cardService.learningContents &&
      cardService.learningContents.forEach((content, index) => {
        if (deleteIds.includes(content.contentId)) {
          cardService.changeLearningContentsProps(index, 'inChapter', false);
        }
      });
  }

  onClickCheckContents(value: boolean, cIndex: number) {
    //
    const { cardService, index } = this.props;

    cardService.changeChaptersProps(index, `children[${cIndex}].selected`, value);
  }

  onClickAccordion(e: any, titleProps: any) {
    //
    if (!this.state.isUpdatable) {
      this.props.onClickAccordion(e, titleProps);
    }
  }

  render() {
    //
    const { isUpdatable } = this.state;
    const { activeIndex, index, chapter, chapterName, chapterDescription } = this.props;

    return (
      <div>
        {!isUpdatable && (
          <div className="cell v-top ">
            <>
              <p>
                <Button icon="angle left" size="mini" basic onClick={() => this.onClickChapterOutContents()} />
              </p>
              <p>
                <Button icon="angle right" size="mini" basic onClick={this.onClickChapterInContents} />
              </p>
            </>
          </div>
        )}
        <div className="cell vtop no-line width-100-per">
          <Accordion.Title
            active={activeIndex === index}
            index={index}
            onClick={(e: any, titleProps) => this.onClickAccordion(e, titleProps)}
          >
            <Table celled>
              <Table.Body>
                <Table.Row>
                  <Table.Cell className="no-bottom-line" colSpan={2}>
                    {isUpdatable ? (
                      // <Form.Field
                      //   width={16}
                      //   // className="inline-important"
                      //   control={Input}
                      //   value={chapterName}
                      //   placeholder="Chapter명을 입력해주세요 (최대 50자)"
                      //   onClick={(e: any) => e.stopPropagation()}
                      //   onChange={(e: any, data: any) => this.onChangeChapterName(e, data.value)}
                      //   onKeyDown={(e: any) => {
                      //     e.keyCode === 13 && this.onClickModifyChapter(e, index);
                      //   }}
                      // />
                      <Polyglot.Input
                        name="chapterName"
                        languageStrings={chapterName}
                        onChangeProps={this.onChangeChapterName}
                        config={{ index }}
                        placeholder="Chapter명을 입력해주세요 (최대 50자)"
                      />
                    ) : (
                      <>
                        <span className="vertical-sub">
                          <Icon name="dropdown" />
                          {`${getPolyglotToAnyString(chapter.name)} (${
                            chapter.children ? chapter.children.length : 0
                          })`}
                        </span>

                        <div className="inline-important floated-right">
                          <Button size="mini" floated="right" onClick={(e: any) => this.onClickDeleteChapter(e, index)}>
                            Delete
                          </Button>
                          <Button size="mini" floated="right" onClick={(e: any) => this.onClickModify(e)}>
                            Edit
                          </Button>
                        </div>
                      </>
                    )}
                  </Table.Cell>
                </Table.Row>
                {isUpdatable && (
                  <Table.Row>
                    <Table.Cell className="pop-editor no-bottom-line">
                      <div onClick={(e: any) => e.stopPropagation()}>
                        {/*<HtmlEditor*/}
                        {/*  quillRef={(el) => {*/}
                        {/*    this.chapterDescriptionQuillRef = el;*/}
                        {/*  }}*/}
                        {/*  modules={SelectType.modules}*/}
                        {/*  formats={SelectType.formats}*/}
                        {/*  placeholder="Chapter 소개를 입력해주세요. (1,000자까지 입력가능)"*/}
                        {/*  onChange={(html) => this.onChangeChapterDescription(html === '<p><br></p>' ? '' : html)}*/}
                        {/*  value={chapterDescription}*/}
                        {/*/>*/}

                        <Polyglot.Editor
                          name="chapterDescription"
                          onChangeProps={this.onChangeChapterDescription}
                          languageStrings={chapterDescription}
                          maxLength={1000}
                          readOnly={!isUpdatable}
                        />
                      </div>
                    </Table.Cell>
                  </Table.Row>
                )}
                {isUpdatable && (
                  <Table.Row>
                    <Table.Cell className="no-bottom-line">
                      <Button size="tiny" onClick={(e: any) => this.onClickCancelChapterUpdate(e)}>
                        취소
                      </Button>
                      <Button size="tiny" onClick={(e: any) => this.onClickModifyChapter(e, index)}>
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
                      chapter.children.map((content, index) => (
                        <Form.Field
                          key={index}
                          className="checkbox-group"
                          control={Checkbox}
                          label={getPolyglotToAnyString(content.name)}
                          checked={content.selected}
                          onClick={(e: any, data: any) => this.onClickCheckContents(data.checked, index)}
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
  }
}

export default ChapterContainer;
