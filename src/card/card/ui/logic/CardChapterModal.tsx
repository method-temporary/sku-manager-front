import React from 'react';
import { observer } from 'mobx-react';
import { Accordion, Button, Checkbox, Form, Table } from 'semantic-ui-react';

import { reactAutobind } from '@nara.platform/accent';

import { PolyglotModel } from 'shared/model';
import { alert, AlertModel, FormTable, Modal, Polyglot } from 'shared/components';
import { getPolyglotToAnyString, isDefaultPolyglotBlank } from 'shared/components/Polyglot';

import ChapterContainer from './ChapterContainer';
import { LearningContentModel } from '../../../../_data/lecture/cards/model/vo/LearningContentModel';
import { LearningContentType } from '../../model/vo/LearningContentType';
import { CardService } from '../../index';

interface Props {
  //
  cardService: CardService;
  learningContents: LearningContentModel[];
}

interface State {
  open: boolean;
  activeIndex: number;
  addChapterName: PolyglotModel;
  addChapterDescription: PolyglotModel;
  addChapter: boolean;
}

@observer
@reactAutobind
class CardChapterModal extends React.Component<Props, State> {
  //
  chapterDescriptionQuillRef: any = null;

  state: State = {
    open: false,
    activeIndex: 0,
    addChapterName: new PolyglotModel(),
    addChapterDescription: new PolyglotModel(),
    addChapter: false,
  };

  onCheckAddChapterModalOpen() {
    //
    // const { cardService } = this.props;

    // const copiedContents = [...cardService.cardContentsQuery.learningContents];

    // if (copiedContents.filter((content) => content.learningContentType === LearningContentType.Cube).length === 0) {
    //   alert(
    //     AlertModel.getCustomAlert(true, 'Chapter 모달 안내', 'Cube 선택 후 Chapter를 추가 할 수 있습니다.', 'OK')
    //   );
    //
    //   return;
    // }

    this.setState({ open: true });
  }

  onMount() {
    //
    const { cardService } = this.props;

    const copiedContents = [...cardService.cardContentsQuery.learningContents];

    const chapterContents: LearningContentModel[] = [];
    const learnContents: LearningContentModel[] = [];

    copiedContents.forEach((content) => {
      if (content.learningContentType === LearningContentType.Chapter) {
        const newChildren: LearningContentModel[] = [];

        content.children &&
          content.children.forEach((cContent) => {
            learnContents.push({ ...cContent, inChapter: true, selected: false });
            newChildren.push({ ...cContent, inChapter: true, selected: false });
          });

        chapterContents.push({ ...content, children: newChildren });
      } else {
        learnContents.push({ ...content, selected: false });
      }
    });

    cardService.setChapters(chapterContents);
    cardService.setLearningContents(learnContents);
  }

  onClickAccordion = (e: any, titleProps: any) => {
    const { index } = titleProps;
    const { activeIndex } = this.state;
    const newIndex = activeIndex === index ? -1 : index;

    this.setState({ activeIndex: newIndex });
  };

  async onClickAddChapterForm() {
    //
    const { chapters, learningContents } = this.props.cardService;

    if (this.state.addChapter) return;

    if (chapters.length === learningContents.length) {
      alert(AlertModel.getCustomAlert(false, 'Add Guide', 'Chapter는 최대 Cude/Talk 갯수까지 가능합니다.', 'OK'));
      return;
    }

    await this.setState({ addChapter: true });
  }

  onClickAddChapter() {
    //
    const { addChapters, cardQuery } = this.props.cardService;

    if (isDefaultPolyglotBlank(cardQuery.langSupports, this.state.addChapterName)) {
      alert(AlertModel.getRequiredInputAlert('Chapter 명'));
    } else {
      const learningContent = LearningContentModel.asChapter(
        this.state.addChapterName,
        this.state.addChapterDescription
      );

      addChapters(learningContent);

      this.setState({
        addChapter: false,
        addChapterName: new PolyglotModel(),
        addChapterDescription: new PolyglotModel(),
      });
    }
  }

  onClickCancelAddChapter() {
    //
    this.setState({
      addChapter: false,
      addChapterName: new PolyglotModel(),
      addChapterDescription: new PolyglotModel(),
    });
  }

  onChangeAddChapterName(name: string, addChapterName: PolyglotModel) {
    //
    this.setState({ addChapterName });
  }

  onChangeAddChapterDescription(name: string, addChapterDescription: PolyglotModel) {
    //
    this.setState({ addChapterDescription });
  }

  onClickCheckContents(index: number, checked: boolean) {
    //
    const { cardService } = this.props;

    cardService.changeLearningContentsProps(index, 'selected', checked);
  }

  onClickAllContents() {
    //
    const { learningContents, changeLearningContentsProps } = this.props.cardService;

    learningContents &&
      learningContents.forEach((content, index) => {
        if (!content.inChapter) {
          changeLearningContentsProps(index, 'selected', true);
        }
      });
  }

  onClickCancel() {
    //
    const { setLearningContents, setChapters } = this.props.cardService;

    setLearningContents([]);
    setChapters([]);

    this.setState({ open: false });
  }

