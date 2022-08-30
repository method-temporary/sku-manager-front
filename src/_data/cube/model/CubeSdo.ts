import { Category } from '../../college/model';
import { Description } from './Description';
import { DifficultyLevel } from './DifficultyLevel';
import { InstructorInCube } from './InstructorInCube';
import { LangSupport } from '../../../shared/components/Polyglot';
import { CubeMaterialSdo, CubeMaterialSdoFunc } from './material/CubeMaterialSdo';
import { PolyglotModel } from '../../../shared/model';
import { DenizenKey, PatronType } from '@nara.platform/accent';
import { DatePeriodFunc, ReportFileBox } from '../../shared';
import { Term } from '../../shared/Term';
import { Test } from '../../lecture/cards/model/vo';
import { CubeType } from './CubeType';
import { CubeDetail } from './CubeDetail';
import dayjs from 'dayjs';

export interface CubeSdo {
  categories: Category[];
  description: Description;
  difficultyLevel: DifficultyLevel;
  fileBoxId: string;
  instructors: InstructorInCube[];
  langSupports: LangSupport[];
  learningTime: number;
  materialSdo: CubeMaterialSdo;
  name: PolyglotModel;
  operator: DenizenKey;
  organizerId: string;
  otherOrganizerName: string;
  reportFileBox?: ReportFileBox;
  sharingCineroomIds: string[];
  surveyId?: string;
  tags: PolyglotModel;
  terms?: Term[];
  tests?: Test[];
  type: CubeType;
}

function initialize(): CubeSdo {
  const toDay = dayjs(new Date());

  return {
    categories: [],
    description: {
      goal: new PolyglotModel(),
      applicants: new PolyglotModel(),
      description: new PolyglotModel(),
      completionTerms: new PolyglotModel(),
      guide: new PolyglotModel(),
    },
    difficultyLevel: 'Basic',
    fileBoxId: '',
    instructors: [],
    langSupports: [],
    learningTime: 0,
    materialSdo: {
      classroomSdos: [
        {
          freeOfCharge: { freeOfCharge: false, chargeAmount: 0, sendingMail: false, approvalProcess: false },
          operation: { operator: { keyString: '', patronType: PatronType.Denizen }, siteUrl: '', location: '' },
          round: 1,
          capacity: 0,
          capacityClosed: false,
          waitingCapacity: 0,
          enrolling: {
            enrollingAvailable: false,
            cancellationPenalty: '',
            cancellablePeriod: DatePeriodFunc.setDatePeriod(
              toDay.toDate().getTime(),
              toDay.add(1, 'month').toDate().getTime()
            ),
            applyingPeriod: DatePeriodFunc.setDatePeriod(
              toDay.toDate().getTime(),
              toDay.add(1, 'month').toDate().getTime()
            ),
            learningPeriod: DatePeriodFunc.setDatePeriod(
              toDay.add(1, 'month').add(1, 'day').toDate().getTime(),
              toDay.add(2, 'month').add(1, 'day').toDate().getTime()
            ),
          },
        },
      ],
    },
    name: new PolyglotModel(),
    operator: {
      keyString: '',
      patronType: PatronType.Denizen,
    },
    organizerId: '',
    otherOrganizerName: '',
    sharingCineroomIds: [],
    tags: new PolyglotModel(),
    type: 'ELearning',
  };
}

function fromCubeDetail(cube: CubeDetail): CubeSdo {
  //

  return {
    categories: [...cube.cube.categories],
    description: {
      ...cube.cubeContents.description,
      completionTerms: new PolyglotModel(cube.cubeContents.description.completionTerms),
    },
    difficultyLevel: cube.cubeContents.difficultyLevel,
    fileBoxId: cube.cubeContents.fileBoxId,
    instructors: [...cube.cubeContents.instructors],
    langSupports: [...cube.cube.langSupports],
    learningTime: cube.cube.learningTime,
    materialSdo: CubeMaterialSdoFunc.fromCubeMaterial(cube.cubeMaterial),
    name: new PolyglotModel(cube.cube.name),
    operator: {
      ...cube.cubeContents.operator,
    },
    organizerId: cube.cubeContents.organizerId,
    otherOrganizerName: cube.cubeContents.otherOrganizerName,
    sharingCineroomIds: [...cube.cube.sharingCineroomIds],
    tags: new PolyglotModel(cube.cubeContents.tags),
    type: cube.cube.type,
  };
}

export const CubeSdoFunc = { initialize, fromCubeDetail };
