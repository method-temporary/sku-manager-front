import { useState, useEffect, ChangeEvent, useCallback } from 'react';
import { useRouteMatch } from 'react-router-dom';
import { ColorResult } from 'react-color';
import { autorun } from 'mobx';

import { getNameValueListFromMap } from 'shared/helper';

import { upload } from '../../file/api/FileApi';
import HomeStore from '../mobx/HomeStore';
import Home, { getEmptyHome } from '../model/Home';
import { fromHome } from '../model/HomeCdo';
import { findHome, registerHome, modifyHome, registerPreviewHome, findPreview } from '../api/HomeApi';

export interface ChangeType {
  (_: any, next: any): void;
}

export interface ChangeIntroduce {
  (e: ChangeEvent<HTMLInputElement>): void;
}

export interface SetThumbnailId {
  (e: ChangeEvent<HTMLInputElement>): void;
}

export interface ChangeHtml {
  (next: string): void;
}

interface Save {
  (): void;
}

interface PreviewSave {
  (): void;
}

function changeType(_: any, next: any) {
  HomeStore.instance.changeType(next.value);
}

function changeIntroduce(e: ChangeEvent<HTMLInputElement>) {
  const invalid = e.target.value.length > 50;
  if (invalid) {
    return;
  }
  HomeStore.instance.changeIntroduce(e.target.value);
}

function setThumbnailId(e: ChangeEvent<HTMLInputElement>) {
  upload(e)?.then(HomeStore.instance.changeThumbnailId);
}

function changeHtml(next: string) {
  HomeStore.instance.changeHtml(next);
}

export function changeCommunityHomeColor(next: ColorResult) {
  HomeStore.instance.changeColor(next.hex);
}

function requestFindHome(commnunityId?: string) {
  if (commnunityId === undefined) {
    return;
  }
  const homeStore = HomeStore.instance;
  findHome(commnunityId).then((home) => {
    if (home === undefined || home === null || typeof home !== 'object') {
      homeStore.select(getEmptyHome());
      return;
    }
    homeStore.select(home);
    // homeStore.nameValueMap.clear();
  });
}

function requestPreview(commnunityId?: string, draft?: number) {
  if (commnunityId === undefined || draft === undefined) {
    return;
  }
  const homeStore = HomeStore.instance;
  findPreview(commnunityId, draft).then((home) => {
    if (home === undefined || home === null || typeof home !== 'object') {
      homeStore.select(getEmptyHome());
      return;
    }
    homeStore.select(home);
    // homeStore.nameValueMap.clear();
  });
}

function previewSave(communityId: string) {
  const homeStore = HomeStore.instance;
  const next = homeStore.selected;
  if (next.id === undefined || next.id === null || next.id === '' || next.draft === 0) {
    registerPreviewHome(communityId, fromHome(next)).then(() => requestPreview(communityId, 1));
  } else {
    if (homeStore.nameValueMap.size === 0) {
      return;
    }
    modifyHome(communityId, next.id, getNameValueListFromMap(homeStore.nameValueMap)).then(() =>
      requestPreview(communityId, 1)
    );
  }
}

function save(communityId: string) {
  const homeStore = HomeStore.instance;
  const next = homeStore.selected;
  if (next.id === undefined || next.id === null || next.id === '' || next.draft === 1) {
    registerHome(communityId, fromHome(next)).then(() => requestPreview(communityId, 0));
  } else {
    if (homeStore.nameValueMap.size === 0) {
      return;
    }
    modifyHome(communityId, next.id, getNameValueListFromMap(homeStore.nameValueMap)).then(() =>
      requestPreview(communityId, 0)
    );
  }
  // console.log('here : ', next);
}

export function useHome(): [Home, ChangeType, ChangeIntroduce, SetThumbnailId, ChangeHtml, Save, PreviewSave] {
  const { params } = useRouteMatch();

  const homeStore = HomeStore.instance;
  const [value, setValue] = useState<Home>(getEmptyHome());

  useEffect(() => {
    return autorun(() => {
      setValue({ ...homeStore.selected });
    });
  }, []);

  useEffect(() => {
    const { communityId } = params as any;
    if (communityId !== undefined) {
      requestPreview(communityId, 0);
    }
  }, [params]);

  useEffect(() => {
    const { communityId, draft } = params as any;
    if (communityId !== undefined && draft !== undefined) {
      requestPreview(communityId, draft);
    }
  }, [params]);

  const nextSave = useCallback(() => {
    const { communityId } = params as any;
    save(communityId);
  }, [params]);

  const nextSave2 = useCallback(() => {
    const { communityId } = params as any;
    previewSave(communityId);
  }, [params]);

  return [value, changeType, changeIntroduce, setThumbnailId, changeHtml, nextSave, nextSave2];
}
