import React from 'react';
import { patronInfo } from '@nara.platform/dock';
import { axiosApi, setCustomDialog } from '@nara.platform/accent';
import { Dialog } from 'shared/components';
import { isSuperManager } from 'shared/ui';
import { currentAudienceId } from 'lib/common';
import CollegeService from './college/present/logic/CollegeService';
import { UserWorkspaceService } from 'userworkspace';
import { ContentsProviderService } from 'college';

export function AppInitializer() {
  initApp();
  CollegeService.instance.init();
  UserWorkspaceService.instance.findAllUserWorkspacesMap();
  ContentsProviderService.instance.findAllContentsProviders();
  return null;
}

function initApp() {
  initAxios();
  initDialog();

  function initAxios() {
    if (isSuperManager()) {
      axiosApi.interceptors.request.use((config) => {
        config.headers.audienceId = currentAudienceId();
        config.headers.cineroomIds = [patronInfo.getCineroomId()];
        return config;
      });
    }

    if (process.env.NODE_ENV !== 'development') {
      axiosApi.setCatch(401, () => (window.location.href = '/login'));
    }
  }

  function initDialog() {
    setCustomDialog(onCustomDialog);

    function onCustomDialog(options: any) {
      const { type, title, message, warning, onClose, onOk, onCancel } = options;

      if (type === 'alert') {
        return <Dialog warning={warning} title={title} message={message} onClose={onClose} onCancel={onCancel} />;
      } else if (type === 'confirm') {
        const okFunction = typeof onOk === 'function' ? onOk : () => {};

        return <Dialog warning={warning} title={title} message={message} onOk={okFunction} onCancel={onCancel} />;
      }
      return null;
    }
  }
}
