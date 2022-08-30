import { action, observable } from 'mobx';
import { PolyglotModel } from '../../../../../../shared/model';
import { LearningContentWithOptional } from '../../model/learningContentWithOptional';

class ChapterModalStore {
  //
  static instance: ChapterModalStore;

  @observable
  isAddChapter: boolean = false;

  @observable
  addChapterName: PolyglotModel = new PolyglotModel();

  @observable
  addChapterDescription: PolyglotModel = new PolyglotModel();

  @observable
  chapters: LearningContentWithOptional[] = [];

  @observable
  contents: LearningContentWithOptional[] = [];

  @observable
  activeIndex: number = 0;

  @observable
  isUpdateChapterIndex: number = -1;

  @observable
  updateChapterName: PolyglotModel = new PolyglotModel();

  @observable
  updateChapterDescription: PolyglotModel = new PolyglotModel();

  @action.bound
  setIsAddChapter(isAddChapter: boolean) {
    //
    this.isAddChapter = isAddChapter;
  }

  @action.bound
  setAddChapterName(addChapterName: PolyglotModel) {
    //
    this.addChapterName = addChapterName;
  }

  @action.bound
  setAddChapterDescription(addChapterDescription: PolyglotModel) {
    //
    this.addChapterDescription = addChapterDescription;
  }

  @action.bound
  setChapters(chapters: LearningContentWithOptional[]) {
    //
    this.chapters = chapters;
  }

  @action.bound
  setContents(contents: LearningContentWithOptional[]) {
    //
    this.contents = contents;
  }

  @action.bound
  setActiveIndex(activeIndex: number) {
    //
    this.activeIndex = activeIndex;
  }

  @action.bound
  setIsUpdateChapterIndex(isUpdateChapterIndex: number) {
    //
    this.isUpdateChapterIndex = isUpdateChapterIndex;
  }

  @action.bound
  setUpdateChapterName(updateChapterName: PolyglotModel) {
    //
    this.updateChapterName = updateChapterName;
  }

  @action.bound
  setUpdateChapterDescription(updateChapterDescription: PolyglotModel) {
    //
    this.updateChapterDescription = updateChapterDescription;
  }

  @action.bound
  addChapterReset() {
    //
    this.isAddChapter = false;
    this.addChapterName = new PolyglotModel();
    this.addChapterDescription = new PolyglotModel();
  }

  @action.bound
  updateChapterReset() {
    //
    this.isUpdateChapterIndex = -1;
    this.updateChapterName = new PolyglotModel();
    this.updateChapterDescription = new PolyglotModel();
  }

  @action.bound
  onClickChapterInContents(chapter: LearningContentWithOptional, index: number) {
    //
    // 선택된 Chapter에 포함하는 Contents
    const insertContents: LearningContentWithOptional[] = chapter.children || [];
    // Chapter가 아닌 컨텐츠 목록
    const otherContents: LearningContentWithOptional[] = [];

    this.contents.forEach((content) => {
      if (content.selected) {
        insertContents.push({ ...content, selected: false, parentId: (chapter && chapter.contentId) || '' });
        otherContents.push({ ...content, selected: false, inChapter: true });
      } else {
        otherContents.push({ ...content });
      }
    });

    this.setChapters(
      this.chapters.map((_, idx) => {
        return index === idx ? { ..._, children: insertContents } : _;
      })
    );

    this.setContents(otherContents);
  }

  @action.bound
  reset() {
    //
    this.chapters = [];
    this.contents = [];
    this.activeIndex = -1;

    this.addChapterReset();
    this.updateChapterReset();
  }
}

ChapterModalStore.instance = new ChapterModalStore();
export default ChapterModalStore;
