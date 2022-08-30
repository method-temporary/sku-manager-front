import { NaOffsetElementDetail, getEmptyNaOffsetElementDetail } from 'shared/model';
import { DashBoardSentenceDetailModel } from '_data/arrange/dashboardMessage/model';
import { createStore } from './Store';
// DashBoardSentenceStore
const initialStore: NaOffsetElementDetail<DashBoardSentenceDetailModel> = getEmptyNaOffsetElementDetail();

const [setDetail, onDetail, getDetail] = createStore(initialStore);

export { setDetail, onDetail, getDetail };
