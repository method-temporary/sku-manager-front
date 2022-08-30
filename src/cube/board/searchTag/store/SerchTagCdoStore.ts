import { PolyglotModel } from 'shared/model';
import SearchTagCdo from '../model/SearchTagCdo';
import { createStore } from './Store';

const [setTag, onTag, getTag] = createStore('');
const [setKeywords, onKeywords, getKeywords] = createStore('');

function getSearchTagCdo(): SearchTagCdo {
  const cineroomId = localStorage.getItem('nara.cineroomId');
  const cineroomWorkspaces: any[] = JSON.parse(localStorage.getItem('nara.workspaces')!).cineroomWorkspaces;
  const audienceKey = cineroomWorkspaces.find((c) => c.id === cineroomId).tenantId;
  const name = localStorage.getItem('nara.displayName')!;
  const email = localStorage.getItem('nara.email')!;
  return {
    audienceKey,
    tag: getTag(),
    keywords: getKeywords(),
    registrant: {
      name: PolyglotModel.stringToModel(name),
      email,
    },
  };
}

export { setTag, onTag, getTag, setKeywords, onKeywords, getKeywords, getSearchTagCdo };
