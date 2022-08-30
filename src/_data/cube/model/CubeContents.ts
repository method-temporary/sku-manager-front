import { Description, getInitDescription } from './Description';
import { DifficultyLevel } from './DifficultyLevel';
import { InstructorInCube } from './InstructorInCube';
import { DenizenKey } from '@nara.platform/accent';
import { PatronKey, PolyglotModel, ReportFileBox, Test } from '../../../shared/model';

export interface CubeContents {
  commentFeedbackId: string;
  description: Description;
  difficultyLevel: DifficultyLevel;
  fileBoxId: string;
  instructors: InstructorInCube[];
  modifiedTime: number;
  modifier: DenizenKey;
  operator: DenizenKey;
  organizerId: string;
  otherOrganizerName: string;
  patronKey: DenizenKey;
  registrantName: PolyglotModel;
  reportFileBox: ReportFileBox;
  reviewFeedbackId: string;
  surveyId: string;
  tags: PolyglotModel;
  tests: Test;
}

export function getInitCubeContents(): CubeContents {
  //
  return {
    commentFeedbackId: '',
    description: getInitDescription(),
    difficultyLevel: 'Basic',
    fileBoxId: '',
    instructors: [],
    modifiedTime: 0,
    modifier: new PatronKey(),
    operator: new PatronKey(),
    organizerId: '',
    otherOrganizerName: '',
    patronKey: new PatronKey(),
    registrantName: new PolyglotModel(),
    reportFileBox: new ReportFileBox(),
    reviewFeedbackId: '',
    surveyId: '',
    tags: new PolyglotModel(),
    tests: new Test(),
  };
}
