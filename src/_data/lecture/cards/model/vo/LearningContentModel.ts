import { decorate, observable } from 'mobx';
import { CubeType, PolyglotModel } from 'shared/model';
import { uuidv4 } from 'shared/helper';
import Discussion from 'discussion/model/Discussion';
import { LearningContentType } from 'card/card/model/vo/LearningContentType';

export class LearningContentModel {
  //
  id: string = '';
  contentId: string = '';
  name: PolyglotModel = new PolyglotModel();
  parentId: string = '';
  children: LearningContentModel[] = [];
  learningContentType: LearningContentType = LearningContentType.Cube;

  // Chapter Props
  description: PolyglotModel = new PolyglotModel();

  // Cube Props
  contentDetailType: CubeType = CubeType.Empty;
  time?: number = 0;
  registrantName?: PolyglotModel = new PolyglotModel();
  channel: string = '';

  // Discussion Props
  discussion: Discussion = new Discussion();

  selected: boolean = false;
  inChapter: boolean = false;

  constructor(learningContent?: LearningContentModel) {
    //
    if (learningContent) {
      const name = (learningContent.name && new PolyglotModel(learningContent.name)) || this.name;
      const description =
        (learningContent.description && new PolyglotModel(learningContent.description)) || this.description;
      const registrantName =
        (learningContent.registrantName && new PolyglotModel(learningContent.registrantName)) || this.registrantName;

      Object.assign(this, { ...learningContent, name, description, registrantName });
    }
  }

  static asChapter(name: PolyglotModel, description?: PolyglotModel): LearningContentModel {
    //
    const learningContent = new LearningContentModel();

    return {
      ...learningContent,
      learningContentType: LearningContentType.Chapter,
      contentId: uuidv4(),
      name,
      description: description || new PolyglotModel(),
    };
  }

  static asCube(
    contentId: string,
    name: PolyglotModel,
    contentDetailType: CubeType,
    time: number,
    registrantName: PolyglotModel,
    channel: string
  ): LearningContentModel {
    //
    const learningContent = new LearningContentModel();

    return {
      ...learningContent,
      learningContentType: LearningContentType.Cube,
      contentId,
      name,
      contentDetailType,
      time,
      registrantName,
      channel,
    };
  }

  static asDiscussion(name: PolyglotModel, discussion?: Discussion): LearningContentModel {
    //
    const learningContent = new LearningContentModel();
    const contentId = discussion ? discussion.id : uuidv4();

    return {
      ...learningContent,
      contentId,
      name,
      learningContentType: LearningContentType.Discussion,
      discussion: discussion || new Discussion(),
    };
  }
}

decorate(LearningContentModel, {
  id: observable,
  contentId: observable,
  name: observable,
  parentId: observable,
  children: observable,
  learningContentType: observable,
  description: observable,
  contentDetailType: observable,
  time: observable,
  registrantName: observable,
  channel: observable,
  discussion: observable,
  selected: observable,
  inChapter: observable,
});