  onClickOk() {
    //
    const { chapters, learningContents, changeCardContentsQueryProps } = this.props.cardService;

    const notChildren = chapters.filter((content) => content.children && content.children.length === 0);

    if (notChildren.length > 0) {
      //
      alert(
        AlertModel.getCustomAlert(
          true,
          '챕터 관리 안내',
          '큐브가 편입 되지 않은 챕터가 있습니다. 편입 또는 챕터 삭제 후 확인을 눌러 주세요.',
          '확인'
        )
      );

      return;
    }

    const copiedChapters = [...chapters];
    const copiedContents = [...learningContents];

    const inChapterFilterContents = copiedContents.filter((content) => !content.inChapter);

    changeCardContentsQueryProps('learningContents', [...copiedChapters, ...inChapterFilterContents]);

    this.setState({ open: false });
  }

  render() {
    //

    const { open, addChapter, addChapterName, addChapterDescription } = this.state;
    const { cardService } = this.props;
    const { chapters, chapterNames, chapterDescriptions, learningContents, cardQuery } = cardService;

    return (
      <>
        <Button floated="right" type="button" onClick={this.onCheckAddChapterModalOpen}>
          Chapter
        </Button>
        <Polyglot languages={cardQuery.langSupports}>
          <Modal size="large" onMount={this.onMount} open={open}>
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
                      <span>Cube / Talk {learningContents.length}개 등록되어 있습니다.</span>
                    </Table.HeaderCell>
                    <Table.HeaderCell>
                      <span className="vertical-sub">Chapter</span>
                      <Button primary size="mini" floated="right" onClick={this.onClickAddChapterForm}>
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
                                onClick={this.onClickAllContents}
                              >
                                전체선택
                              </Button>
                            </>
                          }
                        >
                          <Table.Row>
                            <Table.Cell colSpan={2}>
                              {learningContents.map((contents, index) => (
                                <Form.Field
                                  key={index}
                                  className="checkbox-group"
                                  control={Checkbox}
                                  label={getPolyglotToAnyString(contents.name)}
                                  disabled={contents.inChapter}
                                  checked={contents.selected || contents.inChapter}
                                  onClick={(e: any, data: any) =>
                                    !contents.inChapter && this.onClickCheckContents(index, data.checked)
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
                        {addChapter && (
                          <Table>
                            <Table.Body>
                              <Table.Row>
                                <Table.Cell className="no-bottom-line">
                                  {/*<Form.Field*/}
                                  {/*  fluid*/}
                                  {/*  error={addChapterName.length > 49}*/}
                                  {/*  control={Input}*/}
                                  {/*  value={addChapterName}*/}
                                  {/*  className="height32"*/}
                                  {/*  placeholder="Chapter명을 입력해주세요 (최대 50자)"*/}
                                  {/*  onChange={(e: any, data: any) => this.onChangeAddChapterName(data.value)}*/}
                                  {/*  onKeyUp={(e: any) => e.keyCode === 13 && this.onClickAddChapter()}*/}
                                  {/*/>*/}
                                  <Polyglot.Input
                                    name="addChapterName"
                                    languageStrings={addChapterName}
                                    onChangeProps={this.onChangeAddChapterName}
                                    className="height32 width-100-per"
                                    placeholder="Chapter명을 입력해주세요 (최대 50자)"
                                    maxLength="50"
                                    onKeyUp={(e: any) => e.keyCode === 13 && this.onClickAddChapter()}
                                  />
                                </Table.Cell>
                              </Table.Row>
                              <Table.Row>
                                <Table.Cell className="pop-editor no-bottom-line">
                                  {/*<HtmlEditor*/}
                                  {/*  quillRef={(el) => {*/}
                                  {/*    this.chapterDescriptionQuillRef = el;*/}
                                  {/*  }}*/}
                                  {/*  modules={SelectType.modules}*/}
                                  {/*  formats={SelectType.formats}*/}
                                  {/*  placeholder="Chapter 소개를 입력해주세요. (1,000자까지 입력가능)"*/}
                                  {/*  onChange={(html) =>*/}
                                  {/*    this.onChangeAddChapterDescription(html === '<p><br></p>' ? '' : html)*/}
                                  {/*  }*/}
                                  {/*  value={addChapterDescription}*/}
                                  {/*/>*/}

                                  <Polyglot.Editor
                                    name="addChapterDescription"
                                    languageStrings={addChapterDescription}
                                    onChangeProps={this.onChangeAddChapterDescription}
                                    placeholder="Chapter 소개를 입력해주세요. (1,000자까지 입력가능)"
                                  />
                                </Table.Cell>
                              </Table.Row>
                              <Table.Row>
                                <Table.Cell>
                                  <Button size="medium" type="Button" onClick={this.onClickCancelAddChapter}>
                                    취소
                                  </Button>
                                  <Button size="medium" type="Button" onClick={this.onClickAddChapter}>
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
                              <ChapterContainer
                                key={index}
                                chapterName={chapterNames[index]}
                                chapterDescription={chapterDescriptions[index]}
                                index={index}
                                chapter={chapter}
                                cardService={cardService}
                                activeIndex={this.state.activeIndex}
                                onClickAccordion={this.onClickAccordion}
                              />
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
              <Button onClick={this.onClickCancel}>Cancel</Button>
              <Button onClick={this.onClickOk}>OK</Button>
            </Modal.Actions>
          </Modal>
        </Polyglot>
      </>
    );
  }
}

export default CardChapterModal;
